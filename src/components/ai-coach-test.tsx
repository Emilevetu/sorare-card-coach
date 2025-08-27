import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { callOpenAI, ChatMessage, UserCard } from '@/lib/openai-config';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface AICoachTestProps {
  userCards?: UserCard[];
}

export function AICoachTest({ userCards }: AICoachTestProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: userCards && userCards.length > 0 
        ? `Hello Boss ! Tu veux des conseils du coach ? J'ai accès à tes ${userCards.length} cartes et je peux t'aider à optimiser ta collection ! 🔥`
        : 'Hello Boss ! Tu veux des conseils du coach ? 💪',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Ajouter le message utilisateur à l'historique
      const newUserChatMessage: ChatMessage = {
        role: 'user',
        content: inputValue
      };
      
      const updatedHistory = [...conversationHistory, newUserChatMessage];
      setConversationHistory(updatedHistory);

      // Appeler l'API OpenAI avec les cartes utilisateur
      const aiResponse = await callOpenAI(inputValue, updatedHistory, userCards);

      // Ajouter la réponse de l'IA à l'historique
      const newAIChatMessage: ChatMessage = {
        role: 'assistant',
        content: aiResponse
      };
      
      setConversationHistory([...updatedHistory, newAIChatMessage]);

      // Ajouter la réponse à l'affichage
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Erreur lors de l\'appel OpenAI:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Désolé, une erreur s\'est produite lors de la communication avec l\'IA. Veuillez réessayer.',
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="w-full max-h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            💬 Mon Coach Test
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
                          setMessages([{
              id: '1',
              text: userCards && userCards.length > 0 
                ? `Hello Boss ! Tu veux des conseils du coach ? J'ai accès à tes ${userCards.length} cartes et je peux t'aider à optimiser ta collection ! 🔥`
                : 'Hello Boss ! Tu veux des conseils du coach ? 💪',
              isUser: false,
              timestamp: new Date()
            }]);
              setConversationHistory([]);
            }}
          >
            Effacer l'historique
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-4 pt-0">
        {/* Zone de messages */}
        <div className="flex-1 mb-4 overflow-y-auto max-h-[400px] pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.isUser
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.isUser ? (
                    <p className="text-sm">{message.text}</p>
                  ) : (
                    <div className="text-sm prose prose-sm max-w-none">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          // Personnalisation des styles pour le Markdown
                          h1: ({children}) => <h1 className="text-lg font-bold mb-2 text-gray-900">{children}</h1>,
                          h2: ({children}) => <h2 className="text-base font-bold mb-2 text-gray-900">{children}</h2>,
                          h3: ({children}) => <h3 className="text-sm font-bold mb-1 text-gray-900">{children}</h3>,
                          p: ({children}) => <p className="mb-2 leading-relaxed">{children}</p>,
                          ul: ({children}) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                          ol: ({children}) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                          li: ({children}) => <li className="text-sm">{children}</li>,
                          strong: ({children}) => <strong className="font-bold text-gray-900">{children}</strong>,
                          em: ({children}) => <em className="italic">{children}</em>,
                          code: ({children}) => <code className="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                          blockquote: ({children}) => <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600">{children}</blockquote>,
                        }}
                      >
                        {message.text}
                      </ReactMarkdown>
                    </div>
                  )}
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 rounded-lg px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Zone de saisie */}
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tapez votre message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="sm"
          >
            Envoyer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

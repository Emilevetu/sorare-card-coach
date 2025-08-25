import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 shadow-card">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium text-destructive mb-1">Erreur</h3>
          <p className="text-sm text-destructive/80">{message}</p>
        </div>
      </div>
    </div>
  );
}
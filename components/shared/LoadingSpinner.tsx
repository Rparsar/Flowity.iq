import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  text?: string;
  className?: string;
}

export function LoadingSpinner({ text = "Cargando...", className }: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center justify-center gap-2 py-12 text-muted-foreground ${className ?? ""}`}>
      <Loader2 className="h-5 w-5 animate-spin" />
      <span className="text-sm">{text}</span>
    </div>
  );
}

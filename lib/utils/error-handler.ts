import { toast } from "@/components/ui/use-toast";

export class APIError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'APIError';
  }
}

export async function handleApiError(error: unknown): Promise<never> {
  console.error('API Error:', error);
  
  let message = 'An unexpected error occurred';
  
  if (error instanceof APIError) {
    message = error.message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  toast({
    title: "Error",
    description: message,
    variant: "destructive",
  });

  throw error;
}

export function withErrorHandler<T>(promise: Promise<T>): Promise<T> {
  return promise.catch((error) => handleApiError(error));
} 
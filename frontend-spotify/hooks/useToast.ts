import { toast } from "sonner";

export function useToast() {
  return {
    success: (message: string, description?: string) => {
      toast.success(message, {
        description,
      });
    },
    error: (message: string, description?: string) => {
      toast.error(message, {
        description,
      });
    },
    loading: (message: string, description?: string) => {
      return toast.loading(message, {
        description,
      });
    },
    promise: <T>(
      promise: Promise<T>,
      {
        loading,
        success,
        error,
      }: {
        loading: string;
        success: string | ((data: T) => string);
        error: string | ((err: Error) => string);
      }
    ) => {
      return toast.promise(promise, {
        loading,
        success,
        error,
      });
    },
    info: (message: string, description?: string) => {
      toast(message, {
        description,
      });
    },
    dismiss: (toastId?: string | number) => {
      toast.dismiss(toastId);
    },
  };
}

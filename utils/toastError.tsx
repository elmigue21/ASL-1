import { toast } from "sonner";

export interface ToastErrorOptions {
  title: string;
  description?: string;
}

export function toastError({ title, description }: ToastErrorOptions): void {
  const message = (
    <>
      <strong>{title}</strong>
      {description && <div>{description}</div>}
    </>
  );

  toast.error(message);
}

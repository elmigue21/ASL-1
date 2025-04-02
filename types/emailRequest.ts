export interface EmailRequest {
  recipients: string[];
  subject: string;
  text?: string;
  html?: string;
}

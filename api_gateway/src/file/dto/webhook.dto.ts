/**
 * Cloudinary Webhook Payload
 * https://cloudinary.com/documentation/notifications
 */
export class CloudinaryWebhookPayload {
  notification_type: string; // 'upload_base64', 'resource.complete', etc.
  timestamp: number;
  event_id: string;
  public_id: string;
  version: number;
  signature: string;
  type?: string;
  resource_type: string;
  format: string;
  url: string;
  secure_url: string;
  bytes?: number;
  width?: number;
  height?: number;
  duration?: number;
  created_at?: string;
  folder?: string;
  // Custom params passed during upload
  context?: {
    custom?: {
      [key: string]: string;
    };
  };
  // Metadata
  tags?: string[];
  etag?: string;
  placeholder?: boolean;
}

export class FileUploadedEvent {
  publicId: string;
  url: string;
  secureUrl: string;
  resourceType: string;
  format: string;
  bytes?: number;
  width?: number;
  height?: number;
  duration?: number;
  uploadedBy?: string;
  folder?: string;
  timestamp: number;
  eventId: string;
}

export class FileProcessedEvent {
  databaseId: string;
  publicId: string;
  uploadedBy: string;
  timestamp: number;
}

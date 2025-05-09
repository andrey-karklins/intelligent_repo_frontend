import { ApiController } from './base';

export interface UploadStatus {
  success: boolean;
  message: string;
}

export interface UploadDocumentsResponse {
  message?: string;
}

/** Controller for document-related API endpoints */
export class DocumentsApi extends ApiController {
  private static instance: DocumentsApi;

  private constructor() {
    super();
  }

  /** Get singleton instance */
  public static getInstance(): DocumentsApi {
    if (!DocumentsApi.instance) {
      DocumentsApi.instance = new DocumentsApi();
    }
    return DocumentsApi.instance;
  }

  /** Upload documents with optional description */
  public async uploadDocuments(files: File[], description?: string): Promise<UploadStatus> {
    try {
      const formData = new FormData();
      formData.append('description', description || 'Description for these files');
      files.forEach(file => formData.append('files', file));
      
      const data = await this.uploadFiles<UploadDocumentsResponse>('/api/documents/upload', formData);
      
      return {
        success: true,
        message: data.message || 'Files uploaded successfully!'
      };
    } catch (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred during upload. Please try again.'
      };
    }
  }
}

// Export default instance
export const documentsApi = DocumentsApi.getInstance();

// Export upload function for backward compatibility
export const uploadDocuments = (files: File[], description?: string) => 
  documentsApi.uploadDocuments(files, description); 
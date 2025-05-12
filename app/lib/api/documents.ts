import { ApiController } from './base';

export interface UploadStatus {
  success: boolean;
  message: string;
}

export interface UploadDocumentsResponse {
  uploaded: {
    filename: string;
    url?: string;
    error?: string;
  }[];
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
      
      // Append each file individually to match FastAPI's List[UploadFile]
      for (const file of files) {
        // The field name must be 'files' to match the FastAPI parameter
        // We must append each file separately with the same field name
        formData.append('files', file);
      }
      
      const data = await this.uploadFiles<UploadDocumentsResponse>('/upload', formData);
      
      // Check if any files had errors
      const errors = data.uploaded.filter(result => result.error);
      if (errors.length > 0) {
        return {
          success: false,
          message: `Failed to upload some files: ${errors.map(e => `${e.filename} (${e.error})`).join(', ')}`
        };
      }
      
      return {
        success: true,
        message: `Successfully uploaded ${data.uploaded.length} file(s)!`
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
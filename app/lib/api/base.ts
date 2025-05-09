/** HTTP request methods supported by the API */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/** Base request options */
interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string>;
  signal?: AbortSignal;
}

/** Options for requests with body */
interface RequestOptionsWithBody extends RequestOptions {
  body?: BodyInit | null;
  contentType?: string;
}

/** API error structure */
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** Base controller for API requests */
export class ApiController {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    this.defaultHeaders = {
      'Accept': 'application/json',
    };
  }

  /** Build complete URL with query parameters */
  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    const url = new URL(endpoint, this.baseUrl);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    
    return url.toString();
  }

  /** Merge default and custom headers */
  private mergeHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    return {
      ...this.defaultHeaders,
      ...customHeaders,
    };
  }

  /** Handle API response */
  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');
    
    const data = isJson ? await response.json() : await response.text();
    
    if (!response.ok) {
      throw new ApiError(
        data.message || 'An error occurred',
        response.status,
        data
      );
    }
    
    return data as T;
  }

  /** Handle API errors */
  private handleError(error: unknown): never {
    if (error instanceof ApiError) {
      throw error;
    }
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new ApiError('Request was cancelled');
      }
      throw new ApiError(error.message);
    }
    
    throw new ApiError('An unexpected error occurred');
  }

  /** Make GET request */
  protected async get<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { headers, params, signal } = options;
    const requestHeaders = this.mergeHeaders(headers);

    try {
      const response = await fetch(this.buildUrl(endpoint, params), {
        method: 'GET',
        headers: requestHeaders,
        signal,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  /** Make POST request */
  protected async post<T>(
    endpoint: string,
    options: RequestOptionsWithBody = {}
  ): Promise<T> {
    const { body, contentType, headers, params, signal } = options;
    const requestHeaders = this.mergeHeaders(headers);
    
    if (body && contentType) {
      requestHeaders['Content-Type'] = contentType;
    }

    try {
      const response = await fetch(this.buildUrl(endpoint, params), {
        method: 'POST',
        headers: requestHeaders,
        body,
        signal,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  /** Upload files with FormData */
  protected async uploadFiles<T>(
    endpoint: string,
    formData: FormData,
    options: RequestOptions = {}
  ): Promise<T> {
    return this.post<T>(endpoint, {
      ...options,
      body: formData,
    });
  }
} 
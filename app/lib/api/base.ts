/** HTTP request methods supported by the API */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/** Request options for API calls */
interface RequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: BodyInit;
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

/** Base class for API controllers */
export class ApiController {
  private baseUrl: string;

  protected constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  }

  /** Make a GET request */
  protected async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  /** Make a POST request */
  protected async post<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST' });
  }

  /** Make a PUT request */
  protected async put<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT' });
  }

  /** Make a DELETE request */
  protected async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  /** Make a PATCH request */
  protected async patch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH' });
  }

  /** Make an HTTP request */
  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', headers = {}, body } = options;

    // Build request URL
    const url = new URL(endpoint, this.baseUrl);

    // Make request
    const response = await fetch(url.toString(), {
      method,
      headers: {
        'Accept': 'application/json',
        ...(!body || body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...headers,
      },
      body: body instanceof FormData ? body : JSON.stringify(body),
    });

    // Parse response
    const data = await response.json();

    // Handle error responses
    if (!response.ok) {
      throw new ApiError(
        data.message || 'An error occurred',
        response.status,
        data
      );
    }

    return data;
  }

  /** Upload files with FormData */
  protected async uploadFiles<T>(
    endpoint: string,
    formData: FormData,
    options: RequestOptions = {}
  ): Promise<T> {
    // Don't set any Content-Type header - let the browser set it with the boundary
    const headers = {
      ...options.headers,
      'Accept': 'application/json',
    };

    // Ensure proper multipart/form-data handling
    return this.post<T>(endpoint, {
      ...options,
      headers,
      body: formData,
    });
  }
} 
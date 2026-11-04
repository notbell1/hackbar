import { ScopeRepository } from '@/storage/repositories/ScopeRepository';
import { SettingsRepository } from '@/storage/repositories/SettingsRepository';

export interface HttpRequestOptions {
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: string;
  timeoutMs?: number;
  skipScopeCheck?: boolean;
}

export interface HttpResponseResult {
  ok: boolean;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  durationMs: number;
  sizeBytes: number;
  url: string;
  isTruncated?: boolean;
  error?: string;
}

export class HttpClient {
  static async execute(options: HttpRequestOptions): Promise<HttpResponseResult> {
    const settings = await SettingsRepository.get();
    const timeoutMs = options.timeoutMs || settings.defaultTimeoutMs;
    const maxSizeBytes = settings.maxResponseSizeBytes;

    // 1. Validate Scope
    if (!options.skipScopeCheck) {
      const scopeCheck = await ScopeRepository.isAllowed(options.url, settings.allowPrivateNetworks);
      if (!scopeCheck.allowed) {
        throw new Error(`Scope Violation: ${scopeCheck.reason}`);
      }
    }

    // 2. Setup AbortController for Timeout & Cancellation
    const controller = new AbortController();
    const timer = setTimeout(() => {
      controller.abort();
    }, timeoutMs);

    const startTime = performance.now();

    try {
      const fetchHeaders: HeadersInit = { ...options.headers };

      const fetchOptions: RequestInit = {
        method: options.method.toUpperCase(),
        headers: fetchHeaders,
        credentials: 'include',
        signal: controller.signal
      };

      // Only attach body if method allows it
      if (
        options.body &&
        !['GET', 'HEAD'].includes(options.method.toUpperCase())
      ) {
        fetchOptions.body = options.body;
      }

      const response = await fetch(options.url, fetchOptions);
      const durationMs = Math.round(performance.now() - startTime);

      // Extract response headers
      const resHeaders: Record<string, string> = {};
      response.headers.forEach((val, key) => {
        resHeaders[key] = val;
      });

      // Stream / limit response size
      const reader = response.body?.getReader();
      let bodyText = '';
      let receivedBytes = 0;
      let isTruncated = false;

      if (reader) {
        const chunks: Uint8Array[] = [];
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            receivedBytes += value.length;
            if (receivedBytes > maxSizeBytes) {
              isTruncated = true;
              chunks.push(value.subarray(0, maxSizeBytes - (receivedBytes - value.length)));
              reader.cancel();
              break;
            } else {
              chunks.push(value);
            }
          }
        }

        // Decode chunks
        const total = new Uint8Array(chunks.reduce((acc, c) => acc + c.length, 0));
        let offset = 0;
        for (const chunk of chunks) {
          total.set(chunk, offset);
          offset += chunk.length;
        }
        bodyText = new TextDecoder().decode(total);
      } else {
        bodyText = await response.text();
        receivedBytes = new TextEncoder().encode(bodyText).length;
      }

      return {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        headers: resHeaders,
        body: bodyText,
        durationMs,
        sizeBytes: receivedBytes,
        url: response.url || options.url,
        isTruncated
      };
    } catch (err: unknown) {
      const durationMs = Math.round(performance.now() - startTime);
      let errorMsg = 'Unknown network error';

      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorMsg = `Request timed out after ${timeoutMs}ms or was cancelled.`;
        } else if (err.message.includes('Failed to fetch')) {
          errorMsg =
            'Failed to fetch: Host permission missing, CORS restricted, or target host unreachable.';
        } else {
          errorMsg = err.message;
        }
      }

      return {
        ok: false,
        status: 0,
        statusText: 'ERR_FAILED',
        headers: {},
        body: '',
        durationMs,
        sizeBytes: 0,
        url: options.url,
        error: errorMsg
      };
    } finally {
      clearTimeout(timer);
    }
  }
}


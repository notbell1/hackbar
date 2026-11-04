export type ExtensionMessage =
  | { type: 'GET_ACTIVE_TAB' }
  | { type: 'REQUEST_PERMISSION'; origin: string }
  | { type: 'CHECK_PERMISSION'; origin: string }
  | { type: 'OPEN_SIDE_PANEL'; windowId: number }
  | { type: 'EXECUTE_FETCH'; request: SerializedFetchRequest };

export interface SerializedFetchRequest {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
  timeoutMs?: number;
}

export interface SerializedFetchResponse {
  ok: boolean;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  durationMs: number;
  url: string;
  error?: string;
}

export type ExtensionResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};


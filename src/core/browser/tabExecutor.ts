/**
 * Browser Tab Executor
 * Executes requests directly in the active Chrome browser tab (classic HackBar style).
 * Handles both GET navigation and POST form submissions.
 */

import { normalizeTargetUrl } from '../url/normalizer';

export interface TabExecutionResult {
  success: boolean;
  message: string;
  tabId?: number;
}

export const TabExecutor = {
  /**
   * Execute request in the current active Chrome tab
   */
  async execute(
    url: string,
    method = 'GET',
    body?: string,
    bodyType?: string
  ): Promise<TabExecutionResult> {
    if (typeof chrome === 'undefined' || !chrome.tabs) {
      return {
        success: false,
        message: 'Chrome Tabs API is unavailable in this environment'
      };
    }

    try {
      const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!activeTab || !activeTab.id) {
        return { success: false, message: 'No active browser tab found' };
      }

      const { url: cleanUrl } = normalizeTargetUrl(url);
      const upperMethod = method.toUpperCase();

      // For GET / HEAD requests: Direct browser tab navigation
      if (upperMethod === 'GET' || upperMethod === 'HEAD' || !body?.trim()) {
        await chrome.tabs.update(activeTab.id, { url: cleanUrl });
        return {
          success: true,
          message: `Browser tab navigated to ${cleanUrl}`,
          tabId: activeTab.id
        };
      }

      // For POST / PUT with body: Dynamic form submission in page context
      if (activeTab.url?.startsWith('chrome://') || activeTab.url?.startsWith('chrome-extension://')) {
        // Cannot inject script into internal chrome:// pages, so navigate first
        await chrome.tabs.update(activeTab.id, { url: cleanUrl });
        return {
          success: true,
          message: 'Navigated to target URL (internal page cannot be scripted directly)',
          tabId: activeTab.id
        };
      }

      // Parse body fields for form submission
      const fields: [string, string][] = [];
      if (bodyType === 'form' || body?.includes('=')) {
        const params = new URLSearchParams(body);
        params.forEach((value, key) => {
          fields.push([key, value]);
        });
      }

      if (chrome.scripting && chrome.scripting.executeScript) {
        await chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          func: (targetUrl: string, postMethod: string, formFields: [string, string][], rawBody?: string) => {
            const form = document.createElement('form');
            form.method = postMethod;
            form.action = targetUrl;
            form.style.display = 'none';

            if (formFields && formFields.length > 0) {
              formFields.forEach(([k, v]) => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = k;
                input.value = v;
                form.appendChild(input);
              });
            } else if (rawBody) {
              const textarea = document.createElement('textarea');
              textarea.name = 'raw_data';
              textarea.value = rawBody;
              form.appendChild(textarea);
            }

            document.body.appendChild(form);
            form.submit();
          },
          args: [cleanUrl, upperMethod, fields, body]
        });

        return {
          success: true,
          message: `Submitted ${upperMethod} form directly in active tab`,
          tabId: activeTab.id
        };
      } else {
        // Fallback: regular tab navigation
        await chrome.tabs.update(activeTab.id, { url: cleanUrl });
        return {
          success: true,
          message: `Navigated tab to ${cleanUrl}`,
          tabId: activeTab.id
        };
      }
    } catch (err: unknown) {
      return {
        success: false,
        message: err instanceof Error ? err.message : String(err)
      };
    }
  }
};


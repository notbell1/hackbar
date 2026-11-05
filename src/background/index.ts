import { ExtensionMessage, ExtensionResponse } from '@/types/messages';

// Safely configure side panel to open upon clicking the extension action icon
if (typeof chrome !== 'undefined' && chrome.sidePanel && typeof chrome.sidePanel.setPanelBehavior === 'function') {
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => {
      // Catch and suppress if panel behavior cannot be set in current context
      console.warn('Notice: setPanelBehavior not available or restricted:', error);
    });
}

// Setup context menu on installation with safe duplicate removal
if (typeof chrome !== 'undefined' && chrome.runtime?.onInstalled) {
  chrome.runtime.onInstalled.addListener(() => {
    if (chrome.contextMenus && typeof chrome.contextMenus.removeAll === 'function') {
      chrome.contextMenus.removeAll(() => {
        // Ignore any errors during removeAll
        if (chrome.runtime.lastError) {
          /* no-op */
        }
        chrome.contextMenus.create(
          {
            id: 'xeoo-send-to-hackbar',
            title: 'Open URL in ZX HACKBAR',
            contexts: ['link', 'page']
          },
          () => {
            // Consume lastError to avoid Chrome Error banner in chrome://extensions
            if (chrome.runtime.lastError) {
              console.warn('Context menu creation warning:', chrome.runtime.lastError.message);
            }
          }
        );
      });
    }
  });
}

// Context menu click listener
if (typeof chrome !== 'undefined' && chrome.contextMenus?.onClicked) {
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'xeoo-send-to-hackbar') {
      const targetUrl = info.linkUrl || info.pageUrl;
      if (targetUrl && chrome.storage?.local) {
        chrome.storage.local.set({ pendingTargetUrl: targetUrl });
      }
      if (tab?.windowId && chrome.sidePanel && typeof chrome.sidePanel.open === 'function') {
        chrome.sidePanel.open({ windowId: tab.windowId }).catch((err) => {
          console.warn('Notice: sidePanel.open from context menu:', err);
        });
      }
    }
  });
}

// Runtime message listener
if (typeof chrome !== 'undefined' && chrome.runtime?.onMessage) {
  chrome.runtime.onMessage.addListener((message: ExtensionMessage, _sender, sendResponse) => {
    handleMessage(message)
      .then((res) => sendResponse(res))
      .catch((err) =>
        sendResponse({
          success: false,
          error: err instanceof Error ? err.message : String(err)
        })
      );
    return true; // Keep channel open for asynchronous sendResponse
  });
}

async function handleMessage(message: ExtensionMessage): Promise<ExtensionResponse> {
  if (!message || typeof message.type !== 'string') {
    return { success: false, error: 'Invalid message structure' };
  }

  switch (message.type) {
    case 'GET_ACTIVE_TAB': {
      try {
        const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!activeTab) {
          return { success: false, error: 'No active tab found' };
        }
        return {
          success: true,
          data: {
            id: activeTab.id,
            title: activeTab.title,
            url: activeTab.url
          }
        };
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : 'Failed to query active tab'
        };
      }
    }

    case 'CHECK_PERMISSION': {
      try {
        const originUrl = new URL(message.origin);
        const originPattern = `${originUrl.protocol}//${originUrl.hostname}/*`;
        const hasPermission = await chrome.permissions.contains({
          origins: [originPattern]
        });
        return { success: true, data: { hasPermission, originPattern } };
      } catch (err) {
        return { success: false, error: 'Invalid origin URL format' };
      }
    }

    case 'REQUEST_PERMISSION': {
      try {
        const originUrl = new URL(message.origin);
        const originPattern = `${originUrl.protocol}//${originUrl.hostname}/*`;
        const granted = await chrome.permissions.request({
          origins: [originPattern]
        });
        return { success: true, data: { granted, originPattern } };
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : 'Permission request failed'
        };
      }
    }

    case 'OPEN_SIDE_PANEL': {
      if (chrome.sidePanel && typeof chrome.sidePanel.open === 'function') {
        try {
          await chrome.sidePanel.open({ windowId: message.windowId });
          return { success: true };
        } catch (err) {
          return {
            success: false,
            error: err instanceof Error ? err.message : 'Failed to open side panel'
          };
        }
      }
      return { success: false, error: 'Side panel API not available' };
    }

    default:
      return { success: false, error: 'Unknown message type' };
  }
}

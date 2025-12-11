console.log("Userex Companion Content Script Active");

let isRecording = false;

// Check initial state
try {
    if (chrome.runtime?.id) {
        chrome.storage.local.get(['isRecording'], (result) => {
            if (chrome.runtime.lastError) return;
            isRecording = !!result.isRecording;
        });
    }
} catch (e) {
    // Context invalid, ignore
}

// Listen for state changes
try {
    if (chrome.runtime?.id) {
        chrome.storage.onChanged.addListener((changes: { [key: string]: chrome.storage.StorageChange }) => {
            if (changes.isRecording) {
                isRecording = changes.isRecording.newValue as boolean;
                if (isRecording) console.log("Recording started...");
                else console.log("Recording stopped.");
            }
        });
    }
} catch (e) {
    // Context invalid
}

// Relay messages from Dashboard to Background
window.addEventListener("message", (event) => {
    if (event.source !== window) return;
    if (event.data.type && event.data.type === "USEREX_DASHBOARD_COMMAND") {
        console.log("Relaying dashboard command:", event.data);

        // Check validity
        try {
            if (!chrome.runtime?.id) throw new Error("Context invalidated");

            chrome.runtime.sendMessage(event.data).catch(err => {
                console.warn("Could not send message to background:", err);
            });
        } catch (e) {
            console.error("Userex Extension connection lost. Please refresh the page.");
        }
    }
}, false);

// Listen for background messages (like SCAN_COMPLETE) and relay to Window
chrome.runtime.onMessage.addListener((request, _sender, _sendResponse) => {
    if (request.type === 'SCAN_COMPLETE') {
        window.postMessage({
            type: 'USEREX_EXTENSION_RESPONSE',
            responseType: 'SCAN_COMPLETE',
            data: request.data
        }, "*");
    }
    else if (request.type === 'SCAN_LOG') {
        window.postMessage({
            type: 'USEREX_EXTENSION_RESPONSE',
            responseType: 'SCAN_LOG',
            message: request.message
        }, "*");
    }
    else if (request.type === 'TEST_SUITE_UPDATE' || request.type === 'TEST_SUITE_COMPLETE') {
        window.postMessage({
            type: 'USEREX_EXTENSION_RESPONSE',
            responseType: request.type,
            data: request
        }, "*");
    }
});

document.addEventListener('click', (e) => {
    if (!isRecording) return;

    const target = e.target as HTMLElement;

    // Send event to background for screenshot capture
    chrome.runtime.sendMessage({
        type: 'CAPTURE_EVENT',
        payload: {
            eventType: 'click',
            element: target.tagName,
            id: target.id,
            className: target.className,
            text: target.innerText?.substring(0, 50),
            x: e.clientX,
            y: e.clientY
        }
    });
}, true);

// Helper to find element by robust selector
const findElement = (selector: string): Element | null => {
    // Handle "tag:contains('text')" or "tag:text('text')"
    if (selector.includes(':contains') || selector.includes(':text')) {
        const match = selector.match(/([a-zA-Z0-9_-]+):(contains|text)\('(.+)'\)/);
        if (match) {
            const tagName = match[1];
            const text = match[3]; // Group 3 is the text content
            const elements = Array.from(document.querySelectorAll(tagName));

            // Try exact match first, then partial
            const exact = elements.find(el => (el as HTMLElement).innerText?.trim() === text);
            if (exact) return exact;

            return elements.find(el => (el as HTMLElement).innerText?.includes(text)) || null;
        }
    }

    // Fallback to standard querySelector
    try {
        return document.querySelector(selector);
    } catch (e) {
        console.warn("Invalid selector:", selector);
        return null; // Fail gracefully
    }
};

// --- Visual Feedback Helper ---
class VisualCursor {
    cursor: HTMLElement | null = null;

    init() {
        if (this.cursor) return;

        // Create Cursor Element
        const cursor = document.createElement('div');
        cursor.id = 'userex-cursor';
        cursor.style.position = 'fixed';
        cursor.style.zIndex = '2147483647';
        cursor.style.pointerEvents = 'none';
        cursor.style.transition = 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1)'; // Smooth easing
        cursor.style.width = '32px';
        cursor.style.height = '32px';
        cursor.innerHTML = `
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 2L26 22L16.5 24L22 34L17 36.5L11.5 26.5L2 30V2Z" fill="#10B981" stroke="white" stroke-width="2"/>
            </svg>
        `;
        document.body.appendChild(cursor);
        this.cursor = cursor;

        // Add Highlight Styles
        const style = document.createElement('style');
        style.textContent = `
            .userex-highlight {
                outline: 2px solid #10B981 !important;
                outline-offset: 4px !important;
                box-shadow: 0 0 15px rgba(16, 185, 129, 0.5) !important;
                transition: all 0.3s ease !important;
            }
            .userex-click-ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(16, 185, 129, 0.4);
                transform: scale(0);
                animation: userex-ripple 0.4s linear;
                pointer-events: none;
                z-index: 999998;
            }
            @keyframes userex-ripple {
                to { transform: scale(2.5); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    async moveTo(element: HTMLElement) {
        if (!this.cursor) this.init();

        // Scroll into view first
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Wait for scroll
        await new Promise(r => setTimeout(r, 600));

        const rect = element.getBoundingClientRect();
        if (this.cursor) {
            this.cursor.style.top = `${rect.top + rect.height / 2}px`;
            this.cursor.style.left = `${rect.left + rect.width / 2}px`;
            this.cursor.style.opacity = '1';
        }

        // Wait for movement
        await new Promise(r => setTimeout(r, 800));
    }

    highlight(element: HTMLElement) {
        element.classList.add('userex-highlight');
        // Remove after a while
        setTimeout(() => element.classList.remove('userex-highlight'), 1500);
    }

    clickEffect(element: HTMLElement) {
        const rect = element.getBoundingClientRect();
        const ripple = document.createElement('div');
        ripple.className = 'userex-click-ripple';
        ripple.style.width = `${Math.max(rect.width, rect.height)}px`;
        ripple.style.height = `${Math.max(rect.width, rect.height)}px`;
        ripple.style.left = `${rect.left}px`;
        ripple.style.top = `${rect.top}px`;
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 400);
    }

    showBanner(text: string, type: 'info' | 'error' | 'success' = 'info') {
        let banner = document.getElementById('userex-banner');
        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'userex-banner';
            banner.style.position = 'fixed';
            banner.style.top = '20px';
            banner.style.left = '50%';
            banner.style.transform = 'translateX(-50%)';
            banner.style.zIndex = '2147483647'; // Max Z-Index
            banner.style.padding = '12px 24px';
            banner.style.borderRadius = '30px';
            banner.style.fontFamily = 'system-ui, -apple-system, sans-serif';
            banner.style.fontSize = '14px';
            banner.style.fontWeight = '600';
            banner.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)';
            banner.style.display = 'flex';
            banner.style.alignItems = 'center';
            banner.style.gap = '10px';
            banner.style.pointerEvents = 'none';
            banner.style.transition = 'all 0.3s ease';

            const style = document.createElement('style');
            style.textContent = `@keyframes userex-pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }`;
            document.head.appendChild(style);
            document.body.appendChild(banner);
        }

        // Update Design based on state
        if (type === 'error') {
            banner.style.background = '#EF4444';
            banner.style.color = 'white';
        } else if (type === 'success') {
            banner.style.background = '#10B981';
            banner.style.color = 'white';
        } else {
            banner.style.background = '#000000';
            banner.style.color = '#10B981';
        }

        banner.innerHTML = `
            <span style="display:inline-block; width:8px; height:8px; background:currentColor; border-radius:50%; animation:userex-pulse 1s infinite"></span>
            <span>${text}</span>
        `;
    }
}

const visualCursor = new VisualCursor();

// Async Handler for Execution
const handleExecuteAction = async (step: any, sendResponse: (r: any) => void) => {
    console.log("Executing:", step);

    try {
        visualCursor.showBanner(`Searching: ${step.target.slice(0, 30)}...`);

        const el = findElement(step.target);
        if (!el) {
            visualCursor.showBanner(`Error: Element missing | ${step.target.slice(0, 20)}...`, 'error');
            throw new Error(`Element not found: ${step.target}`);
        }

        visualCursor.showBanner(`Target Found! Approaching...`);

        // 1. Visual Move
        await visualCursor.moveTo(el as HTMLElement);

        // 2. Highlight
        visualCursor.highlight(el as HTMLElement);
        visualCursor.showBanner(`Action: ${step.action.toUpperCase()}`, 'success');

        await new Promise(r => setTimeout(r, 600)); // Pause for observation

        if (step.action === 'click') {
            visualCursor.clickEffect(el as HTMLElement);
            (el as HTMLElement).click();
        } else if (step.action === 'type') {
            (el as HTMLInputElement).value = step.value || '';
            (el as HTMLInputElement).dispatchEvent(new Event('input', { bubbles: true }));
            (el as HTMLInputElement).dispatchEvent(new Event('change', { bubbles: true }));
        }

        // Wait a bit after action
        await new Promise(r => setTimeout(r, 800));
        visualCursor.showBanner('Step Complete', 'info');

        sendResponse({ success: true });

    } catch (e: any) {
        console.error("Exec error:", e);
        sendResponse({ success: false, error: e.message });
        setTimeout(() => visualCursor.showBanner('Test Failed', 'error'), 1000);
    }
};

// Autopilot Action Executor
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.type === 'EXECUTE_ACTION') {
        handleExecuteAction(request.action, sendResponse);
        return true; // Keep channel open for async response
    }
    else if (request.type === 'SCAN_PAGE') {
        console.log('[Autopilot] Scanning page for interactive elements...');

        const interactiveElements: any[] = [];

        // Helper to extract info
        const extractInfo = (el: Element) => {
            const rect = el.getBoundingClientRect();
            // Ignore hidden elements
            if (rect.width === 0 || rect.height === 0 || getComputedStyle(el).visibility === 'hidden') return null;

            return {
                tagName: el.tagName.toLowerCase(),
                id: el.id,
                className: el.className,
                innerText: (el as HTMLElement).innerText?.slice(0, 50) || '',
                placeholder: (el as HTMLInputElement).placeholder || '',
                type: (el as HTMLInputElement).type || '',
                href: (el as HTMLAnchorElement).href || ''
            };
        };

        // Scan Buttons
        document.querySelectorAll('button, input[type="button"], input[type="submit"]').forEach(el => {
            const info = extractInfo(el);
            if (info) interactiveElements.push({ ...info, role: 'button' });
        });

        // Scan Inputs
        document.querySelectorAll('input:not([type="hidden"]):not([type="button"]):not([type="submit"]), textarea, select').forEach(el => {
            const info = extractInfo(el);
            if (info) interactiveElements.push({ ...info, role: 'input' });
        });

        // Scan Links (only those that look like nav or actions, simpler filter)
        document.querySelectorAll('a[href]').forEach(el => {
            const info = extractInfo(el);
            // Filter out empty links or vastly long text
            if (info && info.innerText.length > 0 && info.innerText.length < 30) {
                interactiveElements.push({ ...info, role: 'link' });
            }
        });

        console.log(`[Autopilot] Found ${interactiveElements.length} elements.`);
        sendResponse({ success: true, elements: interactiveElements, url: window.location.href, title: document.title });
    }
});

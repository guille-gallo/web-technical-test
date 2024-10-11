import { JSDOM } from 'jsdom';

declare global {
  namespace NodeJS {
    interface Global {
      document: Document;
      window: Window;
      navigator: Navigator;
      HTMLElement: typeof HTMLElement;
      HTMLAnchorElement: typeof HTMLAnchorElement;
      customElements: CustomElementRegistry;
      IS_REACT_ACT_ENVIRONMENT: boolean;
    }
  }
}

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
});

global.window = dom.window as unknown as Window & typeof globalThis;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

// Add any other globals your app might need
global.HTMLElement = dom.window.HTMLElement;
global.HTMLAnchorElement = dom.window.HTMLAnchorElement;
global.customElements = dom.window.customElements;

// This is needed for React 18+
(global as any).IS_REACT_ACT_ENVIRONMENT = true;

// Provide mock implementations for TextEncoder and TextDecoder if needed
if (typeof TextEncoder === 'undefined') {
  (global as any).TextEncoder = class {
    encode(input?: string): Uint8Array {
      return new Uint8Array(Buffer.from(input || ''));
    }
  };
}

if (typeof TextDecoder === 'undefined') {
  (global as any).TextDecoder = class {
    decode(input?: Uint8Array): string {
      return Buffer.from(input || []).toString();
    }
  };
}
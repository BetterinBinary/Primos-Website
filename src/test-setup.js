import '@testing-library/jest-dom';

// Mock ResizeObserver for tests
// @ts-ignore
global.ResizeObserver = class ResizeObserver {
  // @ts-ignore
  constructor(cb) {
    this.cb = cb;
  }
  observe() {
    this.cb([{ borderBoxSize: { inlineSize: 0, blockSize: 0 } }], this);
  }
  unobserve() {}
  disconnect() {}
};

// Mock IntersectionObserver for tests
// @ts-ignore
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};
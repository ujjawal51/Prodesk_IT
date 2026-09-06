require('@testing-library/jest-dom');

// Global fetch mock helper if not defined in test
if (!global.fetch) {
  global.fetch = jest.fn();
}

import '@testing-library/jest-dom';

// Polyfill fetch for Jest tests
import fetch from 'node-fetch';
global.fetch = fetch;

// Mock localStorage
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Mock fetch
global.fetch = jest.fn();

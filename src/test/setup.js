import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock navigator.share
if (typeof navigator !== 'undefined') {
  Object.defineProperty(navigator, 'share', {
    writable: true,
    value: vi.fn().mockResolvedValue(undefined),
  })
}

// Mock scroll
window.scrollTo = vi.fn()

/* Copyright Contributors to the Open Cluster Management project */

import '@testing-library/jest-dom/extend-expect'
import 'jest-axe/extend-expect'
import { configure } from '@testing-library/dom'

configure({
    testIdAttribute: 'id',
})

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
})

import React from 'react'
import { render } from '@testing-library/react'
import ExampleJSComponent from './ExampleJSComponent'

describe('ExampleJSComponent', () => {
    test('Render a h1 element', () => {
        const { getByText } = render(<ExampleJSComponent text="Test Header" />)
        expect(getByText('Test Header')).toBeInTheDocument()
    })
})

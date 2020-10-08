import React from 'react'
import { render } from '@testing-library/react'
import { AcmSelect } from './AcmSelect'

describe('AcmSelect', () => {
    test('renders', () => {
        const { getByText } = render(
            <AcmSelect id="acm-select" label="ACM select" onChange={() => null} options={['foo', 'bar']} value="foo" />
        )
        expect(getByText('ACM select')).toBeInTheDocument()
    })
})

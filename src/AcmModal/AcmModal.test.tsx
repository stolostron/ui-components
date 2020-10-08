import React from 'react'
import { render } from '@testing-library/react'
import { AcmModal } from './AcmModal'

describe('AcmModal', () => {
    test('renders', () => {
        const { getByText } = render(
            <AcmModal open={true} submit={() => null} cancel={() => null} title="Modal title" message="Modal message" />
        )
        expect(getByText('Modal title')).toBeInTheDocument()
    })
})

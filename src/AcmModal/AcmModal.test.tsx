import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AcmModal } from './AcmModal'

describe('AcmModal', () => {
    test('renders in an open state', () => {
        const onSubmit = jest.fn()
        const onCancel = jest.fn()
        const { getByRole, getByText } = render(
            <AcmModal open={true} submit={onSubmit} cancel={onCancel} title="Modal title" message="Modal message" />
        )
        userEvent.click(getByText('Submit'))
        userEvent.click(getByText('Cancel'))
        expect(getByRole('dialog')).toBeInTheDocument()
        expect(onSubmit).toHaveBeenCalled()
        expect(onCancel).toHaveBeenCalled()
    })
    test('does not render when in a closed state', () => {
        const { container } = render(
            <AcmModal
                open={false}
                submit={() => null}
                cancel={() => null}
                title="Modal title"
                message="Modal message"
            />
        )
        expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument()
    })
})

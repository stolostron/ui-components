import React from 'react'
import { render, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AcmInlineCopy } from './AcmInlineCopy'

document.execCommand = jest.fn()

describe('AcmInlineCopy', async () => {
    test('renders', async () => {
        const { getByTestId } = render(<AcmInlineCopy text="copy text" id="copy" />)
        expect(getByTestId('copy')).toBeInTheDocument()
        await act(async () => {
            await userEvent.click(getByTestId('copy'))
            await expect(document.execCommand).toHaveBeenCalled()
            await new Promise((resolve) => setTimeout(resolve, 0))
        })
    })
})

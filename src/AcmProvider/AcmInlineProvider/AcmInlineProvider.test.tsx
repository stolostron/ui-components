import React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { AcmInlineProvider } from './AcmInlineProvider'
import { Provider, ProviderLongTextMap } from '../'

describe('AcmInlineProvider', () => {
    Object.values(Provider).forEach((provider) => {
        test(`renders - ${provider}`, async () => {
            const { container, getByRole, getByText } = render(<AcmInlineProvider provider={provider} />)
            expect(getByRole('presentation')).toBeInTheDocument()
            expect(getByText(ProviderLongTextMap[provider])).toBeInTheDocument()
            expect(await axe(container)).toHaveNoViolations()
        })
    })
})

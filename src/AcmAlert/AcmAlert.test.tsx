import React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { AlertVariant } from '@patternfly/react-core'
import { AcmAlert, AcmAlertGroup } from './AcmAlert'

describe('AcmAlert', () => {
    test('renders with subtitle of type: string', () => {
        const { getByText } = render(<AcmAlert title="Acm Alert title" subtitle="Acm Alert subtitle" />)
        expect(getByText('Acm Alert title')).toBeInTheDocument()
        expect(getByText('Acm Alert subtitle')).toBeInTheDocument()
    })
    test('renders with subtitle of type: node', () => {
        const { getByTestId } = render(
            <AcmAlert
                title="Acm Alert title"
                subtitle={
                    <span id="subtitle">
                        Acm Alert <strong>subtitle</strong>
                    </span>
                }
            />
        )
        expect(getByTestId('subtitle')).toBeInTheDocument()
    })
    test('renders without subtitle', () => {
        const { queryByText } = render(<AcmAlert title="Acm Alert title" />)
        expect(queryByText('Acm Alert subtitle')).toBeNull()
    })
    test('has zero accessibility defects', async () => {
        const { container } = render(<AcmAlert title="Acm Alert title" />)
        expect(await axe(container)).toHaveNoViolations()
    })
})

describe('AcmAlertGroup', () => {
    const AlertGroup = () => {
        return (
            <AcmAlertGroup>
                {Object.values(AlertVariant).map((variant) => (
                    <AcmAlert key={variant} variant={variant} title="Alert title" subtitle="Alert subtitle" />
                ))}
            </AcmAlertGroup>
        )
    }
    test('renders', () => {
        const { getByRole } = render(<AlertGroup />)
        expect(getByRole('list')).toBeInTheDocument()
    })
})

import React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { AcmAlert } from './AcmAlert'

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

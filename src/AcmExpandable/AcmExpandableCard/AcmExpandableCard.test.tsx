/* Copyright Contributors to the Open Cluster Management project */

import React from 'react'
import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { AcmExpandableCard } from './AcmExpandableCard'

describe('AcmExpandableCard', () => {
    test('renders', async () => {
        const { container, getByText, getByRole } = render(<AcmExpandableCard title="Status">Body</AcmExpandableCard>)
        expect(await axe(container)).toHaveNoViolations()
        expect(getByText('Status')).toBeInTheDocument()
        expect(getByText('Body')).toBeInTheDocument()
        userEvent.click(getByRole('button'))
        await waitFor(() => expect('pf-c-card.pf-m-expanded').toBeNull)
        userEvent.click(getByRole('button'))
        await waitFor(() => expect('pf-c-card.pf-m-expanded').toBeTruthy)
    })
})

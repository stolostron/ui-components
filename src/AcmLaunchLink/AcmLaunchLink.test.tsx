/* Copyright Contributors to the Open Cluster Management project */

import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { AcmLaunchLink } from './AcmLaunchLink'

describe('AcmLaunchLink', () => {
    test('renders a link when only one link is provided', async () => {
        const { container, queryByTestId } = render(
            <AcmLaunchLink links={[{ id: 'grafana', text: 'Grafana', href: '/grafana' }]} />
        )
        expect(queryByTestId('addon-launch-links')).toBeNull()
        expect(queryByTestId('grafana')).toBeInTheDocument()
        expect(await axe(container)).toHaveNoViolations()
    })
    test('renders a dropdown when multiple links are provided', async () => {
        const { container, getByTestId } = render(
            <AcmLaunchLink
                links={[
                    { id: 'grafana', text: 'Grafana', href: '/grafana' },
                    { id: 'logs', text: 'Kibana', href: '/kibana' },
                ]}
            />
        )
        expect(getByTestId('addon-launch-links')).toBeInTheDocument()
        userEvent.click(getByTestId('addon-launch-links'))
        expect(getByTestId('grafana')).toBeInTheDocument()
        expect(getByTestId('logs')).toBeInTheDocument()
        expect(await axe(container)).toHaveNoViolations()
    })
    test('renders null when no links are provided', () => {
        const { queryByRole, queryByTestId } = render(<AcmLaunchLink links={[]} />)
        expect(queryByRole('link')).toBeNull()
        expect(queryByTestId('addon-launch-links')).toBeNull()
    })
    test('renders null when undefined is provided', () => {
        const { queryByRole, queryByTestId } = render(<AcmLaunchLink />)
        expect(queryByRole('link')).toBeNull()
        expect(queryByTestId('addon-launch-links')).toBeNull()
    })
})

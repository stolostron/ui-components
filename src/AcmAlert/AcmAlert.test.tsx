import { render, waitFor } from '@testing-library/react'
import { axe } from 'jest-axe'
import React, { Fragment } from 'react'
import { AcmButton } from '../AcmButton/AcmButton'
import { AcmAlert, AcmAlertContext, AcmAlertGroup, AcmAlertProvider } from './AcmAlert'

describe('AcmAlert', () => {
    test('renders alerts in alert group', async () => {
        const { getByText, queryAllByText, getByRole, container } = render(
            <AcmAlertProvider>
                <AcmAlertGroup isInline canClose />
                <AcmAlertContext.Consumer>
                    {(context) => (
                        <Fragment>
                            <AcmButton onClick={() => context.addAlert({ title: 'Info' })}>Add Info</AcmButton>
                            <AcmButton onClick={() => context.addAlert({ title: 'Error' })}>Add Error</AcmButton>
                            <AcmButton onClick={() => context.clearAlerts()}>Clear Alerts</AcmButton>
                        </Fragment>
                    )}
                </AcmAlertContext.Consumer>
            </AcmAlertProvider>
        )

        expect(queryAllByText('Info')).toHaveLength(0)
        getByText('Add Info').click()
        await waitFor(() => expect(queryAllByText('Info')).toHaveLength(1))

        expect(queryAllByText('Error')).toHaveLength(0)
        getByText('Add Error').click()
        await waitFor(() => expect(queryAllByText('Error')).toHaveLength(1))
        getByText('Add Error').click()
        await waitFor(() => expect(queryAllByText('Error')).toHaveLength(2))

        expect(await axe(container)).toHaveNoViolations()

        getByRole('button', { name: 'Close Default alert: alert: Info' }).click()
        await waitFor(() => expect(queryAllByText('Info')).toHaveLength(0))

        getByText('Clear Alerts').click()
        await waitFor(() => expect(queryAllByText('Error')).toHaveLength(0))
    })

    test('renders alert', async () => {
        const { queryAllByText } = render(<AcmAlert title="TITLE" message="MESSAGE" variant="info" />)
        await waitFor(() => expect(queryAllByText('TITLE')).toHaveLength(1))
        await waitFor(() => expect(queryAllByText('MESSAGE')).toHaveLength(1))
    })
})

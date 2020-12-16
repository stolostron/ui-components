import { render, waitFor } from '@testing-library/react'
import { axe } from 'jest-axe'
import React, { Fragment } from 'react'
import { AcmButton } from '../AcmButton/AcmButton'
import { AcmAlertContext, AcmAlertGroup, AcmAlertProvider } from './AcmAlert'

describe('AcmAlert', () => {
    const AlertTest = () => (
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

    test('renders alerts', async () => {
        const { getByText, queryAllByText, getByRole, container } = render(<AlertTest />)

        expect(queryAllByText('Info')).toHaveLength(0)
        getByText('Add Info').click()
        await waitFor(() => expect(queryAllByText('Info')).toHaveLength(1))

        expect(queryAllByText('Error')).toHaveLength(0)
        getByText('Add Error').click()
        await waitFor(() => expect(queryAllByText('Error')).toHaveLength(1))
        getByText('Add Error').click()
        await waitFor(() => expect(queryAllByText('Error')).toHaveLength(2))

        getByRole('button', { name: 'Close Default alert: alert: Info' }).click()
        await waitFor(() => expect(queryAllByText('Info')).toHaveLength(0))

        getByText('Clear Alerts').click()
        await waitFor(() => expect(queryAllByText('Error')).toHaveLength(0))

        expect(await axe(container)).toHaveNoViolations()
    })

    // test('has zero accessibility defects', async () => {
    //     const { container } = render(<AcmAlert title="Acm Alert title" />)
    //     expect(await axe(container)).toHaveNoViolations()
    // })
})

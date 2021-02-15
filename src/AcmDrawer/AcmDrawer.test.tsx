import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { AcmDrawer, AcmDrawerContext, AcmDrawerProvider } from './AcmDrawer'
import { AcmButton } from '../AcmButton/AcmButton'

describe('AcmDrawer', () => {
    const onCloseClick = jest.fn()
    test('renders in an open state', () => {
        render(<AcmDrawer title="Drawer" onCloseClick={onCloseClick} isExpanded={true} />)
        expect(screen.getByText('Drawer')).toBeInTheDocument()
    })
    test('renders in a closed state', () => {
        render(<AcmDrawer title="Drawer" onCloseClick={onCloseClick} isExpanded={false} />)
        expect(screen.queryByText('Drawer')).toBeNull()
    })
    test('haz zero accessibility defects', async () => {
        const { container } = render(<AcmDrawer title="Drawer" onCloseClick={onCloseClick} isExpanded={true} />)
        expect(screen.getByText('Drawer')).toBeInTheDocument()
        expect(await axe(container)).toHaveNoViolations()
    })

    describe('using context', () => {
        const Component = () => (
            <AcmDrawerProvider>
                <AcmDrawer>
                    <AcmDrawerContext.Consumer>
                        {({ setDrawerContext }) => (
                            <div style={{ height: '100vh' }}>
                                <AcmButton
                                    onClick={() =>
                                        setDrawerContext({
                                            isExpanded: true,
                                            title: 'Drawer title',
                                            onCloseClick: () => setDrawerContext(undefined),
                                            panelContent: <div id="test-content" />,
                                        })
                                    }
                                >
                                    Open
                                </AcmButton>
                            </div>
                        )}
                    </AcmDrawerContext.Consumer>
                </AcmDrawer>
            </AcmDrawerProvider>
        )
        test('', async () => {
            render(<Component />)
            expect(screen.queryByText('Drawer title')).toBeNull()
            expect(screen.getByText('Open')).toBeInTheDocument()
            userEvent.click(screen.getByText('Open'))
            await waitFor(() => expect(screen.getByText('Drawer title')).toBeInTheDocument())
            expect(screen.getByTestId('test-content')).toBeInTheDocument()
            expect(screen.getByLabelText('Close drawer panel')).toBeInTheDocument()
            userEvent.click(screen.getByLabelText('Close drawer panel'))
            await waitFor(() => expect(screen.queryByText('Drawer title')).toBeNull())
        })
    })
})

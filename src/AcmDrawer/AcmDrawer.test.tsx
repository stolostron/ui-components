import React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { AcmDrawer } from './AcmDrawer'

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
})

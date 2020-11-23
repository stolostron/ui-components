import React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { AcmTemplateIcon } from './AcmIcons'

describe('AcmIcon', () => {
    const Icon = () => <AcmTemplateIcon />

    test('renders', () => {
        const { getByText } = render(<Icon />)
        expect(getByText('template icon')).toBeInTheDocument()
    })

    test('has zero accessibility defects', async () => {
        const { container } = render(<Icon />)
        expect(await axe(container)).toHaveNoViolations()
    })
})

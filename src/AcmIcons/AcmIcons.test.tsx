import React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { AcmIcon, AcmIconVariant } from './AcmIcons'

describe('AcmIcon', () => {
    Object.values(AcmIconVariant).forEach((icon) => {
        const Icon = () => <AcmIcon icon={icon} />
        test(`renders - ${icon}`, () => {
            const { getByRole } = render(<Icon />)
            expect(getByRole('presentation')).toBeInTheDocument()
        })
        test(`has zero accessibility defects - ${icon}`, async () => {
            const { container } = render(<Icon />)
            expect(await axe(container)).toHaveNoViolations()
        })
    })
})

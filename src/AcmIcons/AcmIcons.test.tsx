import React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { AcmIcon, AcmIconVariant } from './AcmIcons'

describe('AcmIcon', () => {
    Object.values(AcmIconVariant).forEach((icon) => {
        test(`renders - ${icon}`, () => {
            const { getByRole } = render(<AcmIcon icon={icon} />)
            expect(getByRole('presentation')).toBeInTheDocument()
        })
        test(`has zero accessibility defects - ${icon}`, async () => {
            const { container } = render(<AcmIcon icon={icon} size="large" />)
            expect(await axe(container)).toHaveNoViolations()
        })
    })
})

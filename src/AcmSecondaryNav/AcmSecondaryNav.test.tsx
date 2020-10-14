import React from 'react'
import { render } from '@testing-library/react'
import { AcmSecondaryNav, AcmSecondaryNavItem } from './AcmSecondaryNav'

describe('AcmSecondaryNav', () => {
    test('renders', () => {
        const { getByText } = render(
            <AcmSecondaryNav>
                <AcmSecondaryNavItem isActive={false} to={'/multicloud/test'}>
                    Tab1
                </AcmSecondaryNavItem>
            </AcmSecondaryNav>
        )

        expect(getByText('Tab1')).toBeInTheDocument()
        expect(getByText('Tab1')).toBeInstanceOf(HTMLAnchorElement)
        expect(getByText('Tab1').getAttribute('href')).toEqual('/multicloud/test')
    })
})

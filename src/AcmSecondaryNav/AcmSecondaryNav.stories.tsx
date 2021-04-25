/* Copyright Contributors to the Open Cluster Management project */

import '@patternfly/react-core/dist/styles/base.css'
import React, { useState } from 'react'
import { Meta } from '@storybook/react'
import { AcmSecondaryNav, AcmSecondaryNavItem } from './AcmSecondaryNav'
import { AcmPage, AcmPageCard, AcmPageHeader } from '../AcmPage/AcmPage'

const meta: Meta = {
    title: 'SecondaryNav',
    component: AcmSecondaryNav,
}
export default meta

export function SecondaryNav() {
    const [active, setActive] = useState('first')
    return (
        <AcmPage header={<AcmPageHeader title="SecondaryNav"></AcmPageHeader>}>
            <AcmPageCard>
                <AcmSecondaryNav>
                    <AcmSecondaryNavItem isActive={active === 'first'} onClick={() => setActive('first')}>
                        First Nav
                    </AcmSecondaryNavItem>
                    <AcmSecondaryNavItem isActive={active === 'second'} onClick={() => setActive('second')}>
                        Second Nav
                    </AcmSecondaryNavItem>
                    <AcmSecondaryNavItem isActive={active === 'third'} onClick={() => setActive('third')}>
                        Third Nav
                    </AcmSecondaryNavItem>
                </AcmSecondaryNav>
            </AcmPageCard>
        </AcmPage>
    )
}

import { Nav, NavItem, NavList, PageSection, PageSectionVariants } from '@patternfly/react-core'
import React, { ReactNode } from 'react'

export function AcmSecondaryNav(props: { children: ReactNode }) {
    return (
        <PageSection variant={PageSectionVariants.light} padding={{ default: 'noPadding' }}>
            <Nav variant="tertiary" style={{ paddingLeft: '12px' }}>
                <NavList>{props.children}</NavList>
            </Nav>
        </PageSection>
    )
}
export function AcmSecondaryNavItem(props: { onClick?: ()=>void; isActive: boolean; to?: string; children: ReactNode }) {
    return <NavItem onClick={props.onClick} isActive={props.isActive} to={props.to}>{props.children}</NavItem>
}

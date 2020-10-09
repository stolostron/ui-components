import {
    Brand,
    Button,
    ButtonVariant,
    Nav,
    NavItem,
    NavList,
    Page,
    PageHeader,
    PageHeaderTools,
    PageHeaderToolsGroup,
    PageHeaderToolsItem,
    PageSidebar,
} from '@patternfly/react-core'
import '@patternfly/react-core/dist/styles/base.css'
import HelpIcon from '@patternfly/react-icons/dist/js/icons/help-icon'
import SearchIcon from '@patternfly/react-icons/dist/js/icons/search-icon'
import React from 'react'
import imgBrand from '../assets/RHACM-Logo.svg'

export enum NavItemE {
    welcome = '/welcome',
    overview = '/overview',
    topology = '/topology',
    clusterManagement = '/cluster-management',
    applications = '/applications',
    policies = '/policies',
    search = '/search',
}

export function AcmHeaderTools() {
    return (
        <PageHeaderTools>
            <PageHeaderToolsGroup
                visibility={{
                    default: 'hidden',
                    lg: 'visible',
                }} /** the settings and help icon buttons are only visible on desktop sizes and replaced by a kebab dropdown for other sizes */
            >
                <PageHeaderToolsItem>
                    <Button
                        aria-label="Search"
                        variant={ButtonVariant.plain}
                        onClick={() => {
                            window.location.href = NavItemE.search
                        }}
                    >
                        <SearchIcon />
                    </Button>
                </PageHeaderToolsItem>
                <PageHeaderToolsItem>
                    <Button aria-label="Help actions" variant={ButtonVariant.plain}>
                        <HelpIcon />
                    </Button>
                </PageHeaderToolsItem>
            </PageHeaderToolsGroup>

            {/* <Avatar src={imgAvatar} alt="Avatar image" /> */}
        </PageHeaderTools>
    )
}
export function AcmHeader(props: { children?: React.ReactNode; activeItem: NavItemE }) {
    const PageNav = (
        <Nav aria-label="Nav">
            <NavList>
                <NavItem to={NavItemE.welcome} isActive={props.activeItem === NavItemE.welcome}>
                    Home
                </NavItem>
                <NavItem to={NavItemE.overview} isActive={props.activeItem === NavItemE.overview}>
                    Overview
                </NavItem>
                <NavItem to={NavItemE.topology} isActive={props.activeItem === NavItemE.topology}>
                    Topology
                </NavItem>
                <NavItem to={NavItemE.clusterManagement} isActive={props.activeItem === NavItemE.clusterManagement}>
                    Cluster Management
                </NavItem>
                <NavItem to={NavItemE.applications} isActive={props.activeItem === NavItemE.applications}>
                    Manage Applications
                </NavItem>
                <NavItem to={NavItemE.policies} isActive={props.activeItem === NavItemE.policies}>
                    Governance and risk
                </NavItem>
            </NavList>
        </Nav>
    )

    const Header = (
        <PageHeader
            headerTools={<AcmHeaderTools />}
            logo={<Brand src={imgBrand} alt="Advanced" />}
            showNavToggle
        ></PageHeader>
    )
    const Sidebar = <PageSidebar nav={PageNav} />

    return (
        <Page
            header={Header}
            sidebar={Sidebar}
            isManagedSidebar
            defaultManagedSidebarIsOpen={false}
            style={{ height: '100%' }}
        >
            {props.children}
        </Page>
    )
}

/* istanbul ignore file */
import React, { useState, useEffect, CSSProperties } from 'react'
import {
    Page,
    PageHeader,
    PageHeaderTools,
    PageSidebar,
    PageHeaderToolsGroup,
    PageHeaderToolsItem,
    Dropdown,
    DropdownItem,
    DropdownToggle,
    Modal,
    ModalVariant,
    Spinner,
    Nav,
    NavExpandable,
    NavItem,
    NavItemSeparator,
    NavList,
} from '@patternfly/react-core'
import { makeStyles } from '@material-ui/styles'

export type AcmHeaderPrototypeProps = {
    href: string
    target: string
    children: React.Component | React.ReactElement | React.ReactElement[]
}

function api<T>(url: string, headers?: Record<string, unknown>): Promise<T> {
    if (headers) {
        return fetch(url, headers).then((response) => {
            if (!response.ok) {
                throw new Error(response.statusText)
            }
            return response.json() as Promise<T>
        })
    }
    return fetch(url).then((response) => {
        if (!response.ok) {
            throw new Error(response.statusText)
        }
        return response.json() as Promise<T>
    })
}

function DropdownName() {
    const [name, setName] = useState<string>('')

    useEffect(() => {
        const dev = process.env.NODE_ENV !== 'production'
        const serverForTest = dev ? 'https://localhost:3000' : ''
        api<{ username: string }>(`${serverForTest}/multicloud/common/username`)
            .then(({ username }) => {
                setName(username)
            })
            .catch((error) => {
                // eslint-disable-next-line no-console
                console.error(error)
                setName('')
            })
    }, [])

    return <span aria-label="dropdown-username">{name}</span>
}

function AboutModalVersion() {
    const [version, setVersion] = useState<string>('undefined')

    useEffect(() => {
        const dev = process.env.NODE_ENV !== 'production'
        const serverForTest = dev ? 'https://localhost:3000' : ''
        api<{ version: string }>(`${serverForTest}/multicloud/common/version`)
            .then(({ version }) => {
                setVersion(version)
            })
            .catch((error) => {
                // eslint-disable-next-line no-console
                console.error(error)
                setVersion('undefined')
            })
    }, [])

    return <span className="version-details__no">{version === 'undefined' ? <Spinner size="md" /> : version}</span>
}

const useStyles = makeStyles({
    list: {
        '& li.pf-c-nav__item.pf-m-expandable.pf-m-expanded': {
            '& section': {
                display: 'list-item',
            },
        },
        '& li.pf-c-nav__item.pf-m-expandable': {
            '& section': {
                display: 'none',
            },
        },
    },
})

function NavExpandableList() {
    const [activeGroup, setActiveGroup] = useState<string>('grp-1')
    const [activeItem, setActiveItem] = useState<string>('grp-1_itm-1')
    const [switcherIsOpen, switcherSetOpen] = useState<boolean>(false)
    const classes = useStyles()

    function select(result: { groupId?: string | number; itemId?: string | number }) {
        if (result.groupId !== undefined) {
            setActiveGroup(result.groupId.toString())
        }
        if (result.itemId !== undefined) {
            setActiveItem(result.itemId.toString())
        }
    }

    function launchToOCP(searchParam: string) {
        api<{ data: { consoleURL: string } }>(
            '/multicloud/api/v1/namespaces/openshift-config-managed/configmaps/console-public'
        )
            .then(({ data }) => {
                window.open(`${data.consoleURL}${searchParam}`, '_self')
            })
            .catch((error) => {
                // eslint-disable-next-line no-console
                console.error(error)
            })
    }

    const toggleStyles: CSSProperties = {
        color: 'white',
    }

    return (
        <Nav onSelect={select}>
            <Dropdown
                toggle={
                    <DropdownToggle id="toggle-perspective" onToggle={() => switcherSetOpen(!switcherIsOpen)}>
                        <span style={toggleStyles}>Advanced Cluster Management</span>
                    </DropdownToggle>
                }
                dropdownItems={[
                    <DropdownItem onClick={() => launchToOCP('')} key={'administrator'}>
                        Administrator
                    </DropdownItem>,
                    <DropdownItem onClick={() => launchToOCP('')} key={'devbutton'}>
                        Developer
                    </DropdownItem>,
                ]}
                isOpen={switcherIsOpen}
            ></Dropdown>
            <NavItemSeparator />
            <NavList className={classes.list}>
                <NavItem
                    preventDefault
                    to="#mixed-1"
                    groupId="home"
                    itemId="home_welcome"
                    isActive={activeItem === 'home_welcome'}
                    onClick={() => window.open('/', '_self')}
                >
                    Home
                </NavItem>
                <NavExpandable title="Observe Environments" groupId="observe" isActive={activeGroup === 'observe'}>
                    <NavItem
                        preventDefault
                        to="#mixed-2"
                        groupId="observe"
                        itemId="observe_overview"
                        isActive={activeItem === 'observe_overview'}
                        onClick={() => window.open('/multicloud/overview', '_self')}
                    >
                        Overview
                    </NavItem>
                </NavExpandable>
                <NavExpandable title="Automate Infrastructure" groupId="automate" isActive={activeGroup === 'automate'}>
                    <NavItem
                        preventDefault
                        to="#mixed-3"
                        groupId="automate"
                        itemId="automate_clusters"
                        isActive={activeItem === 'automate_clusters'}
                        onClick={() => window.open('/multicloud/clusters', '_self')}
                    >
                        Clusters
                    </NavItem>
                    <NavItem
                        preventDefault
                        to="#mixed-4"
                        groupId="automate"
                        itemId="automate_baremetal"
                        isActive={activeItem === 'automate_baremetal'}
                        onClick={() => window.open('/multicloud/bare-metal-assets', '_self')}
                    >
                        Bare metal assets
                    </NavItem>
                </NavExpandable>
                <NavItem
                    preventDefault
                    to="#mixed-5"
                    groupId="manage"
                    itemId="manage_applications"
                    isActive={activeItem === 'manage_applications'}
                    onClick={() => window.open('/multicloud/applications', '_self')}
                >
                    Manage applications
                </NavItem>
                <NavItem
                    preventDefault
                    to="#mixed-6"
                    groupId="grc"
                    itemId="grc_govern_risk"
                    isActive={activeItem === 'grc_govern_risk'}
                    onClick={() => window.open('/multicloud/policies', '_self')}
                >
                    Govern risk
                </NavItem>
            </NavList>
        </Nav>
    )
}

export function AcmHeaderPrototype(props: AcmHeaderPrototypeProps) {
    const [isOpen, setOpen] = useState<boolean>(false)
    const [dropIsOpen, dropSetOpen] = useState<boolean>(false)
    const [aboutDropIsOpen, aboutDropSetOpen] = useState<boolean>(false)
    const [aboutModalOpen, setAboutModalOpen] = useState<boolean>(false)

    function api<T>(url: string): Promise<T> {
        return fetch(url).then((response) => {
            if (!response.ok) {
                throw new Error(response.statusText)
            }
            return response.json() as Promise<T>
        })
    }

    function configureClient() {
        api<{ token_endpoint: string }>('/multicloud/common/configure')
            .then(({ token_endpoint }) => {
                window.open(`${token_endpoint}/request`, '_blank')
            })
            .catch((error) => {
                // eslint-disable-next-line no-console
                console.error(error)
            })
    }

    function logout() {
        api<{ admin: boolean; logoutPath: string }>('/multicloud/logout')
            .then(({ admin, logoutPath }) => {
                const onLogout = (delay = 0) => {
                    return setTimeout(() => {
                        location.reload(true)
                    }, delay)
                }
                if (admin) {
                    const form = document.createElement('form')
                    form.target = 'hidden-form'
                    form.method = 'POST'
                    form.action = logoutPath
                    const iframe = document.createElement('iframe')
                    iframe.setAttribute('type', 'hidden')
                    iframe.name = 'hidden-form'
                    iframe.onload = () => onLogout(500)
                    document.body.appendChild(iframe)
                    document.body.appendChild(form)
                    form.submit()
                }
                onLogout(500)
            })
            .catch((error) => {
                // eslint-disable-next-line no-console
                console.error(error)
            })
    }

    const headerTools = (
        <PageHeaderTools>
            <PageHeaderToolsGroup
                visibility={{
                    default: 'hidden',
                    lg: 'visible',
                }}
            >
                <PageHeaderToolsItem>
                    <Dropdown
                        toggle={
                            <DropdownToggle id="toggle-about" onToggle={() => aboutDropSetOpen(!aboutDropIsOpen)}>
                                About
                            </DropdownToggle>
                        }
                        dropdownItems={[
                            <DropdownItem
                                onClick={() =>
                                    window.open(
                                        'https://access.redhat.com/documentation/en-us/red_hat_advanced_cluster_management_for_kubernetes/2.2/',
                                        '_blank'
                                    )
                                }
                                key={'docbutton'}
                            >
                                Documentation
                            </DropdownItem>,
                            <DropdownItem onClick={() => setAboutModalOpen(!aboutModalOpen)} key={'aboutbutton'}>
                                About
                            </DropdownItem>,
                        ]}
                        isOpen={aboutDropIsOpen}
                    ></Dropdown>
                    <Dropdown
                        toggle={
                            <DropdownToggle id="toggle-id" onToggle={() => dropSetOpen(!dropIsOpen)}>
                                <DropdownName></DropdownName>
                            </DropdownToggle>
                        }
                        dropdownItems={[
                            <DropdownItem onClick={() => logout()} key={'logoutbutton'}>
                                Logout
                            </DropdownItem>,
                            <DropdownItem onClick={() => configureClient()} key={'configurebutton'}>
                                Configure client
                            </DropdownItem>,
                        ]}
                        isOpen={dropIsOpen}
                    ></Dropdown>
                    <Modal
                        variant={ModalVariant.small}
                        isOpen={aboutModalOpen}
                        aria-label="about-modal"
                        showClose={true}
                        aria-describedby="about-modal"
                        onClose={() => setAboutModalOpen(!aboutModalOpen)}
                    >
                        <span className="version-details__label">Version </span>
                        <AboutModalVersion></AboutModalVersion>
                        <span className="spacer" />
                        <div className="copyright">
                            <p>Copyright © 2020 IBM Corporation. All rights reserved.</p>
                            <p>Copyright © 2020 Red Hat, Inc. All rights reserved.</p>
                        </div>
                    </Modal>
                </PageHeaderToolsItem>
            </PageHeaderToolsGroup>
        </PageHeaderTools>
    )

    const Header = (
        <PageHeader
            logo="RHACM"
            logoProps={props}
            headerTools={headerTools}
            showNavToggle
            isNavOpen={isOpen}
            onNavToggle={() => setOpen(!isOpen)}
        />
    )

    const SidebarNav = <NavExpandableList></NavExpandableList>

    const Sidebar = <PageSidebar nav={SidebarNav} isNavOpen={isOpen} />

    return (
        <Page header={Header} sidebar={Sidebar}>
            {props.children}
        </Page>
    )
}

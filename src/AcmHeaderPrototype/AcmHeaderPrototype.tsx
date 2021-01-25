/* istanbul ignore file */
import React, { useState } from 'react'
import {
    Page,
    PageHeader,
    PageHeaderTools,
    PageSidebar,
    PageHeaderToolsGroup,
    PageHeaderToolsItem,
    Button,
} from '@patternfly/react-core'

export type AcmHeaderPrototypeProps = {
    href: string
    target: string
    children: React.Component | React.ReactElement | React.ReactElement[]
}

export function AcmHeaderPrototype(props: AcmHeaderPrototypeProps) {
    const [isOpen, setOpen] = useState<boolean>(false)

    function api<T>(url: string): Promise<T> {
        return fetch(url).then((response) => {
            if (!response.ok) {
                throw new Error(response.statusText)
            }
            return response.json() as Promise<T>
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
                    <Button aria-label="Settings actions" onClick={() => logout()}>
                        Logout
                    </Button>
                </PageHeaderToolsItem>
            </PageHeaderToolsGroup>
        </PageHeaderTools>
    )

    const Header = (
        <PageHeader
            logo="Logo"
            logoProps={props}
            headerTools={headerTools}
            showNavToggle
            isNavOpen={isOpen}
            onNavToggle={() => setOpen(!isOpen)}
        />
    )

    const Sidebar = <PageSidebar nav="Navigation" isNavOpen={isOpen} />

    return (
        <Page header={Header} sidebar={Sidebar}>
            {props.children}
        </Page>
    )
}

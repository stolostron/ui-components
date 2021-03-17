/* Copyright Contributors to the Open Cluster Management project */

import '@patternfly/react-core/dist/styles/base.css'
import { Dropdown, DropdownItem, DropdownToggle, Switch } from '@patternfly/react-core'
import { Meta } from '@storybook/react'
import React, { useState, Fragment } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { AcmSecondaryNav, AcmSecondaryNavItem } from '../AcmSecondaryNav/AcmSecondaryNav'
import { AcmPage, AcmPageHeader } from './AcmPage'
import { AcmAutoRefreshSelect } from '../AcmAutoRefreshSelect/AcmAutoRefreshSelect'
import { AcmRefreshTime } from '../AcmRefreshTime/AcmRefreshTime'

const meta: Meta = {
    title: 'PageHeader',
    component: AcmPageHeader,
    argTypes: {
        showBreadcrumb: { type: 'boolean' },
        title: { type: 'string' },
        showTooltip: { type: 'boolean' },
        description: { type: 'string' },
        showNavigation: { type: 'boolean' },
        showSwitch: { type: 'boolean' },
        showControls: { type: 'boolean' },
        showActions: { type: 'boolean' },
    },
}
export default meta

export const PageHeader = (args: {
    showBreadcrumb: boolean
    title: string
    showTooltip: boolean
    description: string
    showNavigation: boolean
    showSwitch: boolean
    showControls: boolean
    showActions: boolean
}) => {
    const [isActionDowndownOpen, setActionDowndownOpen] = useState(false)
    return (
        <MemoryRouter>
            <AcmPage>
                <AcmPageHeader
                    breadcrumb={
                        args.showBreadcrumb ? [{ text: 'Page 1' }, { text: 'Page 2' }, { text: 'Page 3' }] : undefined
                    }
                    title={args.title}
                    titleTooltip={
                        args.showTooltip && (
                            <>
                                View all resources
                                <a href="#" style={{ display: 'block', marginTop: '4px' }}>
                                    Learn more
                                </a>
                            </>
                        )
                    }
                    description={args.description}
                    switches={args.showSwitch && <Switch label="YAML on" labelOff="YAML off" />}
                    controls={
                        args.showControls && (
                            <Fragment>
                                <AcmAutoRefreshSelect refetch={() => null} />
                                <AcmRefreshTime
                                    timestamp={'Wed Jan 06 2021 00:00:00 GMT+0000 (Coordinated Universal Time)'}
                                    reloading={true}
                                />
                            </Fragment>
                        )
                    }
                    actions={
                        args.showActions && (
                            <Dropdown
                                isOpen={isActionDowndownOpen}
                                toggle={
                                    <DropdownToggle onToggle={() => setActionDowndownOpen(!isActionDowndownOpen)}>
                                        Actions
                                    </DropdownToggle>
                                }
                                dropdownItems={[
                                    <DropdownItem component="button" key="1">
                                        Action 1
                                    </DropdownItem>,
                                    <DropdownItem component="button" key="2">
                                        Action 2
                                    </DropdownItem>,
                                ]}
                                onSelect={() => setActionDowndownOpen(!isActionDowndownOpen)}
                            />
                        )
                    }
                    navigation={
                        args.showNavigation && (
                            <AcmSecondaryNav>
                                <AcmSecondaryNavItem isActive={true}>Secondary Nav 1</AcmSecondaryNavItem>
                                <AcmSecondaryNavItem isActive={false}>Secondary Nav 2</AcmSecondaryNavItem>
                            </AcmSecondaryNav>
                        )
                    }
                />
            </AcmPage>
        </MemoryRouter>
    )
}
PageHeader.args = {
    title: 'Page title',
    showTooltip: true,
    description: 'Optional page description',
    showBreadcrumb: true,
    showNavigation: true,
    showSwitch: false,
    showControls: true,
    showActions: true,
}

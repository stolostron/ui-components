/* Copyright Contributors to the Open Cluster Management project */

import '@patternfly/react-core/dist/styles/base.css'
import { Dropdown, DropdownItem, DropdownToggle, Switch } from '@patternfly/react-core'
import { Meta } from '@storybook/react'
import React, { Fragment, useState } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { AcmAutoRefreshSelect } from '../AcmAutoRefreshSelect/AcmAutoRefreshSelect'
import { DescriptionList as DescriptionListStory } from '../AcmDescriptionList/AcmDescriptionList.stories'
import { Form as FormStory } from '../AcmForm/AcmForm.stories'
import { AcmRefreshTime } from '../AcmRefreshTime/AcmRefreshTime'
import { AcmSecondaryNav, AcmSecondaryNavItem } from '../AcmSecondaryNav/AcmSecondaryNav'
import { Table as TableStory } from '../AcmTable/AcmTable.stories'
import { AcmPage, AcmPageContent, AcmPageHeader } from './AcmPage'
import { LoadingPage as LoadingPageStory } from '../AcmLoadingPage/AcmLoadingPage.stories'

const meta: Meta = {
    title: 'Page',
    component: AcmPage,
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

export const Page = (args: {
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
    const [secondaryTab, setSecondaryTab] = useState('table')
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
                                <AcmSecondaryNavItem
                                    isActive={secondaryTab === 'table'}
                                    onClick={() => setSecondaryTab('table')}
                                >
                                    Table
                                </AcmSecondaryNavItem>
                                <AcmSecondaryNavItem
                                    isActive={secondaryTab === 'descriptionList'}
                                    onClick={() => setSecondaryTab('descriptionList')}
                                >
                                    Description List
                                </AcmSecondaryNavItem>
                                <AcmSecondaryNavItem
                                    isActive={secondaryTab === 'form'}
                                    onClick={() => setSecondaryTab('form')}
                                >
                                    Form
                                </AcmSecondaryNavItem>
                                <AcmSecondaryNavItem
                                    isActive={secondaryTab === 'loading'}
                                    onClick={() => setSecondaryTab('loading')}
                                >
                                    Loading
                                </AcmSecondaryNavItem>
                            </AcmSecondaryNav>
                        )
                    }
                />
                <AcmPageContent>
                    {secondaryTab === 'table' ? (
                        <TableStory />
                    ) : secondaryTab === 'descriptionList' ? (
                        <DescriptionListStory />
                    ) : secondaryTab === 'form' ? (
                        <FormStory />
                    ) : secondaryTab === 'loading' ? (
                        <LoadingPageStory />
                    ) : (
                        <div />
                    )}
                </AcmPageContent>
            </AcmPage>
        </MemoryRouter>
    )
}
Page.args = {
    title: 'AcmPage',
    showTooltip: true,
    description: 'AcmPage is used with AcmPageHeader and AcmPageContent to consistently layout the page.',
    showBreadcrumb: true,
    showNavigation: true,
    showSwitch: false,
    showControls: true,
    showActions: true,
}

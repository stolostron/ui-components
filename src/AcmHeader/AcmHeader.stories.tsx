/* Copyright Contributors to the Open Cluster Management project */

import { Button, Divider } from '@material-ui/core'
import {
    Breadcrumb,
    BreadcrumbItem,
    Card,
    CardBody,
    CardFooter,
    CardTitle,
    DescriptionList,
    DescriptionListDescription,
    DescriptionListGroup,
    DescriptionListTerm,
    Dropdown,
    DropdownItem,
    DropdownToggle,
    Gallery,
    GalleryItem,
    Nav,
    NavItem,
    NavList,
    PageSection,
    PageSectionVariants,
    Split,
    SplitItem,
    Stack,
    StackItem,
    Text,
    TextContent,
} from '@patternfly/react-core'
import React, { Fragment, useState } from 'react'
import { MemoryRouter } from 'react-router'
import { AcmHeader, AcmRoute } from './AcmHeader'
import { AcmScrollable } from '../AcmScrollable/AcmScrollable'
import { Link } from 'react-router-dom'
import { Table } from '../AcmTable/AcmTable.stories'

export default {
    title: 'Header',
    component: AcmHeader,
}

export const Header = () => {
    const [isActionDowndownOpen, setActionDowndownOpen] = useState(false)
    const [secondaryTab, setSecondaryTab] = useState('table')
    return (
        <MemoryRouter>
            <AcmHeader
                route={AcmRoute.Welcome}
                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbItem>
                            <Link to={'route1'} className="pf-c-breadcrumb__link">
                                Breadcrumb 1
                            </Link>
                        </BreadcrumbItem>
                        <BreadcrumbItem>
                            <Link to={'route2'} className="pf-c-breadcrumb__link">
                                Breadcrumb 2
                            </Link>
                        </BreadcrumbItem>
                        <BreadcrumbItem>Breadcrumb 3</BreadcrumbItem>
                    </Breadcrumb>
                }
            >
                <PageSection variant={PageSectionVariants.light}>
                    <Split hasGutter>
                        <SplitItem isFilled>
                            <TextContent>
                                <Text component="h1">Page Title</Text>
                                <Text component="p">The description for the page goes here.</Text>
                            </TextContent>
                        </SplitItem>
                        <SplitItem>
                            <Stack>
                                <StackItem isFilled />
                                <StackItem>
                                    <Dropdown
                                        isOpen={isActionDowndownOpen}
                                        toggle={
                                            <DropdownToggle
                                                onToggle={() => setActionDowndownOpen(!isActionDowndownOpen)}
                                            >
                                                Dropdown
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
                                </StackItem>
                            </Stack>
                        </SplitItem>
                    </Split>
                </PageSection>
                <Divider component="div" />
                <PageSection variant={PageSectionVariants.light} type={'nav'} style={{ paddingTop: 0 }}>
                    <Nav variant="tertiary">
                        <NavList>
                            <NavItem isActive={secondaryTab === 'table'} onClick={() => setSecondaryTab('table')}>
                                Table
                            </NavItem>
                            <NavItem
                                isActive={secondaryTab === 'descriptionList'}
                                onClick={() => setSecondaryTab('descriptionList')}
                            >
                                Details
                            </NavItem>
                            <NavItem
                                isActive={secondaryTab === 'cardGallery'}
                                onClick={() => setSecondaryTab('cardGallery')}
                            >
                                Cards
                            </NavItem>
                        </NavList>
                    </Nav>
                </PageSection>
                <Divider component="div" />
                <AcmScrollable>
                    {secondaryTab === 'table' ? (
                        <PageSection variant="light" isFilled={true} padding={{ default: 'noPadding' }}>
                            <Table />
                        </PageSection>
                    ) : secondaryTab === 'descriptionList' ? (
                        <PageSection variant="light" isFilled={true}>
                            <DescriptionList columnModifier={{ default: '2Col' }}>
                                <DescriptionListGroup>
                                    <DescriptionListTerm>Name</DescriptionListTerm>
                                    <DescriptionListDescription>Example</DescriptionListDescription>
                                </DescriptionListGroup>
                                <DescriptionListGroup>
                                    <DescriptionListTerm>Namespace</DescriptionListTerm>
                                    <DescriptionListDescription>
                                        <a href="#">mary-test</a>
                                    </DescriptionListDescription>
                                </DescriptionListGroup>
                                <DescriptionListGroup>
                                    <DescriptionListTerm>Labels</DescriptionListTerm>
                                    <DescriptionListDescription>example</DescriptionListDescription>
                                </DescriptionListGroup>
                                <DescriptionListGroup>
                                    <DescriptionListTerm>Annotation</DescriptionListTerm>
                                    <DescriptionListDescription>2 Annotations</DescriptionListDescription>
                                </DescriptionListGroup>
                            </DescriptionList>
                        </PageSection>
                    ) : (
                        <PageSection>
                            <Stack hasGutter>
                                <StackItem>
                                    <Gallery hasGutter>
                                        {new Array(6).fill(0).map((v, i) => (
                                            <GalleryItem key={i}>
                                                <Card>
                                                    <CardTitle>Card {i + 1} Title</CardTitle>
                                                    <CardBody>Card body content goes here</CardBody>
                                                </Card>
                                            </GalleryItem>
                                        ))}
                                    </Gallery>
                                </StackItem>
                                <StackItem>
                                    <Card>
                                        <CardTitle>Full Width Card Title</CardTitle>
                                        <CardBody>Card body content goes here</CardBody>
                                    </Card>
                                </StackItem>
                                <StackItem>
                                    <Card>
                                        <CardTitle>Full Width Card Title</CardTitle>
                                        <CardBody>Card body content goes here</CardBody>
                                    </Card>
                                </StackItem>
                            </Stack>
                        </PageSection>
                    )}
                </AcmScrollable>
            </AcmHeader>
        </MemoryRouter>
    )
}

/* Copyright Contributors to the Open Cluster Management project */

import {
    Breadcrumb,
    BreadcrumbItem,
    Button,
    Card,
    CardBody,
    Divider,
    Page,
    PageSection,
    PageSectionVariants,
    Popover,
    Split,
    SplitItem,
    Stack,
    StackItem,
    TextContent,
    Title,
} from '@patternfly/react-core'
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons'
import React, { Fragment, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AcmDrawer, AcmDrawerProvider } from '../AcmDrawer/AcmDrawer'

export function AcmPage(props: { children: ReactNode; hasDrawer?: boolean }) {
    /* istanbul ignore if */
    if (props.hasDrawer) {
        return (
            <AcmDrawerProvider>
                <AcmDrawer>
                    <Page>{props.children}</Page>
                </AcmDrawer>
            </AcmDrawerProvider>
        )
    } else {
        return <Page>{props.children}</Page>
    }
}

export function AcmPageHeader(props: {
    title: string
    titleTooltip?: string | React.ReactNode
    description?: string | React.ReactNode
    breadcrumb?: { text: string; to?: string }[]
    navigation?: React.ReactNode
    controls?: React.ReactNode
    switches?: React.ReactNode
    actions?: React.ReactNode
}) {
    return (
        <Fragment>
            <PageSection variant={PageSectionVariants.light}>
                <Split hasGutter>
                    <SplitItem isFilled>
                        <Stack hasGutter>
                            {props.breadcrumb && (
                                <StackItem>
                                    <AcmBreadcrumb breadcrumb={props.breadcrumb} />
                                </StackItem>
                            )}
                            <StackItem>
                                <TextContent>
                                    <Title headingLevel="h1">
                                        {props.title}
                                        {props.titleTooltip && (
                                            <Popover hasAutoWidth bodyContent={props.titleTooltip}>
                                                <Button
                                                    variant="link"
                                                    style={{
                                                        padding: 0,
                                                        marginLeft: '8px',
                                                        verticalAlign: 'top',
                                                    }}
                                                >
                                                    <OutlinedQuestionCircleIcon />
                                                </Button>
                                            </Popover>
                                        )}
                                        {props.switches && (
                                            <span style={{ paddingLeft: '48px' }}>{props.switches}</span>
                                        )}
                                    </Title>
                                    {props.description && <p>{props.description}</p>}
                                </TextContent>
                            </StackItem>
                        </Stack>
                    </SplitItem>
                    <SplitItem>
                        <Stack hasGutter>
                            {props.controls && (
                                <StackItem style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                    {props.controls}
                                </StackItem>
                            )}
                            {props.actions && (
                                <StackItem
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-end',
                                        justifyContent: 'flex-end',
                                    }}
                                    isFilled
                                >
                                    {props.actions}
                                </StackItem>
                            )}
                        </Stack>
                    </SplitItem>
                </Split>
            </PageSection>
            <Divider component="div" />
            {props.navigation && (
                <Fragment>
                    <PageSection variant={PageSectionVariants.light} type="nav" style={{ paddingTop: 0 }}>
                        {props.navigation}
                    </PageSection>
                    <Divider component="div" />
                </Fragment>
            )}
        </Fragment>
    )
}

export function AcmPageCard(props: { children: ReactNode }) {
    return (
        <PageSection>
            <Card>
                <CardBody>{props.children}</CardBody>
            </Card>
        </PageSection>
    )
}

export function AcmBreadcrumb(props: { breadcrumb?: { text: string; to?: string }[] | undefined }) {
    const { breadcrumb } = props
    if (breadcrumb?.length) {
        return (
            <Breadcrumb>
                {breadcrumb.map((crumb, i) => (
                    <BreadcrumbItem key={crumb.to}>
                        {breadcrumb.length > 1 && i === breadcrumb.length - 1 ? (
                            <a aria-current="page" className="pf-c-breadcrumb__link pf-m-current">
                                {crumb.text}
                            </a>
                        ) : (
                            <Link to={crumb.to as string} className="pf-c-breadcrumb__link">
                                {crumb.text}
                            </Link>
                        )}
                    </BreadcrumbItem>
                ))}
            </Breadcrumb>
        )
    }
    return null
}

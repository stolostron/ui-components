/* Copyright Contributors to the Open Cluster Management project */

import { Card } from '@material-ui/core'
import {
    Breadcrumb,
    BreadcrumbItem,
    Button,
    CardBody,
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
import React, { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AcmAlertGroup, AcmAlertProvider } from '../AcmAlert/AcmAlert'
import { AcmDrawer, AcmDrawerProvider } from '../AcmDrawer/AcmDrawer'
import { AcmErrorBoundary } from '../AcmErrorBoundary/AcmErrorBoundary'
import { AcmScrollable } from '../AcmScrollable/AcmScrollable'

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
        <PageSection variant={PageSectionVariants.light} padding={{ default: 'noPadding' }}>
            <Split>
                <SplitItem isFilled>
                    <Stack hasGutter>
                        <StackItem isFilled>
                            <PageSection
                                variant={PageSectionVariants.light}
                                style={{
                                    paddingBottom: props.navigation ? 'inherit' : undefined,
                                    paddingTop: props.breadcrumb
                                        ? 'var(--pf-c-page__main-breadcrumb--PaddingTop)'
                                        : undefined,
                                }}
                            >
                                <Stack hasGutter>
                                    {props.breadcrumb && (
                                        <StackItem>
                                            <AcmBreadcrumb breadcrumb={props.breadcrumb} />
                                        </StackItem>
                                    )}
                                    <StackItem isFilled>
                                        <Split hasGutter>
                                            <SplitItem>
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
                                                                        verticalAlign: 'middle',
                                                                    }}
                                                                >
                                                                    <OutlinedQuestionCircleIcon />
                                                                </Button>
                                                            </Popover>
                                                        )}
                                                    </Title>
                                                </TextContent>
                                            </SplitItem>
                                            {props.switches && (
                                                <SplitItem>
                                                    <span
                                                        style={{
                                                            paddingLeft: '24px',
                                                            height: '100%',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                        }}
                                                    >
                                                        {props.switches}
                                                    </span>
                                                </SplitItem>
                                            )}
                                            {/* <SplitItem>{props.description && <p>{props.description}</p>}</SplitItem> */}
                                        </Split>
                                        {props.description && (
                                            <div style={{ paddingTop: '8px' }}>{props.description}</div>
                                        )}
                                    </StackItem>
                                </Stack>
                            </PageSection>
                        </StackItem>
                        {props.navigation && (
                            <StackItem>
                                <PageSection variant={PageSectionVariants.light} type="nav" style={{ paddingTop: 0 }}>
                                    {props.navigation}
                                </PageSection>
                            </StackItem>
                        )}
                    </Stack>
                </SplitItem>
                <SplitItem>
                    <PageSection variant={PageSectionVariants.light} style={{ height: '100%' }}>
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
                    </PageSection>
                </SplitItem>
            </Split>
        </PageSection>
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

export type AcmPageContentProps = {
    /** Content ID is needed because react needs the key to detect content changes */
    id: string

    /** React children for this component */
    children: ReactNode
}

export function AcmPageContent(props: AcmPageContentProps) {
    return (
        <AcmErrorBoundary key={props.id}>
            <AcmAlertProvider>
                <AcmAlertGroup isInline canClose />
                <AcmScrollable borderTop>{props.children}</AcmScrollable>
            </AcmAlertProvider>
        </AcmErrorBoundary>
    )
}

import {
    Breadcrumb,
    BreadcrumbItem,
    Card,
    CardBody,
    Page,
    PageSection,
    PageSectionVariants,
    Title,
    Popover,
    Button,
} from '@patternfly/react-core'
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons'
import React, { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function AcmPage(props: { children: ReactNode }) {
    return <Page>{props.children}</Page>
}

export function AcmPageHeader(props: {
    title: string
    titleTooltip?: string | React.ReactNode
    breadcrumb?: { text: string; to: string }[]
    navigation?: React.ReactNode
    controls?: React.ReactNode
    switches?: React.ReactNode
    actions?: React.ReactNode
}) {
    return (
        <PageSection variant={PageSectionVariants.light} padding={{ default: 'noPadding' }}>
            <div style={{ display: 'flex', paddingTop: '16px', paddingRight: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    {props.breadcrumb && (
                        <div style={{ paddingLeft: '24px' }}>
                            <AcmBreadcrumb breadcrumb={props.breadcrumb} />
                        </div>
                    )}
                    <div
                        style={{
                            paddingLeft: '24px',
                            flexGrow: 1,
                            paddingTop: '8px',
                            paddingBottom: '8px',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <Title headingLevel="h1">{props.title}</Title>
                        {props.titleTooltip && (
                            <Popover hasAutoWidth bodyContent={props.titleTooltip}>
                                <Button variant="link" style={{ padding: 0, marginLeft: '8px' }}>
                                    <OutlinedQuestionCircleIcon style={{ verticalAlign: 'middle' }} />
                                </Button>
                            </Popover>
                        )}
                        {props.switches && <div style={{ paddingLeft: '8px' }}>{props.switches}</div>}
                    </div>
                    {props.navigation ? (
                        <div style={{ paddingLeft: '8px' }}>{props.navigation}</div>
                    ) : (
                        <div style={{ paddingBottom: '16px' }} />
                    )}
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        paddingBottom: '16px',
                        alignItems: 'flex-end',
                    }}
                >
                    <div style={{ flexGrow: 1 }}>{props.controls}</div>
                    {props.actions && <div style={{ paddingTop: '12px' }}>{props.actions}</div>}
                </div>
            </div>
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

export function AcmBreadcrumb(props: { breadcrumb?: { text: string; to: string }[] | undefined }) {
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
                            <Link to={crumb.to} className="pf-c-breadcrumb__link">
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

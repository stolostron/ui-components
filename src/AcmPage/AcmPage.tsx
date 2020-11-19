import {
    Breadcrumb,
    BreadcrumbItem,
    Card,
    CardBody,
    Flex,
    FlexItem,
    Page,
    PageBreadcrumb,
    PageSection,
    PageSectionVariants,
    Title,
} from '@patternfly/react-core'
import React, { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function AcmPage(props: { children: ReactNode }) {
    return <Page style={{ height: '100vh' }}>{props.children}</Page>
}

export function AcmPageHeader(props: {
    title: string
    breadcrumb?: { text: string; to: string }[]
    actions?: React.ReactNode
}) {
    return (
        <React.Fragment>
            <AcmBreadcrumb breadcrumb={props.breadcrumb} />
            <PageSection variant={PageSectionVariants.light}>
                <Flex style={{ minHeight: '36px' }}>
                    <FlexItem grow={{ default: 'grow' }} alignSelf={{ default: 'alignSelfCenter' }}>
                        <Title headingLevel="h1">{props.title}</Title>
                    </FlexItem>
                    <FlexItem alignSelf={{ default: 'alignSelfCenter' }}>{props.actions}</FlexItem>
                </Flex>
            </PageSection>
        </React.Fragment>
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
    const { breadcrumb = [] } = props
    if (breadcrumb.length) {
        return (
            <PageBreadcrumb>
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
            </PageBreadcrumb>
        )
    }
    return null
}

import {
    Card,
    CardBody,
    Page,
    PageSection,
    PageSectionVariants,
    Text,
    TextContent,
    Breadcrumb,
    BreadcrumbItem,
} from '@patternfly/react-core'
import React, { ReactNode } from 'react'

export function AcmPage(props: { children: ReactNode }) {
    return <Page style={{ height: '100vh' }}>{props.children}</Page>
}

export function AcmPageHeader(props: { title: string; breadcrumbs?: { text: string; to: string }[] }) {
    return (
        <PageSection variant={PageSectionVariants.light}>
            <AcmBreadcrumb breadcrumbs={props.breadcrumbs} />
            <TextContent>
                <Text component="h1">{props.title}</Text>
            </TextContent>
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

export function AcmBreadcrumb(props: { breadcrumbs?: { text: string; to: string }[] | undefined }) {
    const { breadcrumbs = [] } = props
    if (breadcrumbs.length) {
        return (
            <Breadcrumb>
                {breadcrumbs.map((crumb, i) => (
                    <BreadcrumbItem
                        key={crumb.to}
                        to={crumb.to}
                        isActive={breadcrumbs.length > 1 && i === breadcrumbs.length - 1}
                    >
                        {crumb.text}
                    </BreadcrumbItem>
                ))}
            </Breadcrumb>
        )
    }
    return null
}

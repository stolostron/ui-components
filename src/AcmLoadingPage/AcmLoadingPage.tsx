import React from 'react'
import {
    Card,
    CardFooter,
    CardHeader,
    EmptyState,
    EmptyStateIcon,
    PageSection,
    Title,
    Spinner,
    CardBody,
} from '@patternfly/react-core'

export function AcmLoadingPage() {
    return (
        <PageSection>
            <Card>
                <CardHeader></CardHeader>
                <CardBody>
                    <EmptyState>
                        <EmptyStateIcon variant="container" component={Spinner} />
                        <Title size="lg" headingLevel="h4">
                            Loading
                        </Title>
                    </EmptyState>
                </CardBody>
                <CardFooter></CardFooter>
            </Card>
        </PageSection>
    )
}

import React from 'react'
import { EmptyState, EmptyStateIcon, Title, Spinner } from '@patternfly/react-core'

export function AcmLoadingPage() {
    return (
        <EmptyState>
            <EmptyStateIcon variant="container" component={Spinner} />
            <Title size="lg" headingLevel="h4">
                Loading
            </Title>
        </EmptyState>
    )
}

import React from 'react'
import { EmptyState, EmptyStateIcon, Title, Spinner } from '@patternfly/react-core'
import { AcmPageCard } from '../AcmPage/AcmPage'

export function AcmLoadingPage() {
    return (
        <AcmPageCard>
            <EmptyState>
                <EmptyStateIcon variant="container" component={Spinner} />
                <Title size="lg" headingLevel="h4">
                    Loading
                </Title>
            </EmptyState>
        </AcmPageCard>
    )
}

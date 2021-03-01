/* Copyright Contributors to the Open Cluster Management project */

import { EmptyState, EmptyStateBody, EmptyStatePrimary, EmptyStateVariant, Title } from '@patternfly/react-core'
import React, { ReactNode } from 'react'
import emptyPagePng from '../assets/EmptyPageIcon.png'

export function AcmEmptyState(props: { title: string; message?: string; action?: ReactNode; showIcon?: boolean }) {
    return (
        <EmptyState variant={EmptyStateVariant.large}>
            {props.showIcon !== false && <img src={emptyPagePng} style={{ width: '50%' }} alt="Empty state" />}
            <Title headingLevel="h4" size="lg">
                {props.title}
            </Title>
            <EmptyStateBody>{props.message}</EmptyStateBody>
            <EmptyStatePrimary>{props.action}</EmptyStatePrimary>
            {/* <EmptyStateSecondaryActions>{props.secondaryActions}</EmptyStateSecondaryActions> */}
        </EmptyState>
    )
}

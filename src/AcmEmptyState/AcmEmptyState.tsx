/* Copyright Contributors to the Open Cluster Management project */

import { EmptyState, EmptyStateBody, EmptyStatePrimary, EmptyStateVariant, Title } from '@patternfly/react-core'
import React, { ReactNode } from 'react'
import emptyPagePng from '../assets/EmptyPageIcon.png'
import Folder from '../assets/Folder.png'

export enum AcmEmptyStateImage {
    folder = Folder,
}

export function AcmEmptyState(props: {
    title: string
    message?: string | ReactNode
    action?: ReactNode
    showIcon?: boolean
    image?: AcmEmptyStateImage
}) {
    return (
        <EmptyState variant={EmptyStateVariant.large}>
            {props.showIcon !== false && (
                <img src={props.image ?? emptyPagePng} style={{ width: '50%' }} alt="Empty state" />
            )}
            <Title headingLevel="h4" size="lg">
                {props.title}
            </Title>
            <EmptyStateBody>{props.message}</EmptyStateBody>
            <EmptyStatePrimary>{props.action}</EmptyStatePrimary>
            {/* <EmptyStateSecondaryActions>{props.secondaryActions}</EmptyStateSecondaryActions> */}
        </EmptyState>
    )
}

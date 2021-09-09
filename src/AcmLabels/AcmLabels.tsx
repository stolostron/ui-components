/* Copyright Contributors to the Open Cluster Management project */

import { CSSProperties } from '@material-ui/styles'
import { Label, LabelGroup } from '@patternfly/react-core'
import React, { Fragment, useMemo } from 'react'

export function AcmLabels(props: {
    labels?: string[] | Record<string, string>
    collapse?: string[]
    style?: CSSProperties
    emptyText?: string
    collapsedText?: string
    expandedText?: string
    color?: 'blue' | 'cyan' | 'green' | 'orange' | 'purple' | 'red' | 'grey'
    variant?: 'outline' | 'filled'
}) {
    const labelsRecord: Record<string, string> = useMemo(() => {
        if (props.labels === undefined) return {}
        else if (Array.isArray(props.labels))
            return props.labels.reduce((labels, label) => {
                const parts = label.split('=')
                /* istanbul ignore if */
                if (parts.length === 1) {
                    labels[parts[0]] = ''
                } else {
                    labels[parts[0]] = parts.slice(1).join('=')
                }
                return labels
            }, {} as Record<string, string>)
        else return props.labels
    }, [props.labels])

    const labels: string[] = useMemo(() => {
        return Object.keys(labelsRecord)
            .filter((key) => !props.collapse?.includes(key))
            .map((key: string) => (labelsRecord[key] ? `${key}=${labelsRecord[key]}` : `${key}`))
    }, [labelsRecord, props.collapse])

    const hidden: string[] = useMemo(() => {
        if (props.labels === undefined) return []
        return Object.keys(labelsRecord)
            .filter((key) => props.collapse?.includes(key))
            .map((key: string) => (labelsRecord[key] ? `${key}=${labelsRecord[key]}` : `${key}`))
    }, [labelsRecord, props.collapse])

    if (props.labels === undefined) return <Fragment></Fragment>

    return (
        <LabelGroup
            style={props.style}
            numLabels={labels.length}
            collapsedText={
                hidden.length > 0 && labels.length === 0 && props.emptyText ? props.emptyText : props.collapsedText
            }
            expandedText={props.expandedText}
        >
            {labels.map((label) => (
                <Label key={label} title={label} variant={props.variant} color={props.color}>
                    {label}
                </Label>
            ))}
            {hidden.map((label) => (
                <Label key={label} title={label} variant={props.variant} color={props.color}>
                    {label}
                </Label>
            ))}
        </LabelGroup>
    )
}

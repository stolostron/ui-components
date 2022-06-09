/* Copyright Contributors to the Open Cluster Management project */

import { Label, LabelGroup, Truncate } from '@patternfly/react-core'
import React, { Fragment, useMemo } from 'react'

export function AcmLabels(props: {
    labels?: string[] | Record<string, string>
    collapse?: string[]
    collapsedText?: string
    expandedText?: string
    allCollapsedText?: string
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

    /* istanbul ignore next */
    let collapsedText = props.collapsedText ?? `${hidden.length} more`

    if (hidden.length > 0 && labels.length === 0 && props.allCollapsedText) {
        collapsedText = props.allCollapsedText
    }

    /* istanbul ignore next */
    const expandedText = props.expandedText ?? 'Show less'

    if (props.labels === undefined) return <Fragment />

    return (
        <LabelGroup numLabels={labels.length} expandedText={expandedText} collapsedText={collapsedText}>
            {labels.map((label) => (
                <Label key={label}>
                    <Truncate content={label} />
                </Label>
            ))}
            {hidden.map((label) => (
                <Label key={label}>
                    <Truncate content={label} />
                </Label>
            ))}
        </LabelGroup>
    )
}

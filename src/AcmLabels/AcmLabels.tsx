/* Copyright Contributors to the Open Cluster Management project */

import { Tooltip } from '@patternfly/react-core'
import React, { Fragment, useMemo, useState } from 'react'
import './AcmLabels.css'

export function AcmLabels(props: {
    labels?: string[] | Record<string, string>
    collapse?: string[]
    collapsedText?: string
    expandedText?: string
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

    const [showMore, setShowMore] = useState(false)
    /* istanbul ignore next */
    const collapsedText = props.collapsedText ?? `${hidden.length} more`
    /* istanbul ignore next */
    const expandedText = props.expandedText ?? 'Show less'

    return (
        <span className="acm-labels">
            {labels.map((label) => (
                <Tooltip key={label} content={label}>
                    <span className="acm-label">{label}</span>
                </Tooltip>
            ))}
            {hidden.length > 0 &&
                showMore &&
                hidden.map((label) => (
                    <Tooltip key={label} content={label}>
                        <span className="acm-label">{label}</span>
                    </Tooltip>
                ))}
            {hidden.length > 0 && showMore ? (
                <span className="acm-label-button" onClick={() => setShowMore(!showMore)}>
                    {expandedText}
                </span>
            ) : (
                <span className="acm-label-button" onClick={() => setShowMore(!showMore)}>
                    {collapsedText}
                </span>
            )}
        </span>
    )
}

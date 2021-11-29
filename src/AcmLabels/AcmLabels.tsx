/* Copyright Contributors to the Open Cluster Management project */

import { Tooltip } from '@patternfly/react-core'
import React, { Fragment, useCallback, useMemo, useState } from 'react'
import './AcmLabels.css'

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

    if (props.labels === undefined) return <Fragment></Fragment>

    const [showMore, setShowMore] = useState(false)

    /* istanbul ignore next */
    let collapsedText = props.collapsedText ?? `${hidden.length} more`

    if (hidden.length > 0 && labels.length === 0 && props.allCollapsedText) {
        collapsedText = props.allCollapsedText
    }

    /* istanbul ignore next */
    const expandedText = props.expandedText ?? 'Show less'

    const onClick = useCallback(() => setShowMore((showMore) => !showMore), [])

    /* istanbul ignore next */
    const onKeyPress = useCallback((e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            setShowMore(!showMore)
            e.preventDefault()
        }
    }, [])

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
            {hidden.length > 0 && showMore && (
                <span className="acm-label-button" tabIndex={0} onClick={onClick} onKeyPress={onKeyPress}>
                    {expandedText}
                </span>
            )}
            {hidden.length > 0 && !showMore && (
                <span className="acm-label-button" tabIndex={0} onClick={onClick} onKeyPress={onKeyPress}>
                    {collapsedText}
                </span>
            )}
        </span>
    )
}

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { makeStyles } from '@material-ui/core'
import { CSSProperties } from '@material-ui/styles'
import { Label } from '@patternfly/react-core'
import '@patternfly/react-core/dist/styles/base.css'
import React, { Fragment, useMemo, useState } from 'react'

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    label: {
        margin: 1,
        overflow: 'hidden',
    },
})

export function AcmLabels(props: {
    labels?: string[] | Record<string, string>
    collapse?: string[]
    style?: CSSProperties
}) {
    const classes = useStyles()
    const [showAll, setShowAll] = useState(false)

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
            .filter((key) => showAll || !props.collapse?.includes(key))
            .map((key: string) => (labelsRecord[key] ? `${key}=${labelsRecord[key]}` : `${key}`))
    }, [labelsRecord, props.collapse, showAll])

    const hidden: string[] = useMemo(() => {
        if (props.labels === undefined) return []
        return Object.keys(labelsRecord)
            .filter((key) => !showAll && props.collapse?.includes(key))
            .map((key: string) => (labelsRecord[key] ? `${key}=${labelsRecord[key]}` : `${key}`))
    }, [labelsRecord, props.collapse, showAll])

    if (props.labels === undefined) return <Fragment></Fragment>

    return (
        <div className={classes.container} style={props.style}>
            {labels.map((label) => (
                <Label key={label} className={classes.label} title={label}>
                    {label}
                </Label>
            ))}
            {hidden.length > 0 && (
                <Label
                    key="hidden-labels"
                    className={classes.label}
                    onClick={() => {
                        setShowAll(true)
                    }}
                    variant="outline"
                    title={hidden.join('\n')}
                >
                    +{hidden.length}
                </Label>
            )}
        </div>
    )
}

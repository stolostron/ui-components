import { Label } from '@patternfly/react-core'
import '@patternfly/react-core/dist/styles/base.css'
import React, { Fragment } from 'react'

export function AcmLabels(props: { labels: string[] | Record<string, string> | undefined }) {
    const { labels } = props
    if (labels === undefined) {
        return <Fragment />
    } else if (Array.isArray(labels)) {
        return (
            <Fragment>
                {labels.map((label) => (
                    <Label key={label} style={{ margin: 1 }}>
                        {label}
                    </Label>
                ))}
            </Fragment>
        )
    } else {
        return (
            <Fragment>
                {Object.keys(labels).map((key) => (
                    <Label key={key} style={{ margin: 1 }}>
                        {key}={labels[key]}
                    </Label>
                ))}
            </Fragment>
        )
    }
}

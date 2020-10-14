import { ExpandableSection } from '@patternfly/react-core'
import React, { ReactNode, useState } from 'react'

export function AcmExpandableSection(props: {
    label: string
    children: ReactNode
    summary?: string
    expanded?: boolean
}) {
    const [expanded, setExpanded] = useState(props.expanded === true)
    return (
        <ExpandableSection
            toggleText={props.summary && !expanded ? `${props.label} - ${props.summary}` : props.label}
            onToggle={() => {
                setExpanded(!expanded)
            }}
            isExpanded={expanded}
        >
            <div style={{ paddingLeft: '24px' }}>{props.children}</div>
        </ExpandableSection>
    )
}

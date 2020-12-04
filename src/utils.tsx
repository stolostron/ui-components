import React from 'react'
import { Tooltip, TooltipPosition } from '@patternfly/react-core'

export function TooltipWrapper(props: {
    children: React.ReactElement
    showTooltip?: boolean
    tooltip?: string | React.ReactNode
}) {
    return props.showTooltip ? (
        <Tooltip content={props.tooltip} position={TooltipPosition.top}>
            {props.children}
        </Tooltip>
    ) : (
        props.children
    )
}

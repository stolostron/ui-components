import React from 'react'
import { Button, ButtonProps } from '@patternfly/react-core'
import { TooltipWrapper } from '../utils'
import { LinkProps } from 'react-router-dom'

export function AcmButton(props: ButtonProps & { tooltip?: string | React.ReactNode } & Partial<LinkProps>) {
    const { isDisabled, tooltip, children, ...otherProps } = props
    return (
        <TooltipWrapper showTooltip={isDisabled && !!tooltip} tooltip={tooltip}>
            <Button {...otherProps} isAriaDisabled={isDisabled}>
                {children}
            </Button>
        </TooltipWrapper>
    )
}

import { Button, ButtonProps, Tooltip } from '@patternfly/react-core'
import React from 'react'

export function AcmButton(props: ButtonProps & { tooltip?: string | React.ReactNode }) {
    const { isDisabled, tooltip, children, ...otherProps } = props
    if (isDisabled && tooltip) {
        return (
            <Tooltip content={props.tooltip}>
                <Button {...otherProps} isAriaDisabled>
                    {children}
                </Button>
            </Tooltip>
        )
    }
    return <Button {...props}>{children}</Button>
}

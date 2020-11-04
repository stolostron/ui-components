import { Button, ButtonVariant } from '@patternfly/react-core'
import React, { ReactNode } from 'react'

export function AcmButton(props: {
    children: ReactNode
    isDisabled?: boolean
    onClick: () => void
    variant?: ButtonVariant
}) {
    return (
        <Button {...props} isDisabled={props.isDisabled}>
            {props.children}
        </Button>
    )
}

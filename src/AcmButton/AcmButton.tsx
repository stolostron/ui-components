import { Button } from '@patternfly/react-core'
import React, { ReactNode } from 'react'

export function AcmButton(props: { children: ReactNode; isDisabled?: boolean; onClick: () => void }) {
    return (
        <Button {...props} isDisabled={props.isDisabled}>
            {props.children}
        </Button>
    )
}

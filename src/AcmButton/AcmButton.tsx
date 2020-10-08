import { Button } from '@patternfly/react-core'
import React, { ReactNode } from 'react'

export function AcmButton(props: { children: ReactNode; onClick: () => void }) {
    return <Button {...props}>{props.children}</Button>
}

import React from 'react'
import { Backdrop, Bullseye, Spinner } from '@patternfly/react-core'

export function AcmSpinnerBackdrop() {
    return (
        <Backdrop>
            <Bullseye>
                <Spinner aria-label="loading" />
            </Bullseye>
        </Backdrop>
    )
}

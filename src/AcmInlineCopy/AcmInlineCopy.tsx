import React, { Fragment } from 'react'
import { CopyIcon } from '@patternfly/react-icons'
import { ButtonVariant } from '@patternfly/react-core'
import { AcmButton } from '../AcmButton/AcmButton'

export function AcmInlineCopy(props: { text: string }) {
    return (
        <span>
            {props.text}
            <AcmButton variant={ButtonVariant.link} icon={CopyIcon}></AcmButton>
        </span>
    )
}

import React, { Fragment, useState, useEffect } from 'react'
import { CopyIcon } from '@patternfly/react-icons'
import { Popover, ButtonVariant } from '@patternfly/react-core'
import { AcmButton } from '../AcmButton/AcmButton'
import { onCopy } from '../utils'

export function AcmInlineCopy(props: { text: string }) {
    const [copied, setCopied] = useState<boolean>(false)
    useEffect(() => {
        if (copied) {
            setTimeout(() => setCopied(false), 2000)
        }
    }, [copied])
    return (
        <span>
            {props.text}
            <Popover bodyContent="" headerContent="Copied!" isVisible={copied}>
                <AcmButton
                    variant={ButtonVariant.link}
                    icon={<CopyIcon />}
                    onClick={(event: any) => {
                        setCopied(true)
                        onCopy(event, props.text)
                    }}
                    aria-label="Copy button"
                    style={{ paddingLeft: '.4rem' }}
                />
            </Popover>
        </span>
    )
}

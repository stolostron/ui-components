import '@patternfly/react-styles/css/components/CodeEditor/code-editor.css'
import React, { useState, useEffect } from 'react'
import { TooltipPosition } from '@patternfly/react-core'
import { ClipboardCopyButton } from '@patternfly/react-core/dist/js/components/ClipboardCopy/ClipboardCopyButton'

export const onCopy = (event: React.ClipboardEvent<HTMLDivElement>, text: string) => {
    const clipboard = event.currentTarget.parentElement
    /* istanbul ignore else */
    if (clipboard) {
        const el = document.createElement('textarea')
        el.value = text
        clipboard.appendChild(el)
        el.select()
        document.execCommand('copy')
        clipboard.removeChild(el)
    }
}

export function AcmCodeSnippet(props: {
    id: string
    fakeCommand?: string
    command: string
    copyTooltipText: string
    copySuccessText: string
}) {
    const [copied, setCopied] = useState<boolean>(false)
    useEffect(() => {
        if (copied) {
            setTimeout(() => setCopied(false), 2000)
        }
    }, [copied])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (
        <div className="pf-c-code-editor pf-m-read-only" style={{ display: 'flex' }} id={props.id}>
            <div className="pf-c-code-editor__main" style={{ width: '100%' }}>
                <div className="pf-c-code-editor__code">
                    <pre className="pf-c-code-editor__code-pre">{props.fakeCommand ?? props.command}</pre>
                </div>
            </div>
            <ClipboardCopyButton
                exitDelay={500}
                entryDelay={100}
                maxWidth={'150px'}
                position={TooltipPosition.auto}
                id={`copy-button-${props.id}`}
                textId={`text-input-${props.id}`}
                aria-label={'Copy buton'}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onClick={(event: any) => {
                    setCopied(true)
                    onCopy(event, props.command)
                }}
            >
                {copied ? props.copySuccessText : props.copyTooltipText}
            </ClipboardCopyButton>
        </div>
    )
}

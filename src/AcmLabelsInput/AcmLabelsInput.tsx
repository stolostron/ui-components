import { FormGroup, Label } from '@patternfly/react-core'
import React, { Fragment, useState } from 'react'

export function AcmLabelsInput(props: {
    id: string
    label: string
    value: Record<string, string> | undefined
    onChange: (labels: Record<string, string> | undefined) => void
    buttonLabel: string
    hidden?: boolean
}) {
    const [inputValue, setInputValue] = useState<string>()
    const [showInput, setShowInput] = useState(false)

    function addLabel(input: string) {
        /* istanbul ignore next */
        const newlabels = input
            .split(',')
            .join(' ')
            .split(' ')
            .map((label) => label.trim())
            .filter((label) => label !== '')
            .reduce(
                (value, label) => {
                    const parts = label.split('=')
                    if (parts.length === 1) {
                        value[parts[0]] = ''
                    } else {
                        value[parts[0]] = parts.slice(1).join('=')
                    }
                    return value
                },
                { ...props.value } as Record<string, string>
            )
        props.onChange(newlabels)
    }

    function removeLabel(key: string) {
        /* istanbul ignore next */
        const newLabels: Record<string, string> = { ...props.value }
        delete newLabels[key]
        props.onChange(newLabels)
    }

    return (
        <Fragment>
            <FormGroup id={`${props.id}-label`} label={props.label} fieldId={props.id} hidden={props.hidden}>
                <div
                    id="label-input-button"
                    className="pf-c-form-control"
                    style={{
                        padding: 0,
                        paddingTop: '1px',
                        display: 'flex',
                        alignItems: 'start',
                        flexWrap: 'wrap',
                        height: 'unset',
                        minHeight: '36px',
                    }}
                    onClick={() => {
                        setInputValue(undefined)
                        setShowInput(true)
                    }}
                >
                    {props.value &&
                        Object.keys(props.value).map((key) => (
                            <Label
                                key={key}
                                style={{ margin: 2 }}
                                onClose={() => removeLabel(key)}
                                variant="outline"
                                closeBtnProps={{ id: `remove-${key}` }}
                            >
                                {key}
                                {props.value && props.value[key].trim() != '' && '=' + props.value[key]}
                            </Label>
                        ))}
                    {!showInput ? (
                        <Fragment />
                    ) : (
                        <input
                            style={{ marginLeft: '2px', marginTop: '1px' }}
                            id={props.id}
                            onChange={(e) => {
                                setInputValue(e.target.value)
                            }}
                            hidden={!showInput}
                            autoFocus
                            onKeyDown={(e) => {
                                switch (e.key) {
                                    case ' ':
                                    case ',':
                                    case 'Enter':
                                        {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            // istanbul ignore else
                                            if (inputValue) {
                                                addLabel(inputValue)
                                            }
                                            const inputElement = e.target as HTMLInputElement
                                            setInputValue('')
                                            inputElement.value = ''
                                            setTimeout(() => (inputElement.value = ''), 0)
                                        }
                                        break
                                    case 'Escape':
                                        setShowInput(false)
                                        break
                                }
                            }}
                            onBlur={
                                /* istanbul ignore next */
                                (e) => {
                                    addLabel(e.target.value)
                                    setShowInput(false)
                                }
                            }
                        />
                    )}
                </div>
            </FormGroup>
        </Fragment>
    )
}

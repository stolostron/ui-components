import { Button, FormGroup, Label } from '@patternfly/react-core'
import PlusCircleIcon from '@patternfly/react-icons/dist/js/icons/plus-circle-icon'
import React, { Fragment, useState } from 'react'

export function AcmLabelsInput(props: {
    id: string
    label: string
    value: string[] | undefined
    onChange: (labels: string[] | undefined) => void
    buttonLabel: string
    hidden?: boolean
}) {
    const [inputValue, setInputValue] = useState<string>()
    const [showInput, setShowInput] = useState(false)

    function addLabel(input: string) {
        /* istanbul ignore next */
        const newlabels = props.value ?? []
        const labels = input
            .split(',')
            .join(' ')
            .split(' ')
            .map((label) => label.trim())
            .filter((label) => label !== '')
        for (const label of labels) {
            if (!newlabels.includes(label)) {
                newlabels.push(label)
            }
        }
        props.onChange(newlabels)
    }

    function removeLabel(label: string) {
        /* istanbul ignore next */
        props.onChange(props.value?.filter((l) => l !== label))
    }

    return (
        <Fragment>
            <FormGroup id={`${props.id}-label`} label={props.label} fieldId={props.id} hidden={props.hidden}>
                <div
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
                >
                    {props.value?.map((label) => (
                        <Label
                            key={label}
                            style={{ margin: 2 }}
                            onClose={() => removeLabel(label)}
                            variant="outline"
                            closeBtnProps={{ id: `remove-${label}` }}
                        >
                            {label}
                        </Label>
                    ))}
                    {!showInput ? (
                        <Button
                            style={{
                                padding: 0,
                                margin: 0,
                                alignSelf: 'center',
                                paddingLeft: '4px',
                                paddingTop: '4px',
                                marginLeft: '3px',
                            }}
                            id={`${props.id}-button`}
                            variant="link"
                            icon={<PlusCircleIcon style={{ color: '#888' }} />}
                            onClick={() => {
                                setInputValue(undefined)
                                setShowInput(true)
                            }}
                            hidden={showInput}
                            aria-label={props.buttonLabel}
                        />
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
                                            e.stopPropagation()
                                            // istanbul ignore else
                                            if (inputValue) {
                                                addLabel(inputValue)
                                            }
                                            const inputElement = e.target as HTMLInputElement
                                            setInputValue('')
                                            setTimeout(() => (inputElement.value = ''), 0)
                                        }
                                        break
                                    case 'Escape':
                                        setShowInput(false)
                                        break
                                }
                            }}
                            onBlur={(e) => {
                                addLabel(e.target.value)
                                setShowInput(false)
                            }}
                        />
                    )}
                </div>
            </FormGroup>
        </Fragment>
    )
}

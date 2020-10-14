import { Button, FormGroup, Label, TextInput } from '@patternfly/react-core'
import PlusCircleIcon from '@patternfly/react-icons/dist/js/icons/plus-circle-icon'
import React, { Fragment, useState } from 'react'

export function AcmLabelsInput(props: {
    id: string
    label: string
    value: string[]
    onChange: (labels: string[]) => void
    hidden?: boolean
}) {
    const [inputValue, setInputValue] = useState<string>()
    const [showInput, setShowInput] = useState(false)

    function addLabel(input: string) {
        const newlabels = props.value
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
        newlabels.sort()
        props.onChange(newlabels)
    }

    function removeLabel(label: string) {
        props.onChange(props.value.filter((l) => l !== label))
    }

    return (
        <Fragment>
            <FormGroup id={`${props.id}-label`} label={props.label} fieldId={props.id} hidden={props.hidden}>
                {props.value.map((label) => (
                    <Label
                        key={label}
                        style={{ marginBottom: 2, marginRight: 4, marginTop: 2 }}
                        onClose={() => removeLabel(label)}
                        variant="outline"
                        closeBtnProps={{ id: `remove-${label}` }}
                    >
                        {label}
                    </Label>
                ))}
                {!showInput ? (
                    <Button
                        id={`${props.id}-button`}
                        variant="link"
                        icon={<PlusCircleIcon />}
                        onClick={() => {
                            setInputValue(undefined)
                            setShowInput(true)
                        }}
                        hidden={showInput}
                    />
                ) : (
                    <TextInput
                        id={props.id}
                        value={inputValue}
                        onChange={(v) => {
                            setInputValue(v)
                        }}
                        hidden={!showInput}
                        autoFocus
                        onKeyDown={(e) => {
                            switch (e.key) {
                                case 'Enter':
                                    if (inputValue) {
                                        addLabel(inputValue)
                                    }
                                    setShowInput(false)
                                    break
                                case 'Escape':
                                    setShowInput(false)
                                    break
                            }
                        }}
                    />
                )}
            </FormGroup>
        </Fragment>
    )
}

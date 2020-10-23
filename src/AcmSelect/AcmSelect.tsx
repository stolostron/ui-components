import { FormGroup, Select, SelectOption, SelectOptionObject } from '@patternfly/react-core'
import React, { useState } from 'react'

type SelextionOptionData = string | { title: string; value: string }
export enum AcmSelectVariant {
    single = 'single',
    checkbox = 'checkbox',
}
export function AcmSelect(props: {
    id: string
    label: string
    value: string | string[] | undefined | SelectOptionObject
    onChange: (value: string | string[] | undefined | SelectOptionObject) => void
    options: SelextionOptionData[]
    placeholder?: string
    required?: boolean
    hidden?: boolean
    clear?: boolean
    variant: AcmSelectVariant
}) {
    const [open, setOpen] = useState(false)

    return (
        <FormGroup
            id={`${props.id}-label`}
            label={props.label}
            isRequired={props.required}
            fieldId={props.id}
            hidden={props.hidden}
        >
            <Select
                variant={props.variant}
                id={props.id}
                selections={props.value}
                isOpen={open}
                onToggle={() => {
                    setOpen(!open)
                }}
                onSelect={(_event, value: string | SelectOptionObject) => {
                    /* istanbul ignore else */
                    props.onChange(value)
                    setOpen(false)
                }}
                onClear={
                    props.clear
                        ? () => {
                              props.onChange(undefined)
                          }
                        : undefined
                }
                placeholderText={props.placeholder}
                required={props.required}
            >
                {props.options.map((option) => {
                    if (typeof option === 'string') {
                        return <SelectOption key={option} value={option} />
                    } else {
                        return (
                            <SelectOption key={option.value} value={option.value}>
                                {option.title}
                            </SelectOption>
                        )
                    }
                })}
            </Select>
        </FormGroup>
    )
}

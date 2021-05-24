/* Copyright Contributors to the Open Cluster Management project */

import { Select, SelectOption } from '@patternfly/react-core'
import React, { useMemo, useState } from 'react'

export function EnumSelect<T>(props: { value: T[keyof T]; anEnum: T; onChange: (value: T[keyof T]) => void }) {
    const [isOpen, setIsOpen] = useState(false)

    const options = useMemo(
        () =>
            Object.keys(props.anEnum)
                .filter((k) => typeof props.anEnum[k as any] === 'number')
                .map((value, index) => (
                    <SelectOption key={index} value={props.anEnum[value]}>
                        {value}
                    </SelectOption>
                )),
        [props.anEnum]
    )
    return (
        <Select
            isOpen={isOpen}
            onToggle={setIsOpen}
            selections={props.value}
            onSelect={(_event, selection) => {
                props.onChange(selection as T[keyof T])
                setIsOpen(false)
            }}
        >
            {options}
        </Select>
    )
}

import '@patternfly/react-core/dist/styles/base.css'
import React, { useState } from 'react'
import { AcmForm } from '../AcmForm/AcmForm'
import { AcmSelect, AcmSelectVariant } from './AcmSelect'

export default {
    title: 'Select',
    component: AcmSelect,
}

export const SingleSelect = () => {
    const [value, setValue] = useState<string>()

    return (
        <AcmForm>
            <AcmSelect
                variant={AcmSelectVariant.single}
                label="Color (lowercase)"
                id="select-color"
                options={['red', 'green', 'blue']}
                value={value}
                onChange={(val: string) => setValue(val)}
                placeholder="Select your color"
                clear
            />

            <AcmSelect
                variant={AcmSelectVariant.single}
                label="Color (uppercase using options)"
                id="456"
                options={[
                    { title: 'Red', value: 'red' },
                    { title: 'Green', value: 'green' },
                    { title: 'Blue', value: 'blue' },
                ]}
                value={value}
                onChange={(val: string) => setValue(val)}
                placeholder="Select your color"
                clear
            />
        </AcmForm>
    )
}

export const MultiSelect = () => {
    const [value, setValue] = useState<string[]>([])
    const onSelect = (selection: string) => {
        value?.includes(selection) ? setValue(value?.filter((v) => v !== selection)) : setValue([...value, selection])
    }

    return (
        <AcmForm>
            <AcmSelect
                variant={AcmSelectVariant.checkbox}
                label="Color (lowercase)"
                id="select-color"
                options={['red', 'green', 'blue']}
                value={value}
                onChange={onSelect}
                placeholder="Select your color"
                clear
            />

            <AcmSelect
                variant={AcmSelectVariant.checkbox}
                label="Color (uppercase using options)"
                id="456"
                options={[
                    { title: 'Red', value: 'red' },
                    { title: 'Green', value: 'green' },
                    { title: 'Blue', value: 'blue' },
                ]}
                value={value}
                onChange={onSelect}
                placeholder="Select your color"
                clear
            />
        </AcmForm>
    )
}

import { SelectOption } from '@patternfly/react-core'
import '@patternfly/react-core/dist/styles/base.css'
import React, { useState } from 'react'
import { AcmForm } from '../AcmForm/AcmForm'
import { AcmSelect } from './AcmSelect'

export default {
    title: 'Select',
    component: AcmSelect,
}

export const Select = () => {
    const [value, setValue] = useState<string>()

    return (
        <AcmForm>
            <AcmSelect label="Select" id="select" value={value} onChange={setValue}>
                <SelectOption key="option-1" value="option-1">
                    Option 1
                </SelectOption>
                <SelectOption key="option-2" value="option-2">
                    Option 2
                </SelectOption>
                <SelectOption key="option-3" value="option-3">
                    Option 3
                </SelectOption>
            </AcmSelect>
        </AcmForm>
    )
}

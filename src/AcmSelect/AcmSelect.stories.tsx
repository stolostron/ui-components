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
            <AcmSelect
                label="Color (lowercase)"
                id="select-color"
                options={['red', 'green', 'blue']}
                value={value}
                onChange={setValue}
                placeholder="Select your color"
                clear
            />

            <AcmSelect
                label="Color (uppercase using options)"
                id="456"
                options={[
                    { title: 'Red', value: 'red' },
                    { title: 'Green', value: 'green' },
                    { title: 'Blue', value: 'blue' },
                    { title: 'Number', value: 4 },
                ]}
                value={value}
                onChange={setValue}
                placeholder="Select your color"
                clear
            />
        </AcmForm>
    )
}

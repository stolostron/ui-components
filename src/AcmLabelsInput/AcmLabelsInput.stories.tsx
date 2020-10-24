import '@patternfly/react-core/dist/styles/base.css'
import React, { useState } from 'react'
import { AcmForm } from '../AcmForm/AcmForm'
import { AcmLabelsInput } from './AcmLabelsInput'

export default {
    title: 'LabelsInput',
    component: AcmLabelsInput,
}

export const LabelsInput = () => {
    const [value, setValue] = useState<string[]>([])

    return (
        <AcmForm>
            <AcmLabelsInput label="Label" id="123" value={value} onChange={setValue} buttonLabel="Add label" />
        </AcmForm>
    )
}

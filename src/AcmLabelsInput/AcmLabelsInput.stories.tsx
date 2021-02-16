import '@patternfly/react-core/dist/styles/base.css'
import React, { useState } from 'react'
import { AcmForm } from '../AcmForm/AcmForm'
import { AcmLabelsInput } from './AcmLabelsInput'
import { AcmPageCard } from '../AcmPage/AcmPage'

export default {
    title: 'LabelsInput',
    component: AcmLabelsInput,
    argTypes: {
        isDisabled: { control: 'boolean' },
    },
}

export const LabelsInput = (args) => {
    const [value, setValue] = useState<string[]>([])
    return (
        <AcmPageCard>
            <AcmForm>
                <AcmLabelsInput
                    label="Labels Input"
                    id="labels-input"
                    isDisabled={args.isDisabled}
                    value={value}
                    onChange={setValue}
                    buttonLabel="Add label"
                    placeholder="Enter key=value, then press enter, space, or comma"
                />
            </AcmForm>
        </AcmPageCard>
    )
}
LabelsInput.args = { isDisabled: false }

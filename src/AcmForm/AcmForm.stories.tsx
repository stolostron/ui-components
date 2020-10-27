import '@patternfly/react-core/dist/styles/base.css'
import React, { useState } from 'react'
import { AcmLabelsInput } from '../AcmLabelsInput/AcmLabelsInput'
import { AcmSelect } from '../AcmSelect/AcmSelect'
import { AcmTextInput } from '../AcmTextInput/AcmTextInput'
import { AcmForm, AcmSubmit } from './AcmForm'

export default {
    title: 'Form',
    component: AcmForm,
}

export const Form = () => {
    const [value, setValue] = useState<string>()
    const [select, setSelect] = useState<string>()
    const [labels, setLabels] = useState<string[]>()
    return (
        <AcmForm>
            <AcmTextInput
                label="Text Input"
                id="textInput"
                value={value}
                onChange={setValue}
                isRequired
                validation={() => undefined}
            />
            <AcmTextInput
                label="Secret Input"
                id="secretInput"
                value={value}
                onChange={setValue}
                type="password"
                isRequired
            />
            <AcmSelect
                label="Select Input"
                id="selectInput"
                options={[
                    { title: 'Red', value: 'red' },
                    { title: 'Green', value: 'green' },
                    { title: 'Blue', value: 'blue' },
                ]}
                value={select}
                onChange={setSelect}
                placeholder="Select your color"
                clear
                required
            />
            <AcmLabelsInput
                id="labelsInput"
                label="Labels Input"
                value={labels}
                onChange={setLabels}
                buttonLabel="Add label"
            ></AcmLabelsInput>

            <AcmSubmit
                onClick={() => {
                    alert('Submit')
                }}
            >
                Submit
            </AcmSubmit>
        </AcmForm>
    )
}

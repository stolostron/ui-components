import '@patternfly/react-core/dist/styles/base.css'
import React, { useState } from 'react'
import { AcmLabelsInput } from '../AcmLabelsInput/AcmLabelsInput'
import { AcmSelect } from '../AcmSelect/AcmSelect'
import { AcmTextInput } from '../AcmTextInput/AcmTextInput'
import { AcmTextArea } from '../AcmTextArea/AcmTextArea'
import { AcmForm, AcmSubmit } from './AcmForm'

export default {
    title: 'Form',
    component: AcmForm,
}

export const Form = () => {
    const [email, setEmail] = useState<string>()
    const [password, setPassword] = useState<string>()
    const [description, setDescription] = useState<string>()
    const [select, setSelect] = useState<string>()
    const [labels, setLabels] = useState<string[]>()
    return (
        <AcmForm>
            <AcmTextInput
                id="textInput"
                label="Email"
                placeholder="Enter email"
                labelHelpTitle="Email Help"
                labelHelp="The email must be in valid email format."
                value={email}
                onChange={setEmail}
                validation={(value) => {
                    if (typeof value === 'string') {
                        const regExp = /^[\w-]+(\.[\w-]+)*@([a-z0-9-]+(\.[a-z0-9-]+)*?\.[a-z]{2,6}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/
                        if (!regExp.test(value)) return 'Must be a valid email.'
                    }
                }}
                isRequired
            />
            <AcmTextInput
                id="secretInput"
                label="Password"
                placeholder="Enter password"
                labelHelpTitle="Password Help"
                labelHelp="The password must be at least 8 characters long."
                type="password"
                value={password}
                onChange={setPassword}
                validation={(value) => {
                    if (typeof value === 'string') {
                        if (value.length < 8) return 'Password must be at least 8 characters.'
                    }
                }}
                isRequired
            />
            <AcmTextArea
                id="textArea"
                label="Description"
                placeholder="Enter description"
                labelHelpTitle="Help Title"
                labelHelp="This is the help for the text area"
                value={description}
                onChange={setDescription}
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

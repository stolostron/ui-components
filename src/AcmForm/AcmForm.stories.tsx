import { ActionGroup, SelectOption } from '@patternfly/react-core'
import '@patternfly/react-core/dist/styles/base.css'
import React, { useState } from 'react'
import { AcmAlert, AcmAlertGroup } from '../AcmAlert/AcmAlert'
import { AcmLabelsInput } from '../AcmLabelsInput/AcmLabelsInput'
import { AcmMultiSelect } from '../AcmMultiSelect/AcmMultiSelect'
import { AcmPageCard } from '../AcmPage/AcmPage'
import { AcmSelect } from '../AcmSelect/AcmSelect'
import { AcmTextArea } from '../AcmTextArea/AcmTextArea'
import { AcmTextInput } from '../AcmTextInput/AcmTextInput'
import { AcmForm, AcmSubmit } from './AcmForm'

export default {
    title: 'Form',
    component: AcmForm,
}

export const Form = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [description, setDescription] = useState<string>()
    const [selectValue, setSelectValue] = useState<string>()
    const [multiselectValue, setMultiselectValue] = useState<string[]>([])
    const [labels, setLabels] = useState<Record<string, string>>()
    const [submitText, setSubmitText] = useState('Submit')
    const [errors, setErrors] = useState<string[]>([])

    return (
        <AcmPageCard>
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
                    label="Text Area"
                    placeholder="Enter your multi-line input"
                    labelHelp="This is the help for the text area"
                    value={description}
                    onChange={setDescription}
                    isRequired
                />

                <AcmSelect
                    id="acm-select"
                    label="Select"
                    placeholder="Select your option"
                    labelHelp="AcmSelect allows the selection of one option"
                    value={selectValue}
                    onChange={setSelectValue}
                    isRequired
                >
                    <SelectOption value="red">
                        <span style={{ color: 'red' }}>Red</span>
                    </SelectOption>
                    <SelectOption value="green">
                        <span style={{ color: 'green' }}>Green</span>
                    </SelectOption>
                    <SelectOption value="blue">
                        <span style={{ color: 'blue' }}>Blue</span>
                    </SelectOption>
                </AcmSelect>

                <AcmMultiSelect
                    id="acm-multiselect"
                    label="Multi-Select"
                    placeholder="Select your options"
                    labelHelp="AcmMultiSelect allows the selection of multiple options"
                    value={multiselectValue}
                    onChange={setMultiselectValue}
                >
                    <SelectOption key="option-1" value="option-1">
                        Option 1
                    </SelectOption>
                    <SelectOption key="option-2" value="option-2">
                        Option 2
                    </SelectOption>
                    <SelectOption key="option-3" value="option-3">
                        Option 3
                    </SelectOption>
                </AcmMultiSelect>

                <AcmLabelsInput
                    id="labelsInput"
                    label="Labels Input"
                    value={labels}
                    onChange={setLabels}
                    buttonLabel="Add label"
                />

                <AcmAlertGroup>
                    {errors.map((err, i) => (
                        <AcmAlert key={i} title={err} variant="danger" isInline />
                    ))}
                </AcmAlertGroup>

                <ActionGroup>
                    <AcmSubmit
                        onClick={() => {
                            setErrors([])
                            setSubmitText('Processing')
                            return new Promise((resolve) =>
                                setTimeout(() => {
                                    setSubmitText('Submit')
                                    setErrors(['Error - Not Implemented'])
                                    resolve()
                                }, 2000)
                            )
                        }}
                    >
                        {submitText}
                    </AcmSubmit>
                </ActionGroup>
            </AcmForm>
        </AcmPageCard>
    )
}

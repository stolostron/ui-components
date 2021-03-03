import React, { useState } from 'react'
import { SelectOption } from '@patternfly/react-core'
import { AcmWizard } from './AcmWizard'
import { AcmTextInput } from '../AcmTextInput/AcmTextInput'
import { AcmTextArea } from '../AcmTextArea/AcmTextArea'
import { AcmSelect } from '../AcmSelect/AcmSelect'
import { AcmMultiSelect } from '../AcmMultiSelect/AcmMultiSelect'
import { AcmLabelsInput } from '../AcmLabelsInput/AcmLabelsInput'
import { AcmPageCard } from '../AcmPage/AcmPage'

export default {
    title: 'Wizard',
    component: AcmWizard,
}

export const Wizard = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [description, setDescription] = useState<string>()
    const [selectValue, setSelectValue] = useState<string>()
    const [multiselectValue, setMultiselectValue] = useState<string[]>([])
    const [labels, setLabels] = useState<Record<string, string>>()
    return (
        <AcmPageCard>
            <AcmWizard
                steps={[
                    {
                        name: 'User information',
                        component: (
                            <>
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
                            </>
                        ),
                    },
                    {
                        name: 'Description',
                        component: (
                            <>
                                <AcmTextArea
                                    id="textArea"
                                    label="Text Area"
                                    placeholder="Enter your multi-line input"
                                    labelHelp="This is the help for the text area"
                                    value={description}
                                    onChange={setDescription}
                                    isRequired
                                />
                            </>
                        ),
                    },
                    {
                        name: 'Favorite colors',
                        steps: [
                            {
                                id: 1,
                                name: 'First',
                                component: (
                                    <AcmSelect
                                        id="acm-select"
                                        label="Select"
                                        placeholder="Select your option"
                                        labelHelp="AcmSelect allows the selection of one option"
                                        value={selectValue}
                                        onChange={setSelectValue}
                                        isRequired
                                    >
                                            {console.log('sdjlskdjflkj')}
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
                                ),
                            },
                            {
                                id: 2,
                                name: 'Second',
                                component: (
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
                                ),
                            },
                        ],
                    },
                    {
                        name: 'Labels',
                        component: (
                            <>
                                <AcmLabelsInput
                                    id="labelsInput"
                                    label="Labels Input"
                                    value={labels}
                                    onChange={setLabels}
                                    buttonLabel="Add label"
                                />
                            </>
                        ),
                    },
                ]}
                submitLabel="Apply"
                submitProcessingLabel="Applying"
                nextButtonText="Next"
                backButtonText="Back"
                cancelButtonText="Cancel"
                height={600}
                onSave={() => {
                    return new Promise<undefined>((resolve) =>
                        setTimeout(() => {
                            // setErrors(['Error - Not Implemented'])
                            resolve(undefined)
                        }, 2000)
                    )
                }}
            />
        </AcmPageCard>
    )
}

import { SelectOption } from '@patternfly/react-core'
import '@patternfly/react-core/dist/styles/base.css'
import React, { useState } from 'react'
import { AcmLabelsInput } from '../AcmLabelsInput/AcmLabelsInput'
import { AcmMultiSelect } from '../AcmSelect/AcmMultiSelect'
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
    const [favoriteColor, setFavoriteColor] = useState<string>()
    const [otherColors, setOtherColors] = useState<string[]>([])
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
                id="colorSelect"
                label="Favorite Color"
                placeholder="Select your favorite color"
                labelHelp="This is the help for the control"
                value={favoriteColor}
                onChange={setFavoriteColor}
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
                id="otherColorsSelect"
                label="Other Colors"
                placeholder="Select your other colors"
                labelHelp="This is the help for the control"
                value={otherColors}
                onChange={setOtherColors}
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
            </AcmMultiSelect>

            {/* <AcmSelect
                variant={SelectVariant.checkbox}
                id="selectInput"
                label="Other colors"
                selections={selects}
                onSelect={(event, selection) => {
                    if (typeof selection === 'string') {
                        if (selects.includes(selection)) {
                            setSelects((prevState) => prevState.filter((item) => item !== selection))
                        } else {
                            setSelects((prevState) => [...prevState, selection])
                        }
                    }
                }}
                placeholderText="Select your color"
                isRequired
            >
                <SelectOption key={'red'} value="red">
                    Red
                </SelectOption>
                <SelectOption key={'green'} value="green">
                    Green
                </SelectOption>
                <SelectOption key={'blue'} value="blue">
                    Blue
                </SelectOption>
            </AcmSelect> */}

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

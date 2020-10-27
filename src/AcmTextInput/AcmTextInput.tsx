import { FormGroup, TextInput, TextInputProps } from '@patternfly/react-core'
import React, { useContext, useLayoutEffect, useState } from 'react'
import { FormContext } from '../AcmForm/AcmForm'

type AcmTextInputProps = TextInputProps & {
    id: string
    label: string
    validation?: (value: string) => string
}
export function AcmTextInput(props: AcmTextInputProps) {
    const formContext = useContext(FormContext)
    const [validated, setValidated] = useState<'default' | 'success' | 'error' | 'warning' | undefined>()
    const [error, setError] = useState<string>()

    useLayoutEffect(() => {
        let error: string | undefined = undefined
        if (props.isRequired) {
            if (!props.value || (typeof props.value === 'string' && props.value.trim() === '')) {
                error = 'Required'
            }
        }
        setError(error)
        if (formContext.validate) {
            setValidated(error ? 'error' : undefined)
        }
        formContext.setError(props.id, error)
    }, [props.value])

    useLayoutEffect(() => {
        setValidated(error ? 'error' : undefined)
    }, [formContext.validate])

    return (
        <FormGroup
            id={`${props.id}-label`}
            label={props.label}
            isRequired={props.isRequired}
            fieldId={props.id}
            hidden={props.hidden}
            helperTextInvalid={error}
            validated={validated}
        >
            <TextInput {...props} validated={validated} />
        </FormGroup>
    )
}

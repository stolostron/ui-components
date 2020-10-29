import { FormGroup, Popover, TextInput, TextInputProps } from '@patternfly/react-core'
import React, { Fragment, ReactNode, useContext, useLayoutEffect, useState } from 'react'
import { FormContext } from '../AcmForm/AcmForm'
import HelpIcon from '@patternfly/react-icons/dist/js/icons/help-icon'

type AcmTextInputProps = TextInputProps & {
    id: string
    label: string
    validation?: (value: string) => string | undefined
    labelHelp?: string
    labelHelpTitle?: ReactNode
    helperText?: ReactNode
}
export function AcmTextInput(props: AcmTextInputProps) {
    const formContext = useContext(FormContext)
    const [validated, setValidated] = useState<'default' | 'success' | 'error' | 'warning' | undefined>()
    const [error, setError] = useState<string>()
    const { validation, labelHelp, labelHelpTitle, helperText, ...textInputProps } = props

    useLayoutEffect(() => {
        let error: string | undefined = undefined
        if (props.isRequired) {
            if (!props.value || (typeof props.value === 'string' && props.value.trim() === '')) {
                error = 'Required'
            }
        }
        if (!error && validation) {
            error = validation(props.value as string)
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
            helperText={helperText}
            labelIcon={
                /* istanbul ignore next */
                props.labelHelp ? (
                    <Popover
                        id={`${props.id}-label-help-popover`}
                        headerContent={labelHelpTitle}
                        bodyContent={labelHelp}
                    >
                        <button
                            id={`${props.id}-label-help-button`}
                            aria-label="More info"
                            onClick={(e) => e.preventDefault()}
                            // aria-describedby="simple-form-name"
                            className="pf-c-form__group-label-help"
                        >
                            <HelpIcon noVerticalAlign />
                        </button>
                    </Popover>
                ) : (
                    <Fragment />
                )
            }
        >
            <TextInput {...textInputProps} validated={validated} />
        </FormGroup>
    )
}

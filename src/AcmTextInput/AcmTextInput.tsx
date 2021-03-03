/* Copyright Contributors to the Open Cluster Management project */

import { FormGroup, Popover, TextInput, TextInputProps } from '@patternfly/react-core'
import HelpIcon from '@patternfly/react-icons/dist/js/icons/help-icon'
import React, { Fragment, ReactNode, useLayoutEffect, useState } from 'react'
import { useFormContext } from '../AcmForm/AcmForm'

type AcmTextInputProps = TextInputProps & {
    id: string
    label: string
    validation?: (value: string) => string | undefined
    labelHelp?: string
    labelHelpTitle?: ReactNode
    helperText?: ReactNode
}
export function AcmTextInput(props: AcmTextInputProps) {
    const formContext = useFormContext()
    const [validated, setValidated] = useState<'default' | 'success' | 'error' | 'warning' | undefined>()
    const [error, setError] = useState<string>()
    const { validation, labelHelp, labelHelpTitle, helperText, ...textInputProps } = props

    useLayoutEffect(() => {
        let error: string | undefined = undefined
        /* istanbul ignore else */
        if (props.hidden !== true) {
            if (props.isRequired) {
                if (!props.value || (typeof props.value === 'string' && props.value.trim() === '')) {
                    error = 'Required'
                }
            }
            if (!error && validation) {
                error = validation(props.value as string)
            }
        }
        setError(error)
        if (formContext.validate) {
            setValidated(error ? 'error' : undefined)
        }
        formContext.setError(props.id, error)
    }, [props.value, props.hidden])

    useLayoutEffect(() => {
        setValidated(error ? 'error' : undefined)
    }, [formContext.validate])

    useLayoutEffect(() => {
        if (formContext.errors?.[props.id] !== undefined && !error) {
            setValidated('error')
            setError(formContext.errors[props.id])
        }
    }, [formContext.errors, error])

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
            <TextInput
                {...textInputProps}
                validated={validated}
                isDisabled={props.isDisabled || formContext.isReadOnly}
            />
        </FormGroup>
    )
}

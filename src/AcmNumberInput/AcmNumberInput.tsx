/* Copyright Contributors to the Open Cluster Management project */

import { FormGroup, Popover, NumberInput, NumberInputProps } from '@patternfly/react-core'
import HelpIcon from '@patternfly/react-icons/dist/js/icons/help-icon'
import React, { Fragment, ReactNode, useLayoutEffect, useState } from 'react'
import { useFormContext } from '../AcmForm/AcmForm'

type AcmNumberInputProps = NumberInputProps & {
    id: string
    label: string
    validation?: (value: number) => string | undefined
    labelHelp?: string
    labelHelpTitle?: ReactNode
    helperText?: ReactNode
}

export function AcmNumberInput(props: AcmNumberInputProps) {
    const formContext = useFormContext()
    const [validated, setValidated] = useState<'default' | 'success' | 'error' | 'warning' | undefined>()
    const [error, setError] = useState<string>()
    const { validation, labelHelp, labelHelpTitle, helperText, ...numberInputProps } = props

    useLayoutEffect(() => {
        let error: string | undefined = undefined
        /* istanbul ignore else */
        if (props.hidden !== true) {
            if (props.required) {
                /* istanbul ignore else */
                if (props.value === undefined) {
                    error = 'Required'
                }
            }
            if (!error && validation) {
                error = validation(props.value as number)
            }
        }
        setError(error)
        if (formContext.validate) {
            /* istanbul ignore next-line */
            setValidated(error ? 'error' : undefined)
        }
        formContext.setError(props.id, error)
    }, [props.value, props.hidden])

    useLayoutEffect(() => {
        setValidated(error ? 'error' : undefined)
    }, [formContext.validate])

    return (
        <FormGroup
            id={`${props.id}-label`}
            label={props.label}
            isRequired={props.required}
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
            <NumberInput
                {...numberInputProps}
                inputName={props.id}
                inputAriaLabel={props.label}
                // validated={validated} not supported now
                isDisabled={props.isDisabled || formContext.isReadOnly}
            />
        </FormGroup>
    )
}

import { Button, ButtonProps, Form, FormProps } from '@patternfly/react-core'
import React, { createContext, useContext, useEffect, useState } from 'react'

const noop = () => {
    //
}

export const FormContext = createContext<{
    readonly validate: boolean
    setValidate: (validate: boolean) => void
    readonly errors: { [id: string]: string | undefined }
    setError: (id: string, error?: string) => void
}>({
    validate: false,
    setValidate: noop,
    errors: {},
    setError: noop,
})

export function AcmForm(props: FormProps) {
    const [validate, setValidate] = useState(false)
    const [errors, setErrors] = useState<{ [id: string]: string | undefined }>({})
    const setError = (id: string, error?: string) => {
        const copy = { ...errors }
        copy[id] = error
        setErrors(copy)
    }
    return (
        <FormContext.Provider value={{ validate, setValidate, errors, setError }}>
            <Form {...props} />
        </FormContext.Provider>
    )
}

export function AcmSubmit(props: ButtonProps) {
    const context = useContext(FormContext)
    const [isDisabled, setDisabled] = useState(false)
    useEffect(() => {
        if (context.validate) {
            const hasError = Object.keys(context.errors).find((id) => context.errors[id] != undefined) != undefined
            setDisabled(hasError)
        }
    }, [context.errors])
    return (
        <Button
            onClick={(event) => {
                const hasError = Object.keys(context.errors).find((id) => context.errors[id] != undefined) != undefined
                if (hasError) {
                    context.setValidate(true)
                    setDisabled(hasError)
                } else {
                    /* istanbul ignore else */
                    if (props.onClick) {
                        props.onClick(event)
                    }
                }
            }}
            isDisabled={isDisabled || props.isDisabled}
        >
            {props.children}
        </Button>
    )
}

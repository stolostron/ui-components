import { FormGroup, Popover, Select, SelectOption, SelectProps, SelectVariant } from '@patternfly/react-core'
import HelpIcon from '@patternfly/react-icons/dist/js/icons/help-icon'
import React, { Fragment, ReactNode, useContext, useLayoutEffect, useState } from 'react'
import { FormContext } from '../AcmForm/AcmForm'

type AcmMultiSelectProps = Pick<
    SelectProps,
    Exclude<keyof SelectProps, 'onToggle' | 'onChange' | 'selections' | 'onSelect'>
> & {
    id: string
    label: string
    value: string[] | undefined
    onChange: (value: string[] | undefined) => void
    validation?: (value: string[] | undefined) => string | undefined
    placeholder?: string
    labelHelp?: string
    labelHelpTitle?: ReactNode
    helperText?: ReactNode
    isRequired?: boolean
}

export function AcmMultiSelect(props: AcmMultiSelectProps) {
    const [open, setOpen] = useState(false)
    const formContext = useContext(FormContext)
    const [validated, setValidated] = useState<'default' | 'success' | 'error' | 'warning' | undefined>()
    const [error, setError] = useState<string>()
    const {
        validation,
        labelHelp,
        labelHelpTitle,
        helperText,
        isRequired,
        onChange,
        value,
        placeholder,
        ...selectProps
    } = props

    const [placeholderText, setPlaceholderText] = useState<ReactNode | undefined>(props.placeholder)

    useLayoutEffect(() => {
        let error: string | undefined = undefined
        if (isRequired) {
            if (props.value === undefined) {
                error = 'Required'
            } else if (props.value.length === 0) {
                error = 'Required'
            }
        }
        if (!error && validation) {
            error = validation(props.value)
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

    useLayoutEffect(() => {
        if (value === undefined || value.length === 0) {
            setPlaceholderText(<span style={{ color: '#666' }}>{placeholder}</span>)
        } else {
            setPlaceholderText(
                React.Children.map(props.children, (child) => {
                    const option = (child as unknown) as SelectOption
                    if (value.includes(option.props.value as string)) return option.props.children
                    /* istanbul ignore next */
                    return undefined
                })
                    ?.filter((item) => item !== undefined)
                    .map((node: ReactNode, index) => {
                        if (index === 0) {
                            return <Fragment key={`${index}`}>{node}</Fragment>
                        } else {
                            return (
                                <Fragment key={`${index}`}>
                                    <span>, </span>
                                    {node}
                                </Fragment>
                            )
                        }
                    })
            )
        }
    }, [value])

    return (
        <FormGroup
            id={`${props.id}-label`}
            label={props.label}
            isRequired={isRequired}
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
            <Select
                variant={SelectVariant.checkbox}
                aria-labelledby={`${props.id}-label`}
                {...selectProps}
                isOpen={open}
                onToggle={() => {
                    setOpen(!open)
                }}
                selections={value}
                onSelect={(_event, selection) => {
                    if (value === undefined) {
                        onChange([selection as string])
                    } else {
                        if (value.includes(selection as string)) {
                            onChange(value.filter((item) => item !== selection))
                        } else {
                            onChange([...value, selection as string])
                        }
                    }
                }}
                onClear={
                    !props.isRequired
                        ? () => {
                              onChange(undefined)
                          }
                        : undefined
                }
                placeholderText={placeholderText}
            />
            {validated === 'error' ? (
                <div style={{ borderTop: '1.75px solid red', paddingBottom: '6px' }}></div>
            ) : (
                <Fragment />
            )}
        </FormGroup>
    )
}
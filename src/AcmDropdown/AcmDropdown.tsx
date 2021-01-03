import React, { useState } from 'react'
import {
    Dropdown,
    DropdownToggle,
    DropdownItem,
    DropdownPosition,
    KebabToggle,
    DropdownProps,
} from '@patternfly/react-core'
import { makeStyles } from '@material-ui/styles'
import { TooltipWrapper } from '../utils'

// TODO this dropdown is not accessible when the dropdown items are wrapped by the Tooltip component

type Props = Omit<DropdownProps, 'toggle' | 'onSelect'>

export type AcmDropdownProps = Props & {
    dropdownItems: AcmDropdownItems[]
    text: string
    isDisabled?: boolean
    onSelect: (id: string) => void
    id: string
    toggle?: React.ReactNode
    tooltip?: string | React.ReactNode
    isKebab?: boolean
    onHover?: () => void
    isPlain?: boolean
    isPrimary?: boolean
    onToggle?: () => void
}

export type AcmDropdownItems = {
    id: string
    component?: string | React.ReactNode
    isDisabled?: boolean
    tooltip?: string | React.ReactNode
    text: string | React.ReactNode
    href?: string
    icon?: React.ReactNode
}

const useStyles = makeStyles({
    buttonTitle: {
        '& button': {
            '& span': {
                color: (props: AcmDropdownProps) =>
                    props.isPrimary
                        ? 'var(--pf-global--Color--light-100)'
                        : props.isKebab
                        ? undefined
                        : 'var(--pf-global--primary-color--100)',
            },
            '&:hover, &:focus': {
                '& span': {
                    color: (props: AcmDropdownProps) =>
                        props.isKebab ? undefined : 'var(--pf-global--primary-color--100)',
                },
            },
        },
    },
})

export function AcmDropdown(props: AcmDropdownProps) {
    const [isOpen, setOpen] = useState<boolean>(false)
    const classes = useStyles(props)

    const onSelect = (id: string) => {
        props.onSelect(id)
        setOpen(!isOpen)
    }

    return (
        <TooltipWrapper showTooltip={props.isDisabled && !!props.tooltip} tooltip={props.tooltip}>
            <Dropdown
                className={classes.buttonTitle}
                onMouseOver={props.onHover}
                position={DropdownPosition.right}
                dropdownItems={props.dropdownItems.map((item) => (
                    <TooltipWrapper
                        showTooltip={item.isDisabled && !!item.tooltip}
                        tooltip={item.tooltip}
                        key={item.id}
                    >
                        <DropdownItem {...item} onClick={() => onSelect(item.id)}>
                            {item.text}
                        </DropdownItem>
                    </TooltipWrapper>
                ))}
                toggle={
                    props.isKebab ? (
                        <KebabToggle
                            id={props.id}
                            isDisabled={props.isDisabled}
                            onToggle={() => {
                                if (props.onToggle) props.onToggle()
                                setOpen(!isOpen)
                            }}
                        />
                    ) : (
                        <DropdownToggle
                            isPrimary={props.isPrimary}
                            id={props.id}
                            isDisabled={props.isDisabled}
                            onToggle={() => {
                                if (props.onToggle) props.onToggle()
                                setOpen(!isOpen)
                            }}
                        >
                            {props.text}
                        </DropdownToggle>
                    )
                }
                isOpen={isOpen}
                isPlain={props.isPlain}
            />
        </TooltipWrapper>
    )
}

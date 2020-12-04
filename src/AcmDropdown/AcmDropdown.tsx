import React, { useState } from 'react'
import {
    Dropdown,
    DropdownToggle,
    DropdownItem,
    DropdownPosition,
    KebabToggle,
    DropdownProps,
    Tooltip,
    TooltipPosition,
} from '@patternfly/react-core'

type Props = Omit<DropdownProps, 'toggle'>

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

export function AcmDropdown(props: AcmDropdownProps) {
    const [isOpen, setOpen] = useState<boolean>(false)

    const onSelect = (id: string) => {
        props.onSelect(id)
        setOpen(!isOpen)
    }

    return (
        <TooltipWrapper showTooltip={props.isDisabled && !!props.tooltip} tooltip={props.tooltip}>
            <Dropdown
                onMouseOver={props.onHover}
                // onSelect={onSelect}
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
                        <KebabToggle id={props.id} isDisabled={props.isDisabled} onToggle={() => setOpen(!isOpen)} />
                    ) : (
                        <DropdownToggle id={props.id} isDisabled={props.isDisabled} onToggle={() => setOpen(!isOpen)}>
                            {props.text}
                        </DropdownToggle>
                    )
                }
                isOpen={isOpen}
                isPlain={props.isKebab}
            />
        </TooltipWrapper>
    )
}

export function TooltipWrapper(props: {
    children: React.ReactElement
    showTooltip?: boolean
    tooltip?: string | React.ReactNode
}) {
    return props.showTooltip ? (
        <Tooltip content={props.tooltip} position={TooltipPosition.top}>
            {props.children}
        </Tooltip>
    ) : (
        props.children
    )
}

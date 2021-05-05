/* Copyright Contributors to the Open Cluster Management project */

import { Select, SelectOption, SelectVariant, ToolbarChip, ToolbarFilter } from '@patternfly/react-core'
import React, { ReactNode, useCallback, useState } from 'react'

export interface TableFilterProps {
    label: string
    selections: string[]
    setSelections: (set: (selections: string[]) => string[]) => void
    options: (
        | string
        | {
              key: string
              node?: ReactNode
          }
    )[]
}

export function TableFilter(props: TableFilterProps) {
    const [isOpen, setIsOpen] = useState(false)
    const onToggle = useCallback(() => setIsOpen((expanded) => !expanded), [])
    const onSelect = useCallback(
        (event, selection) =>
            props.setSelections((selections) =>
                event.target.checked ? [...selections, selection] : selections.filter((value) => value !== selection)
            ),
        [props.setSelections]
    )
    const deleteChip = useCallback(
        (_, chip: string | ToolbarChip) => {
            if (typeof chip !== 'string') chip = chip.key
            props.setSelections((selections) => selections.filter((value) => value !== chip))
        },
        [props.setSelections]
    )
    const deleteChipGroup = useCallback(() => {
        props.setSelections(() => [])
    }, [props.setSelections])

    return (
        <ToolbarFilter
            chips={props.selections}
            deleteChip={deleteChip}
            deleteChipGroup={deleteChipGroup}
            categoryName={props.label}
        >
            <Select
                isOpen={isOpen}
                variant={SelectVariant.checkbox}
                aria-label={props.label}
                onToggle={onToggle}
                onSelect={onSelect}
                selections={props.selections}
                placeholderText={props.label}
            >
                {props.options.map((option) => {
                    if (typeof option === 'string') return <SelectOption key={option} value={option} />
                    return <SelectOption key={option.key} value={option.node ?? option.key} />
                })}
            </Select>
        </ToolbarFilter>
    )
}

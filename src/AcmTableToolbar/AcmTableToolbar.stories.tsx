/* Copyright Contributors to the Open Cluster Management project */

import {
    Button,
    ButtonVariant,
    Divider,
    Dropdown,
    DropdownItem,
    DropdownSeparator,
    DropdownToggle,
    DropdownToggleCheckbox,
    InputGroup,
    KebabToggle,
    OverflowMenu,
    OverflowMenuContent,
    OverflowMenuControl,
    OverflowMenuGroup,
    OverflowMenuItem,
    Pagination,
    Select,
    SelectOption,
    SelectVariant,
    TextInput,
    Toolbar,
    ToolbarContent,
    ToolbarFilter,
    ToolbarGroup,
    ToolbarItem,
    ToolbarToggleGroup,
} from '@patternfly/react-core'
import CloneIcon from '@patternfly/react-icons/dist/js/icons/clone-icon'
import EditIcon from '@patternfly/react-icons/dist/js/icons/edit-icon'
import FilterIcon from '@patternfly/react-icons/dist/js/icons/filter-icon'
import SearchIcon from '@patternfly/react-icons/dist/js/icons/search-icon'
import SyncIcon from '@patternfly/react-icons/dist/js/icons/sync-icon'
import { Meta } from '@storybook/react'
import React, { Fragment, useCallback, useMemo, useState } from 'react'
import EllipsisVIcon from '@patternfly/react-icons/dist/js/icons/ellipsis-v-icon'
import CaretDownIcon from '@patternfly/react-icons/dist/js/icons/caret-down-icon'
import { useMediaQuery } from '@material-ui/core'

const meta: Meta = {
    title: 'TableToolbar',
    // component: AcmAutoRefreshSelect,
    argTypes: {},
}
export default meta

export const TableToolbar = () => {
    const [selected, setSelected] = useState<string[]>([])
    const [selectIsOpen, setSelectIsOpen] = useState(false)

    const [statusIsExpanded, setStatusIsExpanded] = useState(false)
    const [statuses, setStatuses] = useState<string[]>(['New', 'Pending'])
    const onStatusToggle = useCallback(() => setStatusIsExpanded((expanded) => !expanded), [])
    const onStatusSelect = (event, selection) =>
        setStatuses((prevSelections) =>
            event.target.checked
                ? [...prevSelections, selection]
                : prevSelections.filter((value) => value !== selection)
        )

    const [riskIsExpanded, setRiskIsExpanded] = useState(false)
    const [risks, setRisks] = useState<string[]>(['Low'])
    const onRiskToggle = useCallback(() => setRiskIsExpanded((expanded) => !expanded), [])
    const onRiskSelect = (event, selection) =>
        setRisks((prevSelections) =>
            event.target.checked
                ? [...prevSelections, selection]
                : prevSelections.filter((value) => value !== selection)
        )

    const [inputValue, setInputValue] = useState('')
    const onInputChange = useCallback((value) => setInputValue(value), [])

    const [isExpanded, setIsExpanded] = useState(false)
    const toggleIsExpanded = useCallback(() => setIsExpanded((expanded) => !expanded), [])

    const [kebabIsOpen, setKebabIsOpen] = useState(false)
    const onKebabToggle = useCallback(() => setKebabIsOpen((open) => !open), [])

    const onDelete = useCallback(() => {}, [])

    const SelectionControl = () => (
        <Dropdown
            toggle={
                <DropdownToggle
                    splitButtonItems={[
                        <DropdownToggleCheckbox
                            id="1"
                            key="split-checkbox"
                            aria-label="Select all"
                            isChecked={selected.length > 0}
                            onChange={() => {
                                if (selected.length > 0) {
                                    setSelected([])
                                } else {
                                    setSelected(new Array(100).fill(''))
                                }
                            }}
                        >
                            {Object.keys(selected).length > 0 ? `${Object.keys(selected).length} selected` : ''}
                        </DropdownToggleCheckbox>,
                    ]}
                    onToggle={(isOpen) => setSelectIsOpen(isOpen)}
                />
            }
            isOpen={selectIsOpen}
            dropdownItems={[
                <DropdownItem
                    key="none"
                    onClick={() => {
                        setSelected([])
                        setSelectIsOpen(false)
                    }}
                >
                    Select none (0 items)
                </DropdownItem>,
                <DropdownItem
                    key="page"
                    onClick={() => {
                        setSelected(new Array(10).fill(''))
                        setSelectIsOpen(false)
                    }}
                >
                    Select page items
                </DropdownItem>,
                <DropdownItem
                    key="all"
                    onClick={() => {
                        setSelected(new Array(100).fill(''))
                        setSelectIsOpen(false)
                    }}
                >
                    Select all items
                </DropdownItem>,
            ]}
        />
    )
    const isXLarge = useMediaQuery('(min-width: 1400px)', { noSsr: true })

    return (
        <Fragment>
            <Toolbar
                id="toolbar-consumer-managed-toggle-groups"
                isExpanded={isExpanded}
                className="pf-m-toggle-group-container"
                toggleIsExpanded={toggleIsExpanded}
            >
                <ToolbarContent>
                    <ToolbarItem variant="bulk-select" hidden={!isXLarge}>
                        <SelectionControl />
                    </ToolbarItem>

                    <ToolbarToggleGroup toggleIcon={<FilterIcon />} breakpoint="md">
                        <ToolbarItem>
                            <InputGroup>
                                <TextInput
                                    name="textInput2"
                                    id="textInput2"
                                    type="search"
                                    aria-label="search input example"
                                    onChange={onInputChange}
                                    value={inputValue}
                                />
                                <Button variant={ButtonVariant.control} aria-label="search button for search input">
                                    <SearchIcon />
                                </Button>
                            </InputGroup>
                        </ToolbarItem>
                        <ToolbarGroup variant="filter-group">
                            <ToolbarFilter
                                chips={statuses}
                                //   deleteChip={this.onDelete}
                                //   deleteChipGroup={this.onDeleteGroup}
                                categoryName="Status"
                            >
                                <Select
                                    variant={SelectVariant.checkbox}
                                    aria-label="Status"
                                    onToggle={onStatusToggle}
                                    onSelect={onStatusSelect}
                                    selections={statuses}
                                    isOpen={statusIsExpanded}
                                    placeholderText="Status"
                                >
                                    {[
                                        <SelectOption key="statusNew" value="New" />,
                                        <SelectOption key="statusPending" value="Pending" />,
                                        <SelectOption key="statusRunning" value="Running" />,
                                        <SelectOption key="statusCancelled" value="Cancelled" />,
                                    ]}
                                </Select>
                            </ToolbarFilter>
                            <ToolbarFilter chips={risks} deleteChip={onDelete} categoryName="Risk">
                                <Select
                                    variant={SelectVariant.checkbox}
                                    aria-label="Risk"
                                    onToggle={onRiskToggle}
                                    onSelect={onRiskSelect}
                                    selections={risks}
                                    isOpen={riskIsExpanded}
                                    placeholderText="Risk"
                                >
                                    {[
                                        <SelectOption key="riskLow" value="Low" />,
                                        <SelectOption key="riskMedium" value="Medium" />,
                                        <SelectOption key="riskHigh" value="High" />,
                                    ]}
                                </Select>
                            </ToolbarFilter>
                        </ToolbarGroup>
                    </ToolbarToggleGroup>
                    {/* <ToolbarToggleGroup toggleIcon={<EllipsisVIcon />} breakpoint="lg">
                    <ToolbarItem>
                        <Button variant={selected.length > 0 ? 'secondary' : 'primary'}>Create</Button>
                    </ToolbarItem>
                    <ToolbarItem>
                        <Button variant={selected.length > 0 ? 'secondary' : 'primary'}>Import</Button>
                    </ToolbarItem>
                </ToolbarToggleGroup>
                <ToolbarItem variant="separator" />
                <ToolbarToggleGroup toggleIcon={<EllipsisVIcon />} breakpoint="lg">
                    <ToolbarItem>
                        <Button variant={selected.length > 0 ? 'primary' : 'secondary'}>Delete</Button>
                    </ToolbarItem>
                    <ToolbarItem>
                        <Button variant={selected.length > 0 ? 'primary' : 'secondary'}>Hibernate</Button>
                    </ToolbarItem>
                </ToolbarToggleGroup> */}
                    {/* <ToolbarItem>
                    <Dropdown
                        toggle={
                            <DropdownToggle
                                id="toggle-id"
                                toggleIndicator={CaretDownIcon}
                                isPrimary={selected.length !== 0}
                            >
                                Actions
                            </DropdownToggle>
                        }
                        dropdownItems={[]}
                    ></Dropdown>
                </ToolbarItem>
                <ToolbarItem variant="separator" />
                <ToolbarItem>
                    <Dropdown
                        toggle={
                            <DropdownToggle
                                id="toggle-id"
                                toggleIndicator={CaretDownIcon}
                                isPrimary={selected.length === 0}
                            >
                                Create cluster
                            </DropdownToggle>
                        }
                        dropdownItems={[]}
                    ></Dropdown>
                </ToolbarItem> */}
                    <ToolbarItem variant="overflow-menu">
                        <OverflowMenu breakpoint="lg">
                            <OverflowMenuContent>
                                <OverflowMenuGroup groupType="button">
                                    <OverflowMenuItem>
                                        <Button variant={ButtonVariant.primary}>Create</Button>
                                    </OverflowMenuItem>
                                    <OverflowMenuItem>
                                        <Button variant={ButtonVariant.secondary}>Import</Button>
                                    </OverflowMenuItem>
                                </OverflowMenuGroup>
                            </OverflowMenuContent>
                            <OverflowMenuControl hasAdditionalOptions>
                                <Dropdown
                                    toggle={<KebabToggle onToggle={onKebabToggle} />}
                                    isOpen={kebabIsOpen}
                                    isPlain
                                    dropdownItems={[
                                        <DropdownItem key="none">Create</DropdownItem>,
                                        <DropdownItem key="none">Import</DropdownItem>,
                                        <DropdownSeparator key="separator" />,
                                        <DropdownItem key="none">Delete</DropdownItem>,
                                        <DropdownItem key="none">Detach</DropdownItem>,
                                        <DropdownItem key="none">Hibernate</DropdownItem>,
                                    ]}
                                />
                            </OverflowMenuControl>
                        </OverflowMenu>
                    </ToolbarItem>
                    <ToolbarItem variant="pagination" hidden={!isXLarge}>
                        <Pagination
                            itemCount={37}
                            // perPage={this.state.perPage}
                            // page={this.state.page}
                            // onSetPage={this.onSetPage}
                            // widgetId="pagination-options-menu-top"
                            // onPerPageSelect={this.onPerPageSelect}
                        />
                    </ToolbarItem>
                </ToolbarContent>
            </Toolbar>
            {!isXLarge && (
                <Toolbar
                    id="toolbar2"
                    isExpanded={isXLarge}
                    className="pf-m-toggle-group-container"
                    toggleIsExpanded={toggleIsExpanded}
                >
                    <ToolbarContent>
                        <ToolbarItem variant="bulk-select">
                            <SelectionControl />
                        </ToolbarItem>

                        <ToolbarItem variant="pagination">
                            <Pagination
                                itemCount={37}
                                // perPage={this.state.perPage}
                                // page={this.state.page}
                                // onSetPage={this.onSetPage}
                                // widgetId="pagination-options-menu-top"
                                // onPerPageSelect={this.onPerPageSelect}
                            />
                        </ToolbarItem>
                    </ToolbarContent>
                </Toolbar>
            )}
        </Fragment>
    )
}

/* Copyright Contributors to the Open Cluster Management project */

import { ToggleGroup, ToggleGroupItem } from '@patternfly/react-core'
import { fitContent, IRow, SortByDirection, TableGridBreakpoint } from '@patternfly/react-table'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { configureAxe } from 'jest-axe'
import React, { useState } from 'react'
import { AcmTable, AcmTablePaginationContextProvider, AcmTableProps } from './AcmTable'
import { exampleData } from './AcmTable.stories'
const axe = configureAxe({
    rules: {
        'scope-attr-valid': { enabled: false },
        'landmark-unique': { enabled: false }, // Pagination is on the page twice... not sure how to fix
    },
})

interface IExampleData {
    uid: number
    firstName: string
    last_name: string
    gender: string
    email: string
    ip_address: string
}

describe('AcmTable', () => {
    const createAction = jest.fn()
    const bulkDeleteAction = jest.fn()
    const deleteAction = jest.fn()
    const sortFunction = jest.fn()
    const testItems = exampleData.slice(0, 105)
    const defaultSortedItems = exampleData.slice(0, 105).sort((a, b) => a.firstName.localeCompare(b.firstName))
    const placeholderString = 'Search'
    const Table = (
        props: {
            noBorders?: boolean
            useTableActions?: boolean
            useRowActions?: boolean
            useBulkActions?: boolean
            useExtraToolbarControls?: boolean
            searchPlaceholder?: string
            useSearch?: boolean
            transforms?: boolean
            groupFn?: (item: IExampleData) => string | null
            groupSummaryFn?: (items: IExampleData[]) => IRow
            gridBreakPoint?: TableGridBreakpoint
        } & Partial<AcmTableProps<IExampleData>>
    ) => {
        const {
            useTableActions = true,
            useRowActions = true,
            useBulkActions = false,
            useExtraToolbarControls = false,
            useSearch = true,
        } = props
        const [items, setItems] = useState<IExampleData[]>(testItems)
        return (
            <AcmTable<IExampleData>
                plural="addresses"
                items={items}
                columns={[
                    {
                        header: 'First Name',
                        sort: 'firstName',
                        cell: 'firstName',
                        search: useSearch ? 'firstName' : undefined,
                    },
                    {
                        header: 'Last Name',
                        sort: 'last_name',
                        cell: 'last_name',
                    },
                    {
                        header: 'EMail',
                        cell: 'email',
                        search: useSearch ? 'email' : undefined,
                    },
                    {
                        header: 'Gender',
                        sort: 'gender',
                        cell: (item) => item.gender,
                        search: useSearch ? 'gender' : undefined,
                    },
                    {
                        header: 'IP Address',
                        sort: sortFunction,
                        cell: 'ip_address',
                        search: useSearch ? (item) => item['ip_address'] : undefined,
                    },
                    {
                        header: 'UID',
                        sort: 'uid',
                        cell: 'uid',
                        search: useSearch ? 'uid' : undefined,
                        tooltip: 'Tooltip Example',
                        transforms: props.transforms ? [fitContent] : undefined,
                    },
                ]}
                keyFn={(item: IExampleData) => item.uid.toString()}
                tableActions={
                    useTableActions
                        ? [
                              {
                                  id: 'create',
                                  title: 'Create address',
                                  click: createAction,
                              },
                          ]
                        : undefined
                }
                rowActions={
                    useRowActions
                        ? [
                              {
                                  id: 'delete',
                                  title: 'Delete item',
                                  click: (item: IExampleData) => {
                                      deleteAction(item)
                                      setItems(items.filter((i) => i.uid !== item.uid))
                                  },
                              },
                              {
                                  id: 'deletedisabled',
                                  title: 'Disabled delete item',
                                  isDisabled: true,
                                  tooltip: 'This button is disabled',
                                  click: (item: IExampleData) => {
                                      deleteAction(item)
                                      setItems(items.filter((i) => i.uid !== item.uid))
                                  },
                              },
                              {
                                  id: 'deletetooltipped',
                                  title: 'Tooltipped delete item',
                                  isDisabled: false,
                                  tooltip: 'This button is not disabled',
                                  click: (item: IExampleData) => {
                                      deleteAction(item)
                                      setItems(items.filter((i) => i.uid !== item.uid))
                                  },
                              },
                              {
                                  id: 'disablednotooltip',
                                  title: 'Disabled item',
                                  isDisabled: true,
                                  click: (item: IExampleData) => {
                                      deleteAction(item)
                                      setItems(items.filter((i) => i.uid !== item.uid))
                                  },
                              },
                          ]
                        : undefined
                }
                bulkActions={
                    useBulkActions
                        ? [
                              {
                                  id: 'delete',
                                  title: 'Delete items',
                                  click: (items: IExampleData[]) => {
                                      setItems(items.filter((i) => !items.find((item) => item.uid === i.uid)))
                                      bulkDeleteAction(items)
                                  },
                              },
                          ]
                        : undefined
                }
                extraToolbarControls={
                    useExtraToolbarControls ? (
                        <ToggleGroup>
                            <ToggleGroupItem isSelected={true} text="View 1" />
                            <ToggleGroupItem text="View 2" />
                        </ToggleGroup>
                    ) : undefined
                }
                {...props}
            />
        )
    }
    test('renders', () => {
        const { container } = render(<Table />)
        expect(container.querySelector('table')).toBeInTheDocument()
    })
    test('renders without actions', () => {
        const { container } = render(<Table useTableActions={false} useRowActions={false} />)
        expect(container.querySelector('table')).toBeInTheDocument()
        expect(container.querySelector('table .pf-c-dropdown__toggle')).toBeNull()
    })
    test('renders actions given an actionResolver', () => {
        const tableActionResolver = (item: IExampleData) => {
            if (item.last_name.indexOf('a') > -1) {
                return [
                    {
                        id: 'testAction',
                        title: `${item.firstName} ${item.last_name} is the coolest!`,
                        addSeparator: true,
                        click: createAction,
                    },
                ]
            } else {
                return []
            }
        }
        const { container } = render(
            <Table useTableActions={false} useRowActions={false} rowActionResolver={tableActionResolver} />
        )
        expect(container.querySelector('table')).toBeInTheDocument()
        expect(container.querySelector('table .pf-c-dropdown__toggle')).toBeInTheDocument()
    })
    test('renders actions given an actionResolver with an expandable table', () => {
        const tableActionResolver = (item: IExampleData) => {
            if (item.last_name.indexOf('a') > -1) {
                return [
                    {
                        id: 'testAction',
                        title: `${item.firstName} ${item.last_name} is the coolest!`,
                        addSeparator: true,
                        click: createAction,
                    },
                ]
            } else {
                return []
            }
        }
        const { container } = render(
            <AcmTable<IExampleData>
                plural="addresses"
                showToolbar={false}
                items={exampleData.slice(0, 10)}
                addSubRows={(item: IExampleData) => {
                    if (item.uid === 1) {
                        return [
                            {
                                cells: [
                                    {
                                        title: <div id="expanded">{item.uid}</div>,
                                    },
                                ],
                            },
                        ]
                    } else {
                        return undefined
                    }
                }}
                columns={[
                    {
                        header: 'First Name',
                        sort: 'firstName',
                        cell: 'firstName',
                    },
                    {
                        header: 'Last Name',
                        sort: 'last_name',
                        cell: 'last_name',
                    },
                    {
                        header: 'EMail',
                        cell: 'email',
                    },
                    {
                        header: 'Gender',
                        sort: 'gender',
                        cell: (item) => item.gender,
                    },
                    {
                        header: 'IP Address',
                        sort: sortFunction,
                        cell: 'ip_address',
                    },
                    {
                        header: 'UID',
                        sort: 'uid',
                        cell: 'uid',
                    },
                ]}
                keyFn={(item: IExampleData) => item.uid.toString()}
                rowActionResolver={tableActionResolver}
            />
        )
        expect(container.querySelector('table')).toBeInTheDocument()
        expect(container.querySelector('table .pf-c-dropdown__toggle')).toBeInTheDocument()
    })
    test('renders pagination with autoHidePagination when more that perPage items', () => {
        const { container } = render(<Table items={exampleData} autoHidePagination />)
        expect(container.querySelector('.pf-c-pagination')).toBeInTheDocument()
    })
    test('hides pagination with autoHidePagination when less than perPage items', () => {
        const { container } = render(<Table items={exampleData.slice(0, 8)} autoHidePagination />)
        expect(container.querySelector('.pf-c-pagination')).toBeNull()
    })
    test('renders with transforms', () => {
        const { container } = render(<Table transforms={true} />)
        expect(container.querySelector('table')).toBeInTheDocument()
    })
    test('renders table with gridbreakpoint override', () => {
        const { container } = render(
            <Table items={exampleData.slice(0, 8)} gridBreakPoint={TableGridBreakpoint.none} />
        )
        expect(container.querySelector('.pf-c-pagination')).toBeInTheDocument()
        expect(container.querySelector('.pf-c-table__sort-indicator')).toBeInTheDocument()
    })
    test('renders table with pre-selected items', () => {
        const { getByText } = render(
            <Table
                items={exampleData.slice(0, 8)}
                initialSelectedItems={exampleData.slice(0, 1)}
                onSelect={() => null}
                gridBreakPoint={TableGridBreakpoint.none}
            />
        )
        expect(getByText('1 selected')).toBeInTheDocument()
    })
    test('can support table actions', () => {
        const { getByText } = render(<Table />)
        expect(getByText('Create address')).toBeVisible()
        expect(getByText('Create address')).toBeInstanceOf(HTMLButtonElement)
        userEvent.click(getByText('Create address'))
        expect(createAction).toHaveBeenCalled()
    })

    test('can support bulk table actions with single selection', () => {
        const { getByText, getAllByRole, queryAllByText } = render(
            <Table useBulkActions={true} useTableActions={false} />
        )
        userEvent.click(getAllByRole('checkbox')[1])
        expect(getByText('1 selected')).toBeInTheDocument()
        userEvent.click(getAllByRole('checkbox')[1])
        expect(queryAllByText('1 selected')).toHaveLength(0)
        userEvent.click(getAllByRole('checkbox')[1])
        expect(getByText('1 selected')).toBeInTheDocument()
        getByText('Actions').click()
        userEvent.click(getByText('Delete items'))
        expect(bulkDeleteAction).toHaveBeenCalledWith(defaultSortedItems.slice(0, 1))
    })

    test('can support bulk table actions with multiple selection', () => {
        const { getByText, getAllByRole, queryAllByText } = render(
            <Table useBulkActions={true} useTableActions={false} />
        )
        userEvent.click(getAllByRole('checkbox')[0])
        expect(getByText('105 selected')).toBeInTheDocument()
        userEvent.click(getAllByRole('checkbox')[1])
        expect(getByText('104 selected')).toBeInTheDocument()
        userEvent.click(getAllByRole('checkbox')[0])
        expect(getByText('105 selected')).toBeInTheDocument()
        userEvent.click(getAllByRole('checkbox')[0])
        expect(queryAllByText('selected')).toHaveLength(0)
        userEvent.click(getAllByRole('checkbox')[1])
        userEvent.click(getAllByRole('checkbox')[2])
        expect(getByText('2 selected')).toBeInTheDocument()
        getByText('Actions').click()
        userEvent.click(getByText('Delete items'))
        // First arg to bulkDeleteAction is an array with the items in any order
        expect(bulkDeleteAction.mock.calls[0][0]).toHaveLength(2)
        expect(bulkDeleteAction.mock.calls[0][0]).toContain(defaultSortedItems[0])
        expect(bulkDeleteAction.mock.calls[0][0]).toContain(defaultSortedItems[1])
    })

    test('can support table row actions', () => {
        const { getAllByLabelText, getByRole, getByText } = render(<Table />)
        expect(getAllByLabelText('Actions')).toHaveLength(10)
        userEvent.click(getAllByLabelText('Actions')[0])
        expect(getByRole('menu')).toBeVisible()
        expect(getByText('Delete item')).toBeVisible()
        userEvent.click(getByText('Delete item'))
        expect(deleteAction).toHaveBeenCalled()
    })
    test('can support table row actions', () => {
        const { getAllByLabelText, getByRole, getByText } = render(<Table />)
        expect(getAllByLabelText('Actions')).toHaveLength(10)
        userEvent.click(getAllByLabelText('Actions')[0])
        expect(getByRole('menu')).toBeVisible()
        expect(getByText('Delete item')).toBeVisible()
        userEvent.click(getByText('Delete item'))
        expect(deleteAction).toHaveBeenCalled()
    })
    test('can support disabled table row actions', () => {
        const { getAllByLabelText, getByRole, getByText } = render(<Table />)
        expect(getAllByLabelText('Actions')).toHaveLength(10)
        userEvent.click(getAllByLabelText('Actions')[0])
        expect(getByRole('menu')).toBeVisible()
        expect(getByText('Disabled item')).toBeVisible()
        userEvent.click(getByText('Disabled item'))
        expect(deleteAction).not.toHaveBeenCalled()
    })
    test('can support disabled table row actions with tooltips', () => {
        const { getAllByLabelText, getByRole, getByText } = render(<Table />)
        expect(getAllByLabelText('Actions')).toHaveLength(10)
        userEvent.click(getAllByLabelText('Actions')[1])
        expect(getByRole('menu')).toBeVisible()
        expect(getByText('Disabled delete item')).toBeVisible()
        userEvent.click(getByText('Disabled delete item'))
        expect(deleteAction).not.toHaveBeenCalled()
    })
    test('can support table row actions with tooltips', () => {
        const { getAllByLabelText, getByRole, getByText } = render(<Table />)
        expect(getAllByLabelText('Actions')).toHaveLength(10)
        userEvent.click(getAllByLabelText('Actions')[0])
        expect(getByRole('menu')).toBeVisible()
        expect(getByText('Tooltipped delete item')).toBeVisible()
        userEvent.click(getByText('Tooltipped delete item'))
        expect(deleteAction).toHaveBeenCalled()
    })
    test('can customize search placeholder', () => {
        const customPlaceholder = 'Other placeholder'
        const { container } = render(<Table searchPlaceholder={customPlaceholder} />)
        expect(container.querySelector('div.pf-c-toolbar input.pf-c-search-input__text-input')).toHaveAttribute(
            'placeholder',
            customPlaceholder
        )
    })
    test('can be searched', () => {
        const { getByPlaceholderText, queryByText, getByLabelText, getByText, container } = render(<Table />)

        // verify manually deleting search, resets table with first column sorting
        userEvent.type(getByPlaceholderText(placeholderString), 'B{backspace}')
        expect(container.querySelector('tbody tr:first-of-type [data-label="First Name"]')).toHaveTextContent('Abran')

        // sort by non-default column (UID)
        userEvent.click(getByText('UID'))
        expect(container.querySelector('tbody tr:first-of-type [data-label="UID"]')).toHaveTextContent('1')

        // search for 'Female'
        expect(getByPlaceholderText(placeholderString)).toBeInTheDocument()
        userEvent.type(getByPlaceholderText(placeholderString), 'Female')
        expect(queryByText('57 / 105')).toBeVisible()

        // clear filter
        expect(getByLabelText('Reset')).toBeVisible()
        userEvent.click(getByLabelText('Reset'))
        expect(queryByText('57 / 105')).toBeNull()

        // verify previous sort column (UID) maintained
        expect(container.querySelector('tbody tr:first-of-type [data-label="UID"]')).toHaveTextContent('1')

        // search for '.org'
        expect(getByPlaceholderText(placeholderString)).toBeInTheDocument()
        userEvent.type(getByPlaceholderText(placeholderString), '.org')
        expect(queryByText('8 / 105')).toBeVisible()

        // verify last sort order ignored
        expect(container.querySelector('tbody tr:first-of-type [data-label="UID"]')).toHaveTextContent('8')

        // change sort during filter (Last Name)
        userEvent.click(getByText('Last Name'))
        expect(container.querySelector('tbody tr:first-of-type [data-label="Last Name"]')).toHaveTextContent('Barnham')

        // clear filter
        expect(getByLabelText('Reset')).toBeVisible()
        userEvent.click(getByLabelText('Reset'))
        expect(queryByText('7 / 105')).toBeNull()

        // verify sort order set during filter (Last Name) persists
        expect(container.querySelector('tbody tr:first-of-type [data-label="Last Name"]')).toHaveTextContent('Arthur')
    })

    const sortTest = (useBulkActions: boolean) => {
        const { getByText, container } = render(<Table useBulkActions={useBulkActions} />)

        // sort by string
        expect(container.querySelector('tbody tr:first-of-type [data-label="First Name"]')).toHaveTextContent('Abran')
        userEvent.click(getByText('Gender'))
        expect(container.querySelector('tbody tr:first-of-type [data-label="Gender"]')).toHaveTextContent('Female')
        userEvent.click(getByText('Gender'))
        expect(container.querySelector('tbody tr:first-of-type [data-label="Gender"]')).toHaveTextContent('Non-binary')
        // sort by number
        userEvent.click(getByText('UID'))
        expect(container.querySelector('tbody tr:first-of-type [data-label="First Name"]')).toHaveTextContent('Bogart')
        userEvent.click(getByText('UID'))
        expect(container.querySelector('tbody tr:first-of-type [data-label="First Name"]')).toHaveTextContent('Leroy')

        // sort with function
        userEvent.click(getByText('IP Address'))
        expect(sortFunction).toHaveBeenCalled()
    }

    test('can be sorted', () => {
        sortTest(false)
    })
    test('can be sorted with bulk actions', () => {
        sortTest(true)
    })
    test('can be sorted by initialSort property', () => {
        // initially sort by UID
        const { getByText, container } = render(<Table initialSort={{ direction: 'asc', index: 5 }} />)
        expect(container.querySelector('tbody tr:first-of-type [data-label="UID"]')).toHaveTextContent('1')

        // verify clicking UID switches the direction
        userEvent.click(getByText('UID'))
        expect(container.querySelector('tbody tr:first-of-type [data-label="UID"]')).toHaveTextContent('105')

        // verify clicking on other headers still works
        userEvent.click(getByText('First Name'))
        expect(container.querySelector('tbody tr:first-of-type [data-label="First Name"]')).toHaveTextContent('Abran')
    })
    test('page size can be updated', () => {
        const { getByLabelText, getAllByLabelText, getByText, container } = render(
            <Table useExtraToolbarControls={false} useSearch={false} useTableActions={false} />
        )

        expect(container.querySelectorAll('tbody tr')).toHaveLength(10)
        expect(getAllByLabelText('Items per page').length).toBeGreaterThan(0)

        // Switch to 50 items per page
        userEvent.click(getAllByLabelText('Items per page')[0])
        expect(getByText('50 per page')).toBeVisible()
        userEvent.click(getByText('50 per page'))
        expect(container.querySelectorAll('tbody tr')).toHaveLength(50)

        // Go to page 2
        userEvent.click(getAllByLabelText('Go to next page')[0])
        expect(getAllByLabelText('Current page')[0]).toHaveValue(2)

        // Switch to 10 items per page; verify automatic move to page 6
        userEvent.click(getAllByLabelText('Items per page')[0])
        expect(getByText('10 per page')).toBeVisible()
        userEvent.click(getByText('10 per page'))
        expect(container.querySelectorAll('tbody tr')).toHaveLength(10)
        expect(getByLabelText('Current page')).toHaveValue(6)
    })
    test('can show paginated results', () => {
        const { getAllByLabelText } = render(<Table />)
        expect(getAllByLabelText('Go to next page').length).toBeGreaterThan(0)
        userEvent.click(getAllByLabelText('Go to next page')[0])
        expect(getAllByLabelText('Current page')[0]).toHaveValue(2)
    })
    test('should show the empty state when filtered results', () => {
        const { getByPlaceholderText, queryByText, getByText } = render(<Table />)
        expect(queryByText('No results found')).toBeNull()
        expect(getByPlaceholderText(placeholderString)).toBeInTheDocument()
        userEvent.type(getByPlaceholderText(placeholderString), 'NOSEARCHRESULTS')
        expect(queryByText('No results found')).toBeVisible()
        getByText('Clear all filters').click()
        expect(queryByText('No results found')).toBeNull()
    })
    test('can provide ouia attributes on table rows', () => {
        const { container } = render(<Table />)
        expect(
            container.querySelector(
                '[data-ouia-component-type="PF4/TableRow"][data-ouia-component-id="25"] [data-label="First Name"]'
            )
        ).toHaveTextContent('Arabela')
    })
    test('can use saved pagination', () => {
        const { getAllByLabelText, getByText, container } = render(
            <AcmTablePaginationContextProvider localStorageKey="my-table">
                <Table />
                <Table />
            </AcmTablePaginationContextProvider>
        )
        // set pagination on first table
        userEvent.click(getAllByLabelText('Items per page')[0])
        expect(getByText('100 per page')).toBeVisible()
        userEvent.click(getByText('100 per page'))
        // verify pagination changes on both tables
        expect(container.querySelectorAll('tbody tr')).toHaveLength(200)
    })
    test('has zero accessibility defects', async () => {
        const { container } = render(<Table />)
        expect(await axe(container)).toHaveNoViolations()
    })
    test('can provide default empty state', () => {
        const { queryByText } = render(<Table items={[]} />)
        expect(queryByText('No addresses found')).toBeVisible()
    })
    test('can use custom empty state', () => {
        const { queryByText } = render(<Table items={[]} emptyState={<div>Look elsewhere!</div>} />)
        expect(queryByText('Look elsewhere!')).toBeVisible()
    })
    test('can render as a controlled component', () => {
        const setPage = jest.fn()
        const setSearch = jest.fn()
        const setSort = jest.fn()
        const { container, getByLabelText, getByText } = render(
            <Table
                page={15}
                setPage={setPage}
                search="Female"
                setSearch={setSearch}
                sort={{ index: 0, direction: SortByDirection.desc }} // sort by Name
                setSort={setSort}
            />
        )
        expect(setPage).toHaveBeenCalled() // Only 6 pages; should automatically go back
        expect(getByLabelText('Current page')).toHaveValue(6)
        expect(setSearch).not.toHaveBeenCalled()
        expect(setSort).not.toHaveBeenCalled()
        expect(container.querySelector('tbody tr:last-of-type [data-label="First Name"]')).toHaveTextContent('Alyce')

        expect(getByLabelText('Reset')).toBeVisible()
        userEvent.click(getByLabelText('Reset'))
        expect(setSearch).toHaveBeenCalled()
        expect(setPage).toHaveBeenCalled()
        expect(setSort).toHaveBeenCalled()

        userEvent.click(getByText('UID'))
        expect(setSort).toHaveBeenCalledTimes(2)
    })
    test('shows loading', () => {
        const { queryByText } = render(<Table items={undefined} useExtraToolbarControls={true} />)
        expect(queryByText('Loading')).toBeVisible()
        expect(queryByText('View 1')).toBeVisible()
    })
    test('can have sort updated when all items filtered', () => {
        const { getByPlaceholderText, queryByText, getByLabelText, getByText, container } = render(<Table />)

        // search for 'ABSOLUTELYZEROMATCHES'
        expect(getByPlaceholderText(placeholderString)).toBeInTheDocument()
        userEvent.type(getByPlaceholderText(placeholderString), 'ABSOLUTELYZEROMATCHES')
        expect(queryByText('0 / 105')).toBeVisible()

        // change sort during filter (Last Name)
        userEvent.click(getByText('Last Name'))

        // clear filter
        expect(getByLabelText('Reset')).toBeVisible()
        userEvent.click(getByLabelText('Reset'))
        expect(queryByText('0 / 105')).toBeNull()

        // verify sort selection sticks
        expect(container.querySelector('tbody tr:first-of-type [data-label="Last Name"]')).toHaveTextContent('Arthur')
    })
    test('renders a table with expandable rows', () => {
        const expandedDeleteAction = jest.fn()
        const { getAllByLabelText, getByRole, getByTestId, getByText } = render(
            <AcmTable<IExampleData>
                plural="addresses"
                showToolbar={false}
                items={exampleData.slice(0, 10)}
                addSubRows={(item: IExampleData) => {
                    if (item.uid === 1) {
                        return [
                            {
                                cells: [
                                    {
                                        title: <div id="expanded">{item.uid}</div>,
                                    },
                                ],
                            },
                        ]
                    } else {
                        return undefined
                    }
                }}
                columns={[
                    {
                        header: 'First Name',
                        sort: 'firstName',
                        cell: 'firstName',
                    },
                    {
                        header: 'Last Name',
                        sort: 'last_name',
                        cell: 'last_name',
                    },
                    {
                        header: 'EMail',
                        cell: 'email',
                    },
                    {
                        header: 'Gender',
                        sort: 'gender',
                        cell: (item) => item.gender,
                    },
                    {
                        header: 'IP Address',
                        sort: sortFunction,
                        cell: 'ip_address',
                    },
                    {
                        header: 'UID',
                        sort: 'uid',
                        cell: 'uid',
                    },
                ]}
                keyFn={(item: IExampleData) => item.uid.toString()}
                rowActions={[
                    {
                        id: 'delete',
                        title: 'Delete item',
                        click: () => {
                            expandedDeleteAction()
                        },
                    },
                    {
                        id: 'deleteTT',
                        title: 'Delete item tooltip',
                        tooltip: 'delete',
                        click: () => {
                            expandedDeleteAction()
                        },
                    },
                ]}
                fuseThreshold={0}
            />
        )
        userEvent.click(getByTestId('expandable-toggle0'))
        expect(getByTestId('expanded')).toBeInTheDocument()

        // Run delete action for code coverage (no delete support on expanded content)
        userEvent.click(getAllByLabelText('Actions')[1])
        expect(getByRole('menu')).toBeVisible()
        expect(getByText('Delete item')).toBeVisible()
        userEvent.click(getByText('Delete item'))
        expect(expandedDeleteAction).not.toHaveBeenCalled()

        // Run tooltipped delete action for code coverage (no delete support on expanded content)
        userEvent.click(getAllByLabelText('Actions')[1])
        expect(getByRole('menu')).toBeVisible()
        expect(getByText('Delete item tooltip')).toBeVisible()
        userEvent.click(getByText('Delete item tooltip'))
        expect(expandedDeleteAction).not.toHaveBeenCalled()
    })
    test('renders with grouping', () => {
        const { getAllByLabelText, getByPlaceholderText, getByRole, getByTestId, getByText } = render(
            // Group some items by name, some by gender, and some not at all to test single-item groups,
            // multiple-item groups, and ungrouped items
            <Table groupFn={(item) => (item.uid < 25 ? item.firstName : item.uid < 50 ? null : item.gender)} />
        )
        userEvent.click(getByTestId('expandable-toggle0'))
        // search for 'Male'
        expect(getByPlaceholderText(placeholderString)).toBeInTheDocument()
        userEvent.type(getByPlaceholderText(placeholderString), 'Male')

        // Run delete action for code coverage
        userEvent.click(getAllByLabelText('Actions')[0])
        expect(getByRole('menu')).toBeVisible()
        expect(getByText('Delete item')).toBeVisible()
        userEvent.click(getByText('Delete item'))
    })
    test('renders with grouping', () => {
        const { getAllByLabelText, getByPlaceholderText, getByRole, getByTestId, getByText } = render(
            // Group some items by name, some by gender, and some not at all to test single-item groups,
            // multiple-item groups, and ungrouped items
            <Table groupFn={(item) => (item.uid < 25 ? item.firstName : item.uid < 50 ? null : item.gender)} />
        )
        userEvent.click(getByTestId('expandable-toggle0'))
        // search for 'Female'
        expect(getByPlaceholderText(placeholderString)).toBeInTheDocument()
        userEvent.type(getByPlaceholderText(placeholderString), 'Female')

        // Run tooltipped action for code coverage
        userEvent.click(getAllByLabelText('Actions')[2])
        expect(getByRole('menu')).toBeVisible()
        expect(getByText('Tooltipped delete item')).toBeVisible()
        userEvent.click(getByText('Tooltipped delete item'))
        expect(deleteAction).toHaveBeenCalled()
    })
    test('renders with grouping and summary', () => {
        const { getByTestId } = render(
            // Group some items by name, some by gender, and some not at all to test single-item groups,
            // multiple-item groups, and ungrouped items
            <Table
                noBorders
                groupFn={(item) => (item.uid < 25 ? item.firstName : item.uid < 50 ? null : item.gender)}
                groupSummaryFn={(items) => {
                    return { cells: [{ title: `${items.length} items`, props: { colSpan: 8 } }] }
                }}
            />
        )
        userEvent.click(getByTestId('expandable-toggle0'))
    })
})

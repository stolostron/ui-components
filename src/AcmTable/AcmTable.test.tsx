/* Copyright Contributors to the Open Cluster Management project */

import { ToggleGroup, ToggleGroupItem } from '@patternfly/react-core'
import { fitContent, SortByDirection, TableGridBreakpoint } from '@patternfly/react-table'
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
    const Table = (
        props: {
            useTableActions?: boolean
            useRowActions?: boolean
            useBulkActions?: boolean
            transforms?: boolean
            gridBreakPoint?: TableGridBreakpoint
        } & Partial<AcmTableProps<IExampleData>>
    ) => {
        const { useTableActions = true, useRowActions = true, useBulkActions = false } = props
        const [items, setItems] = useState<IExampleData[]>(testItems)
        return (
            <AcmTable<IExampleData>
                plural="addresses"
                items={items}
                onSelect={() => null}
                columns={[
                    {
                        header: 'First Name',
                        sort: 'firstName',
                        cell: 'firstName',
                        search: 'firstName',
                    },
                    {
                        header: 'Last Name',
                        sort: 'last_name',
                        cell: 'last_name',
                    },
                    {
                        header: 'EMail',
                        cell: 'email',
                        search: 'email',
                    },
                    {
                        header: 'Gender',
                        sort: 'gender',
                        cell: (item) => item.gender,
                        search: 'gender',
                    },
                    {
                        header: 'IP Address',
                        sort: sortFunction,
                        cell: 'ip_address',
                        search: (item) => item['ip_address'],
                    },
                    {
                        header: 'UID',
                        sort: 'uid',
                        cell: 'uid',
                        search: 'uid',
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
                                      deleteAction()
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
                                      bulkDeleteAction()
                                  },
                              },
                          ]
                        : undefined
                }
                extraToolbarControls={
                    <ToggleGroup>
                        <ToggleGroupItem isSelected={true} text="View 1" />
                        <ToggleGroupItem text="View 2" />
                    </ToggleGroup>
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
    test('can support table actions', () => {
        const { getByText } = render(<Table />)
        expect(getByText('Create address')).toBeVisible()
        expect(getByText('Create address')).toBeInstanceOf(HTMLButtonElement)
        userEvent.click(getByText('Create address'))
        expect(createAction).toHaveBeenCalled()
    })
    test('can support bulk table actions with select all', () => {
        const { getByLabelText, getByText, getAllByRole, queryAllByText, container } = render(
            <Table useBulkActions={true} />
        )

        userEvent.click(getByLabelText('Select'))
        userEvent.click(container.querySelectorAll('.pf-c-dropdown__menu-item')[1]) // Select page
        expect(getByText('10 selected')).toBeInTheDocument()

        userEvent.click(getByLabelText('Select'))
        userEvent.click(container.querySelectorAll('.pf-c-dropdown__menu-item')[2]) // Select all
        expect(getByText('105 selected')).toBeInTheDocument()

        userEvent.click(getByLabelText('Select'))
        userEvent.click(container.querySelectorAll('.pf-c-dropdown__menu-item')[0]) // Select None
        expect(queryAllByText('105 selected')).toHaveLength(0)

        userEvent.click(getAllByRole('checkbox')[0]) // Select all by checkbox
        expect(getByText('105 selected')).toBeInTheDocument()

        userEvent.click(getAllByRole('checkbox')[0]) // Select none by checkbox
        expect(queryAllByText('105 selected')).toHaveLength(0)

        userEvent.click(getAllByRole('checkbox')[0]) // Select all by checkbox
        expect(getByText('105 selected')).toBeInTheDocument()

        userEvent.click(getByText('Delete items'))
        expect(bulkDeleteAction).toHaveBeenCalled()
    })
    test('can support bulk table actions with single selection', () => {
        const { queryByText, getAllByRole, getByLabelText, container } = render(<Table useBulkActions={true} />)
        expect((queryByText('Delete items') as HTMLInputElement).getAttribute('aria-disabled')).toEqual('true')
        userEvent.click(getAllByRole('checkbox')[1])
        expect((queryByText('Delete items') as HTMLInputElement).getAttribute('aria-disabled')).not.toEqual('true')
        userEvent.click(getAllByRole('checkbox')[1])
        expect((queryByText('Delete items') as HTMLInputElement).getAttribute('aria-disabled')).toEqual('true')
        userEvent.click(getAllByRole('checkbox')[1])
        expect((queryByText('Delete items') as HTMLInputElement).getAttribute('aria-disabled')).not.toEqual('true')
        userEvent.click(getByLabelText('Select'))
        userEvent.click(container.querySelectorAll('.pf-c-dropdown__menu-item')[2])
        expect((queryByText('Delete items') as HTMLInputElement).getAttribute('aria-disabled')).not.toEqual('true')
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
    test('can be searched', () => {
        const { getByPlaceholderText, queryByText, getByLabelText, getByText, container } = render(<Table />)

        // verify manually deleting search, resets table with first column sorting
        userEvent.type(getByPlaceholderText('Search'), 'B{backspace}')
        expect(container.querySelector('tbody tr:first-of-type [data-label="First Name"]')).toHaveTextContent('Abran')

        // sort by non-default column (UID)
        userEvent.click(getByText('UID'))
        expect(container.querySelector('tbody tr:first-of-type [data-label="UID"]')).toHaveTextContent('1')

        // search for 'Female'
        expect(getByPlaceholderText('Search')).toBeInTheDocument()
        userEvent.type(getByPlaceholderText('Search'), 'Female')
        expect(queryByText('57 / 105')).toBeVisible()

        // clear filter
        expect(getByLabelText('Reset')).toBeVisible()
        userEvent.click(getByLabelText('Reset'))
        expect(queryByText('57 / 105')).toBeNull()

        // verify previous sort column (UID) maintained
        expect(container.querySelector('tbody tr:first-of-type [data-label="UID"]')).toHaveTextContent('1')

        // search for '.org'
        expect(getByPlaceholderText('Search')).toBeInTheDocument()
        userEvent.type(getByPlaceholderText('Search'), '.org')
        expect(queryByText('7 / 105')).toBeVisible()

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
    test('page size can be updated', () => {
        const { getByLabelText, getAllByLabelText, getByText, container } = render(<Table />)

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
        expect(getByPlaceholderText('Search')).toBeInTheDocument()
        userEvent.type(getByPlaceholderText('Search'), 'NOSEARCHRESULTS')
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
                search="Male"
                setSearch={setSearch}
                sort={{ index: 4, direction: SortByDirection.desc }} // sort by IP Address
                setSort={setSort}
            />
        )
        expect(setPage).toHaveBeenCalled() // Only 11 pages; should automatically go back
        expect(getByLabelText('Current page')).toHaveValue(11)
        expect(setSearch).not.toHaveBeenCalled()
        expect(setSort).not.toHaveBeenCalled()
        expect(container.querySelector('tbody tr:last-of-type [data-label="First Name"]')).toHaveTextContent('Danny')

        expect(getByLabelText('Reset')).toBeVisible()
        userEvent.click(getByLabelText('Reset'))
        expect(setSearch).toHaveBeenCalled()
        expect(setPage).toHaveBeenCalled()
        expect(setSort).toHaveBeenCalled()

        userEvent.click(getByText('UID'))
        expect(setSort).toHaveBeenCalledTimes(2)
    })
    test('shows loading', () => {
        const { queryByText } = render(<Table items={undefined} />)
        expect(queryByText('Loading')).toBeVisible()
    })
    test('can have sort updated when all items filtered', () => {
        const { getByPlaceholderText, queryByText, getByLabelText, getByText, container } = render(<Table />)

        // search for 'ABSOLUTELYZEROMATCHES'
        expect(getByPlaceholderText('Search')).toBeInTheDocument()
        userEvent.type(getByPlaceholderText('Search'), 'ABSOLUTELYZEROMATCHES')
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
})

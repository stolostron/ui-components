import { ToggleGroup, ToggleGroupItem } from '@patternfly/react-core'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import React, { useState } from 'react'
import { AcmTable } from './AcmTable'
import { exampleData } from './AcmTable.stories'

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
    const Table = ({ bulkActions = false }) => {
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
                    },
                ]}
                keyFn={(item: IExampleData) => item.uid.toString()}
                tableActions={[
                    {
                        id: 'create',
                        title: 'Create address',
                        click: createAction,
                    },
                ]}
                rowActions={[
                    {
                        id: 'delete',
                        title: 'Delete item',
                        click: (item: IExampleData) => {
                            deleteAction()
                            setItems(items.filter((i) => i.uid !== item.uid))
                        },
                    },
                ]}
                bulkActions={
                    bulkActions
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
                        : []
                }
                extraToolbarControls={
                    <ToggleGroup>
                        <ToggleGroupItem isSelected={true} text="View 1" />
                        <ToggleGroupItem text="View 2" />
                    </ToggleGroup>
                }
            />
        )
    }
    test('renders', () => {
        const { container } = render(<Table />)
        expect(container.querySelector('table')).toBeInTheDocument()
    })
    test('can support table actions', () => {
        const { getByText } = render(<Table />)
        expect(getByText('Create address')).toBeVisible()
        expect(getByText('Create address')).toBeInstanceOf(HTMLButtonElement)
        userEvent.click(getByText('Create address'))
        expect(createAction).toHaveBeenCalled()
    })
    test('can support bulk table actions with select all', () => {
        const { getByLabelText, queryByText, getByText } = render(<Table bulkActions={true} />)
        expect(getByLabelText('Select all rows')).toBeVisible()
        userEvent.click(getByLabelText('Select all rows'))
        expect(queryByText('Delete items')).toBeVisible()
        userEvent.click(getByText('Delete items'))
        expect(bulkDeleteAction).toHaveBeenCalled()
    })
    test('can support bulk table actions with single selection', () => {
        const { queryByText, getAllByRole, getByLabelText } = render(<Table bulkActions={true} />)
        expect(queryByText('Delete items')).toBeNull()
        expect(getAllByRole('checkbox')[1]).toBeVisible()
        userEvent.click(getAllByRole('checkbox')[1])
        expect(queryByText('Delete items')).toBeVisible()
        userEvent.click(getAllByRole('checkbox')[1])
        expect(queryByText('Delete items')).toBeNull()
        userEvent.click(getAllByRole('checkbox')[1])
        expect(queryByText('Delete items')).toBeVisible()
        userEvent.click(getByLabelText('Select all rows'))
        expect(queryByText('Delete items')).toBeVisible()
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
        const { getByPlaceholderText, queryByText, getByLabelText, container } = render(<Table />)
        expect(getByPlaceholderText('Search')).toBeInTheDocument()
        userEvent.type(getByPlaceholderText('Search'), 'Female')
        expect(queryByText('58 / 105')).toBeVisible()

        // clear table
        expect(getByLabelText('Clear')).toBeVisible()
        userEvent.click(getByLabelText('Clear'))
        expect(queryByText('58 / 105')).toBeNull()

        // verify manually deleting search, resets table with first column sorting
        userEvent.type(getByPlaceholderText('Search'), 'A{backspace}')
        expect(container.querySelector('tbody tr:first-of-type [data-label="First Name"]')).toHaveTextContent('Abran')
    })

    const sortTest = (bulkActions: boolean) => {
        const { getByText, container } = render(<Table bulkActions={bulkActions} />)

        // sort by string
        expect(container.querySelector('tbody tr:first-of-type [data-label="First Name"]')).toHaveTextContent('Abran')
        userEvent.click(getByText('First Name'))
        expect(container.querySelector('tbody tr:first-of-type [data-label="First Name"]')).toHaveTextContent('Ysabel')

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
        const { getByLabelText, getByText, container } = render(<Table />)

        expect(container.querySelectorAll('tbody tr')).toHaveLength(10)
        expect(getByLabelText('Items per page')).toBeVisible()

        userEvent.click(getByLabelText('Items per page'))
        expect(getByText('100 per page')).toBeVisible()
        userEvent.click(getByText('100 per page'))
        expect(container.querySelectorAll('tbody tr')).toHaveLength(100)
    })
    test('can show paginated results', () => {
        const { getByLabelText } = render(<Table />)
        expect(getByLabelText('Go to next page')).toBeVisible()
        userEvent.click(getByLabelText('Go to next page'))
        expect(getByLabelText('Current page')).toHaveValue(2)
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
    test('has zero accessibility defects', async () => {
        const { container } = render(<Table />)
        expect(await axe(container)).toHaveNoViolations()
    })
})

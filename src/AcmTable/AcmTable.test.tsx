import React from 'react'
import { render } from '@testing-library/react'
import { AcmTable } from './AcmTable'

interface IExampleData {
    id: number
    firstName: string
    last_name: string
    email: string
}

const items: IExampleData[] = [
    {
        id: 1,
        firstName: 'Bogart',
        last_name: 'Shmyr',
        email: 'bshmyr0@google.nl',
    },
    {
        id: 2,
        firstName: 'Horatia',
        last_name: 'Pottell',
        email: 'hpottell1@goo.ne.jp',
    },
]

describe('AcmTable', () => {
    test('renders', () => {
        const { container } = render(
            <AcmTable<IExampleData>
                plural="examples"
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
                        search: 'last_name',
                    },
                    {
                        header: 'EMail',
                        sort: 'email',
                        cell: 'email',
                        search: 'email',
                    },
                ]}
                keyFn={(item: IExampleData) => item.id.toString()}
                tableActions={[
                    {
                        id: 'delete',
                        title: 'Create address',
                        click: () => {
                            alert('Not implemented')
                        },
                    },
                ]}
                rowActions={[
                    {
                        id: 'delete',
                        title: 'Delete item',
                        click: () => null,
                    },
                ]}
                bulkActions={[
                    {
                        id: 'delete',
                        title: 'Delete items',
                        click: () => null,
                    },
                ]}
            />
        )
        expect(container.querySelector('table')).toBeInTheDocument()
    })
})

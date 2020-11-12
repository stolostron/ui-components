import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import React from 'react'
import { AcmSearchbar } from './AcmSearchbar'

describe('AcmSearchbar', () => {
    const LoadingSuggestionsSearchbar = () => (
        <AcmSearchbar
            loadingSuggestions={true}
            queryString={'kind:'}
            suggestions={[]}
            currentQueryCallback={(query: string) => query}
            toggleInfoModal={() => null}
        />
    )
    const BlankSearchbar = () => (
        <AcmSearchbar
            loadingSuggestions={false}
            queryString={''}
            suggestions={[
                { id: '1', name: 'Filters', kind: 'label', disabled: true },
                { id: '2', name: 'kind', kind: 'filter' },
                { id: '3', name: 'name', kind: 'filter' },
                { id: '4', name: 'namespace', kind: 'filter' },
                { id: '5', name: 'name1', kind: 'value' },
                { id: '6', name: 'name2', kind: 'value' },
                { id: '7', name: 'namespace1', kind: 'value' },
                { id: '8', name: 'namespace2', kind: 'value' },
            ]}
            currentQueryCallback={(query: string) => query}
            toggleInfoModal={() => null}
        />
    )
    const PrefilledSearchbar = () => (
        <AcmSearchbar
            loadingSuggestions={false}
            queryString={'kind:pod,deployment namespace:default'}
            suggestions={[
                { id: '1', name: 'Filters', kind: 'label', disabled: true },
                { id: '2', name: 'kind', kind: 'filter' },
                { id: '3', name: 'name', kind: 'filter' },
                { id: '4', name: 'namespace', kind: 'filter' },
                { id: '5', name: 'name1', kind: 'value' },
                { id: '6', name: 'name2', kind: 'value' },
                { id: '7', name: 'namespace1', kind: 'value' },
                { id: '8', name: 'namespace2', kind: 'value' },
            ]}
            currentQueryCallback={(query: string) => query}
            toggleInfoModal={() => null}
        />
    )

    test('has zero accessibility defects', async () => {
        const { container } = render(<BlankSearchbar />)
        expect(await axe(container)).toHaveNoViolations()
    })

    test('renders blank searchbar', () => {
        const { getByText, getByLabelText } = render(<BlankSearchbar />)
        expect(getByText('Search items')).toBeInTheDocument()
        expect(getByLabelText('Search items')).toBeInstanceOf(HTMLInputElement)
    })

    test('renders searchbar with pre-filled query', () => {
        const { getByText } = render(<PrefilledSearchbar />)
        expect(getByText('kind:pod,deployment')).toBeInTheDocument()
        expect(getByText('namespace:default')).toBeInTheDocument()
    })

    test('validates delete search tag function - whole tag', async () => {
        const { getByText, queryByText } = render(<PrefilledSearchbar />)
        expect(getByText('namespace:default')).toBeInTheDocument()
        userEvent.click(getByText('namespace:default'))
        expect(queryByText('namespace:default')).not.toBeInTheDocument()
    })

    test('validates delete search tag function - single tag value', async () => {
        const { getByText, queryByText } = render(<PrefilledSearchbar />)
        expect(getByText('kind:pod,deployment')).toBeInTheDocument()
        userEvent.click(getByText('kind:pod,deployment'))
        expect(queryByText('kind:pod,deployment')).not.toBeInTheDocument()
        expect(queryByText('kind:pod')).toBeInTheDocument()
    })

    test('validates delete All search tags button click', async () => {
        const { getByText, queryByText, getByTestId } = render(<PrefilledSearchbar />)
        expect(getByText('kind:pod,deployment')).toBeInTheDocument()
        expect(getByText('namespace:default')).toBeInTheDocument()
        userEvent.click(getByTestId('clear-all-search-tags-button'))
        expect(queryByText('kind:pod,deployment')).not.toBeInTheDocument()
        expect(queryByText('namespace:default')).not.toBeInTheDocument()
    })

    test('validates loading dropdown suggestions state', async () => {
        const { getByText, getByPlaceholderText } = render(<LoadingSuggestionsSearchbar />)
        userEvent.click(getByPlaceholderText('Search items'))
        expect(getByText('Loading...')).toBeInTheDocument()
    })

    test('validates adding search keyword tags', async () => {
        const { queryByText, getByPlaceholderText } = render(<BlankSearchbar />)
        userEvent.click(getByPlaceholderText('Search items'))
        userEvent.type(getByPlaceholderText('Search items'), 'keyword1 ') // space at end triggers the addition of the text as a tag
        userEvent.type(getByPlaceholderText('Search items'), 'keyword2 ') // space at end triggers the addition of the text as a tag
        expect(queryByText('keyword1')).toBeInTheDocument()
        expect(queryByText('keyword2')).toBeInTheDocument()
    })

    test('validates adding search tags from dropdown', async () => {
        const { queryByText, getByPlaceholderText } = render(<BlankSearchbar />)
        userEvent.click(getByPlaceholderText('Search items'))
        userEvent.type(getByPlaceholderText('Search items'), 'name ') // space at end triggers the addition of the text as a tag
        userEvent.type(getByPlaceholderText('Search items'), 'name1 ') // space at end triggers the addition of the text as a tag
        userEvent.type(getByPlaceholderText('Search items'), 'name ') // space at end triggers the addition of the text as a tag
        userEvent.type(getByPlaceholderText('Search items'), 'name2 ') // space at end triggers the addition of the text as a tag
        userEvent.type(getByPlaceholderText('Search items'), 'namespace ') // space at end triggers the addition of the text as a tag
        userEvent.type(getByPlaceholderText('Search items'), 'namespace1 ') // space at end triggers the addition of the text as a tag
        userEvent.type(getByPlaceholderText('Search items'), 'namespace ') // space at end triggers the addition of the text as a tag
        userEvent.type(getByPlaceholderText('Search items'), 'namespace2 ') // space at end triggers the addition of the text as a tag
        expect(queryByText('name:name1,name2')).toBeInTheDocument()
        expect(queryByText('namespace:namespace1,namespace2')).toBeInTheDocument()
    })
})

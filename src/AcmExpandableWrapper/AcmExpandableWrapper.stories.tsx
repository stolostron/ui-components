import '@patternfly/react-core/dist/styles/base.css'
import React from 'react'
import { Meta } from '@storybook/react'
import { AcmExpandableWrapper } from './AcmExpandableWrapper'
import _ from 'lodash'
import * as getSavedUserQuery from './getSavedUserQuery.json'
import * as searchQueryCountOnly from './searchQueryCountOnly.json'
import suggestedQueryTemplates from './suggestedQueryTemplates'

const meta: Meta = {
    title: 'Expandable Wrapper',
    component: AcmExpandableWrapper,
}
export default meta

const queries = _.get(getSavedUserQuery.data, 'items', [])
const countData = _.get(searchQueryCountOnly.data, 'searchResult', [])

console.log('queries', queries)
// console.log('countData', countData)

const queriesResult = countData.slice(0, queries.length).map((query, index) => {
    return { ...query, ...queries[index] }
})

const suggestedQueriesResult = countData.slice(queries.length).map((query, index) => {
    return { ...query, ...suggestedQueryTemplates[index] }
})

export const ExpandableSavedSearchWrapper = () => {
    return (
        <div>
            {queriesResult.length > 0 && (
                <AcmExpandableWrapper
                    card
                    queries={queriesResult}
                    header={'table.header.search.saved.query'}
                    showTotal={true}
                />
            )}
            {suggestedQueriesResult.length > 0 && (
                <AcmExpandableWrapper
                    queries={suggestedQueriesResult}
                    header={'table.header.search.suggested.query'}
                    reference={'Suggested'}
                />
            )}
        </div>
    )
}

export const ExpandableSearchTileWrapper = () => {
    return <AcmExpandableWrapper loading />
}

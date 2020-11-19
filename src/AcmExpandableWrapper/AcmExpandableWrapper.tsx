import React, { useState } from 'react'
import { Button } from '@patternfly/react-core'
import { makeStyles } from '@material-ui/styles'
import { AcmCountCard, AcmTile } from '../index'
import _ from 'lodash'

type AcmExpandableWrapperProps = {
    reference?: string
    count?: number
    loading?: boolean
    card?: boolean
    header?: string
    showTotal?: boolean
    queries?: any
}

const useStyles = makeStyles({
    resultsWrapper: {
        display: 'block',
    },
    resultsHeader: {
        fontSize: 'var(--pf-global--FontSize--lg)',
    },
    resultCardsContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill,minmax(18rem,1fr))',
        gridGap: '1rem',
        margin: '1rem 0',
    },
    resultCard: {
        maxWidth: 'calc(50% - 2rem)',
        flex: '1 0 auto',
    },
    toggleButton: {},
})

// const handleShowAllButtonClick = () = {

// }

export const AcmExpandableWrapper = (props: AcmExpandableWrapperProps) => {
    const { loading, card, reference, queries = [], showTotal } = props
    const classes = useStyles(props)
    const [toggle, setToggle] = useState<boolean>(false)
    console.log('queries', queries)

    const handleShowAllButtonClick = () => {
        setToggle(!toggle)
    }

    const renderResultBlocks = (queries) => {
        return toggle
            ? queries.map((query) => {
                  return (
                      <AcmCountCard
                          key={query.name}
                          {...query}
                          cardHeader={{
                              hasIcon: true,
                              title: query.name,
                              description: query.description,
                          }}
                      />
                  )
              })
            : queries.map((query, index) => {
                  if (index < 3) return <AcmCountCard key={query.name} {...query} />
              })
    }

    if (loading)
        return card ? (
            <div className={classes.resultsWrapper}>
                <p className={classes.resultsHeader}>Conditional Header</p>
                <div className={classes.resultCardsContainer}>
                    <AcmCountCard card loading />
                    <AcmCountCard card loading />
                    <AcmCountCard card loading />
                </div>
            </div>
        ) : (
            <div className={classes.resultsWrapper}>
                <p className={classes.resultsHeader}>Conditional Header</p>
                <div className={classes.resultCardsContainer}>
                    <AcmTile loading />
                    <AcmTile loading />
                    <AcmTile loading />
                </div>
            </div>
        )
    return (
        <div className={classes.resultsWrapper}>
            <p>{props.header}</p>
            {showTotal && <p>{queries.length} Total</p>}
            <div className={classes.resultCardsContainer}>{queries && renderResultBlocks(queries)}</div>
            {!toggle ? (
                queries.length > 3 && (
                    <Button className={classes.toggleButton} onClick={handleShowAllButtonClick} variant="secondary">
                        Show all
                    </Button>
                )
            ) : (
                <Button onClick={handleShowAllButtonClick} variant="secondary">
                    Show less
                </Button>
            )}
        </div>
    )
}

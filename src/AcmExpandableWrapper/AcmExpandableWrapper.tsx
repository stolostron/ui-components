import React, { useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import { AcmButton } from '../AcmButton/AcmButton'
import { Title, Grid, GridItem } from '@patternfly/react-core'

type AcmExpandableWrapperProps = {
    headerLabel?: string
    children: React.ReactNode
    maxHeight?: string
}

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
    },
    headerCount: {
        fontWeight: 'lighter',
    },
    wrapperContainer: {
        margin: '1rem 0',
    },
    hideExtras: {
        maxHeight: (props: AcmExpandableWrapperProps) => props.maxHeight,
        overflow: 'hidden',
    },
    showAllButton: {
        margin: '1rem auto',
    },
})

export const AcmExpandableWrapper = (props: AcmExpandableWrapperProps) => {
    const { children, headerLabel } = props
    const classes = useStyles(props)
    const [showAll, setShowAll] = useState<boolean>(false)

    return (
        <div className={classes.root}>
            {headerLabel && 
                <Title headingLevel="h4">
                    {headerLabel} 
                    {headerLabel === 'Saved Searches' && <span className={classes.headerCount}> {`( ${React.Children.count(children)} total )`}</span>}
                </Title>
            }
            <div
                className={
                    showAll ? `${classes.wrapperContainer}` : `${classes.wrapperContainer} ${classes.hideExtras}`
                }
            >
                <Grid hasGutter sm={6} md={4} lg={4} xl={3}>
                    {React.Children.map(props.children, (child, idx) => {
                        return (
                            <GridItem>
                                <div key={`item-${idx}`}>{child}</div>
                            </GridItem>
                        )
                    })}
                </Grid>
            </div>
            <AcmButton className={classes.showAllButton} variant={'secondary'} onClick={() => setShowAll(!showAll)}>
                {showAll ? 'Show less' : `Show all (${React.Children.count(children)})`}
            </AcmButton>
        </div>
    )
}

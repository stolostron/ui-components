import React, { useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import { AcmButton } from '../AcmButton/AcmButton'

type AcmExpandableWrapperProps = {
    headerLabel?: string
    children: React.ReactNode
    card?: boolean
}

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
    },
    wrapperContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill,minmax(18rem,0fr))',
        gridGap: '1rem',
        margin: '1rem 0',
    },
    wrapperItem: {
        flex: '1 0 auto',
    },
    hideExtras: {
        maxHeight: (props: AcmExpandableWrapperProps) => (props.card ? '17rem' : '9.6rem'),
        overflow: 'hidden',
    },
    showAllButton: {
        margin: 'auto',
    },
})

export const AcmExpandableWrapper = (props: AcmExpandableWrapperProps) => {
    const { children, headerLabel } = props
    const classes = useStyles(props)
    const [showAll, setShowAll] = useState<boolean>(false)

    return (
        <div className={classes.root}>
            <p>{headerLabel}</p>
            <div
                className={
                    showAll ? `${classes.wrapperContainer}` : `${classes.wrapperContainer} ${classes.hideExtras}`
                }
            >
                {React.Children.map(props.children, (child, idx) => {
                    return (
                        <div key={`item-${idx}`} className={classes.wrapperItem}>
                            {child}
                        </div>
                    )
                })}
            </div>
            <AcmButton className={classes.showAllButton} variant={'secondary'} onClick={() => setShowAll(!showAll)}>
                {showAll ? 'Show less' : `Show all (${React.Children.count(children)})`}
            </AcmButton>
        </div>
    )
}

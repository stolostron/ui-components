import '@patternfly/react-core/dist/styles/base.css'
import React from 'react'
import { Meta } from '@storybook/react'
import { AcmCountCard } from './AcmCountCard'
import { makeStyles } from '@material-ui/styles'

const meta: Meta = {
    title: 'Count Card',
    component: AcmCountCard,
}
export default meta

const handleCardClick = () => {
    alert('Card clicked')
}

const suggestedSearchCardActions = [{ text: 'Share', handleAction: () => alert('share action') }]
const savedSearchCardActions = [
    { text: 'Edit', handleAction: () => alert('edit action') },
    { text: 'Share', handleAction: () => alert('share action') },
    { text: 'Delete', handleAction: () => alert('delete action') },
]

const useStyles = makeStyles({
    root: {
        '& article': {
            margin: '1rem',
        },
    },
})

export const SuggestedSearchCard = () => {
    const classes = useStyles()
    return (
        <div className={classes.root}>
            <AcmCountCard
                cardHeader={{
                    hasIcon: true,
                    title: 'Workloads',
                    description: 'A pre-defined search to help you review your workloads',
                    actions: [...suggestedSearchCardActions],
                    onActionClick: (e) => {
                        alert(e.target)
                    },
                }}
                onCardClick={handleCardClick}
                count={13000}
                countTitle="Results"
                isSelectable={true}
            />
            <AcmCountCard
                cardHeader={{
                    hasIcon: true,
                    title: 'Unhealthy Pods',
                    description: 'Show pods with unhealthy status',
                    actions: [...suggestedSearchCardActions],
                    onActionClick: (e) => {
                        alert(e.target)
                    },
                }}
                onCardClick={handleCardClick}
                count={0}
                countTitle="Unhealthy"
                isSelectable={true}
            />
        </div>
    )
}

export const SavedSearchCard = () => {
    const classes = useStyles()
    return (
        <div className={classes.root}>
            <AcmCountCard
                cardHeader={{
                    hasIcon: false,
                    title: 'long name long name long name long name long names',
                    description:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed feugiat vitae ligula sit amet placerat.',
                    actions: [...savedSearchCardActions],
                    onActionClick: (e) => {
                        alert(e.target)
                    },
                }}
                onCardClick={handleCardClick}
                count={1234}
                countTitle="Results"
                isSelectable={true}
            />
            <AcmCountCard
                cardHeader={{
                    hasIcon: false,
                    title: 'Test Search 2',
                    description: 'Custom description with max amount of 60 characters',
                    actions: [...savedSearchCardActions],
                    onActionClick: (e) => {
                        alert(e.target)
                    },
                }}
                onCardClick={handleCardClick}
                count={0}
                countTitle="Results"
                isSelectable={true}
            />
        </div>
    )
}

export const CardSkeleton = () => {
    const classes = useStyles()
    return (
        <div className={classes.root}>
            <AcmCountCard loading />
            <AcmCountCard loading />
            <AcmCountCard loading />
        </div>
    )
}

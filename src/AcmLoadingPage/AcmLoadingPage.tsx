import React from 'react'
import { EmptyState, EmptyStateIcon, EmptyStateBody, Title, Spinner } from '@patternfly/react-core'
import { AcmPageCard } from '../AcmPage/AcmPage'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
    max: {
        maxWidth: '300px',
    },
})

export function AcmLoadingPage(props: { title?: string | React.ReactNode; message?: string | React.ReactNode }) {
    const classes = useStyles()
    return (
        <AcmPageCard>
            <EmptyState>
                <EmptyStateIcon variant="container" component={Spinner} />
                <div className={classes.max}>
                    <Title size="lg" headingLevel="h4">
                        {props.title ?? 'Loading'}
                    </Title>
                    <EmptyStateBody>{props.message}</EmptyStateBody>
                </div>
            </EmptyState>
        </AcmPageCard>
    )
}

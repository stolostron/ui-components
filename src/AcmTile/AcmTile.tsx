import React from 'react'
import { Skeleton, Tile, TileProps } from '@patternfly/react-core'
import { makeStyles } from '@material-ui/styles'
import '@patternfly/react-core/dist/styles/base.css'

type AcmTileProps = TileProps & {
    loading?: boolean
    relatedResourceData?: {
        count: number
        kind: string
    }
}

const useStyles = makeStyles({
    tileRoot: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 1.5rem',
        height: '64px',
        width: '275px',
    },
    loading: {
        width: 'calc(275px - 3rem)',
    },
    relatedResourceContainer: {
        display: 'flex',
        alignItems: 'center',
        width: 'calc(275px - 3rem)',
    },
    relatedResourceCount: {
        fontSize: '28px',
        color: 'var(--pf-global--palette--blue-400)',
        marginRight: '.5rem',
    },
    relatedResourceKind: {
        fontSize: '14px',
        fontWeight: 'bold',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        textAlign: 'left',
        lineHeight: '18px',
    },
})

export function AcmTile(props: AcmTileProps) {
    const classes = useStyles(props)
    if (props.loading) {
        return (
            <Tile className={classes.tileRoot} title={''} ref={null}>
                <Skeleton className={classes.loading} />
            </Tile>
        )
    }
    if (props.relatedResourceData) {
        // This render is specific to the search related resources tile
        let count = `${props.relatedResourceData.count}`
        if (parseInt(count) >= 1000) {
            count = `${(parseInt(count) - (parseInt(count) % 100)) / 1000}k`
        }
        return (
            <Tile className={classes.tileRoot} title={props.title} ref={null}>
                <div className={classes.relatedResourceContainer}>
                    <div className={classes.relatedResourceCount}>{count}</div>
                    <div className={classes.relatedResourceKind}>{`Related ${props.relatedResourceData.kind}`}</div>
                </div>
            </Tile>
        )
    }
    return <Tile {...props} ref={null} />
}

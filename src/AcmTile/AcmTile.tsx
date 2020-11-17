import React from 'react'
import { Tile, TileProps } from '@patternfly/react-core'
import { makeStyles } from '@material-ui/styles'
import '@patternfly/react-core/dist/styles/base.css'

type AcmTileProps = TileProps & {
    relatedResourceData?: {
        count: number
        kind: string
    }
}

const useStyles = makeStyles({
    tileRoot: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 1rem',
        height: '64px',
        width: '275px',
    },
    relatedResourceContainer: {
        display: 'flex',
        alignItems: 'baseline',
    },
    relatedResourceCount: {
        fontSize: '28px',
        color: 'var(--pf-global--palette--blue-400)',
        marginRight: '.5rem',
    },
    relatedResourceKind: {
        fontSize: '14px',
        fontWeight: 'bold',
    },
})

export function AcmTile(props: AcmTileProps) {
    const classes = useStyles(props)
    if (props.relatedResourceData) {
        // This render is specific to the search related resources tile
        return (
            <Tile className={classes.tileRoot} title={props.title} ref={null}>
                <div className={classes.relatedResourceContainer}>
                    <div className={classes.relatedResourceCount}>{props.relatedResourceData.count}</div>
                    <div className={classes.relatedResourceKind}>{props.relatedResourceData.kind}</div>
                </div>
            </Tile>
        )
    }
    return <Tile {...props} ref={null} />
}

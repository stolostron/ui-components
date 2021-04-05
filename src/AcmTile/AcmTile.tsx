/* Copyright Contributors to the Open Cluster Management project */

import React, { ReactNode } from 'react'
import { Skeleton, TileProps } from '@patternfly/react-core'
import { makeStyles } from '@material-ui/styles'
import '@patternfly/react-core/dist/styles/base.css'
import styles from '@patternfly/react-styles/css/components/Tile/tile'
import { css } from '@patternfly/react-styles'

type AcmTileProps = TileProps & {
    loading?: boolean
    relatedResourceData?: {
        count: number
        kind: string
    }
    AcmIcon?: ReactNode
}

const useStyles = makeStyles({
    tileRoot: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 1.5rem',
        height: '64px',
        overflow: 'hidden',
        '& >div:last-child': {
            width: '100%',
        },
    },
    relatedResourceContainer: {
        display: 'flex',
        alignItems: 'center',
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
                <Skeleton />
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
            <Tile
                className={classes.tileRoot}
                title={props.title}
                onClick={props.onClick}
                isSelected={props.isSelected}
                ref={null}
            >
                <div className={classes.relatedResourceContainer}>
                    <div className={classes.relatedResourceCount}>{count}</div>
                    <div className={classes.relatedResourceKind}>{`Related ${props.relatedResourceData.kind}`}</div>
                </div>
            </Tile>
        )
    }
    return <Tile {...props} ref={null} />
}

const Tile: React.FunctionComponent<AcmTileProps> = ({
    AcmIcon,
    children,
    title,
    icon,
    isStacked,
    isSelected,
    isDisabled,
    isDisplayLarge,
    className,
    ...props
}: AcmTileProps) => (
    <div
        className={css(
            styles.tile,
            isSelected && styles.modifiers.selected,
            isDisabled && styles.modifiers.disabled,
            isDisplayLarge && styles.modifiers.displayLg,
            className
        )}
        tabIndex={0}
        {...props}
    >
        <div className={css(styles.tileHeader, isStacked && styles.modifiers.stacked)}>
            {AcmIcon}
            {icon && <div className={css(styles.tileIcon)}>{icon}</div>}
            <div className={css(styles.tileTitle)}>{title}</div>
        </div>
        {children && <div className={css(styles.tileBody)}>{children}</div>}
    </div>
)
Tile.displayName = 'Tile'

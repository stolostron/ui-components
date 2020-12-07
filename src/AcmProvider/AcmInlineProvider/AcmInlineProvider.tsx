import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { Provider, ProviderLongTextMap, ProviderIconMap } from '../'
import { AcmIcon } from '../../AcmIcons/AcmIcons'

const useStyles = makeStyles({
    icon: {
        display: 'flex',
        alignItems: 'center',
        '& svg, & img': {
            width: '22px',
            marginRight: '8px',
        },
    },
})

export function AcmInlineProvider(props: { provider: Provider }) {
    const classes = useStyles()
    return (
        <div className={classes.icon}>
            <AcmIcon icon={ProviderIconMap[props.provider]} />
            <span>{ProviderLongTextMap[props.provider]}</span>
        </div>
    )
}

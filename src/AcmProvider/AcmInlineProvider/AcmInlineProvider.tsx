import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { Provider, ProviderLongTextMap, ProviderIconMap } from '../'
import { AcmIcon } from '../../AcmIcons/AcmIcons'

const useStyles = makeStyles({
    container: {
        display: 'flex',
        alignItems: 'center',
    },
})

export function AcmInlineProvider(props: { provider: Provider; size?: 'small' | 'medium' | 'large' | 'xlarge' }) {
    const classes = useStyles()
    return (
        <div className={classes.container}>
            <AcmIcon icon={ProviderIconMap[props.provider]} size={props.size} />
            &nbsp; &nbsp;
            <span>{ProviderLongTextMap[props.provider]}</span>
        </div>
    )
}

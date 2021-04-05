/* Copyright Contributors to the Open Cluster Management project */

import '@patternfly/react-core/dist/styles/base.css'
import React, { useState } from 'react'
import { Meta } from '@storybook/react'
import { AcmTile } from './AcmTile'
import { Grid, GridItem } from '@patternfly/react-core'
import { AcmIcon, AcmIconVariant } from '../AcmIcons/AcmIcons'
import AnsibleIcon from '@patternfly/react-icons/dist/js/icons/ansibeTower-icon'
import { makeStyles } from '@material-ui/styles'

const meta: Meta = {
    title: 'Tile',
    component: AcmTile,
    argTypes: {
        title: { type: 'string' },
        message: { type: 'string' },
    },
}
export default meta

export const Tile = () => {
    const [selected, toggleSelected] = useState<boolean>(false)

    const useStyles = makeStyles({
        iconClass: {
            display: 'flex',
            height: '50%',
            width: '50%',
            margin: '0 auto',
            overflow: 'hidden',
            icon: {
                height: '100%',
                margin: '0 5rem',
                cursor: 'pointer',
                flex: '1 0 0',
            },
        },
        testIcon: {
            '& tile__icon': {
                display: 'flex',
                height: '50%',
                width: '50%',
                margin: '0 auto',
                overflow: 'hidden',
                icon: {
                    height: '100%',
                    margin: '0 5rem',
                    cursor: 'pointer',
                    flex: '1 0 0',
                },
            },
        },
    })

    const classes = useStyles()

    return (
        <div>
            <AcmTile
                loading={false}
                isSelected={selected}
                title={''}
                onClick={() => toggleSelected(!selected)}
                relatedResourceData={{ count: 99999, kind: 'veryLongKindNameForTestingPurposes' }}
            />
            <AcmTile
                loading={false}
                isSelected={selected}
                title={''}
                onClick={() => toggleSelected(!selected)}
                relatedResourceData={{ count: 1, kind: 'veryShort' }}
            />

            <Grid span={1} md={1} hasGutter={false}>
                <GridItem md={1}>
                    <AcmTile title="Ansible Tower" isStacked={true} icon={<AnsibleIcon />} />
                </GridItem>
                <GridItem>
                    <AcmTile
                        title="Infrastructure Provider"
                        isStacked={true}
                        AcmIcon={
                            <div className={classes.iconClass}>
                                <AcmIcon icon={AcmIconVariant.cloud}></AcmIcon>
                            </div>
                        }
                    />
                </GridItem>
            </Grid>
        </div>
    )
}

export const LoadingTile = () => {
    const [selected, toggleSelected] = useState<boolean>(false)

    return (
        <AcmTile
            loading={true}
            isSelected={selected}
            title={'testing'}
            onClick={() => toggleSelected(!selected)}
            relatedResourceData={{ count: 1, kind: 'veryLongKindNameForTestingPurposes' }}
        />
    )
}

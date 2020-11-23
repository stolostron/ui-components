import React, { ReactNode, useState } from 'react'
import {
    Card,
    CardHeader,
    CardHeaderMain,
    CardActions,
    CardTitle,
    CardBody,
    CardFooter,
    CardProps,
    Dropdown,
    DropdownItem,
    KebabToggle,
    Skeleton,
    CardActionsProps,
} from '@patternfly/react-core'
import { AcmTemplateIcon } from '../AcmIcons/AcmIcons'
import { makeStyles } from '@material-ui/styles'

type CardHeaderActions = {
    text: string
    handleAction: () => void
}

interface CardHeaderProps {
    title: string
    description: string
    actions?: CardHeaderActions[]
    onActionClick?: (event: React.SyntheticEvent) => void
    hasIcon?: boolean
}

interface CardFooterProps {
    countDescription?: string
    countLink?: string | ReactNode
}

interface CardDropdownProps {
    dropdownItems: {
        text: string
        handleAction: () => void
    }[]
    toggle?: React.ReactNode
    onSelect?: (event: React.SyntheticEvent) => void
}

type AcmCountCardProps = CardProps & {
    key?: number
    id?: string
    label?: string
    loading?: boolean
    onCardClick?: () => void
    cardHeader?: CardHeaderProps
    cardFooter?: CardFooterProps
    count?: number
    countTitle?: string
    isFlat?: boolean
}

type SkeletonCard = CardProps & {
    id?: string
}

const useStyles = makeStyles({
    card: {
        height: (props: AcmCountCardProps) => (props.cardFooter ? 'auto' : '250px'),
    },
    headerDescription: {
        fontSize: 'var(--pf-global--FontSize--sm)',
        color: 'var(--pf-global--palette--black-700)',
    },
    actions: {
        width: '1rem',
        padding: '0',
        '&& ul': {
            right: '-1rem',
        },
    },
    count: {
        color: (props: AcmCountCardProps) =>
            props.count !== 0 ? 'var(--pf-global--link--Color)' : 'var(--pf-global--palette--black-900)',
        fontSize: 'var(--pf-global--FontSize--3xl)',
    },
    body: {
        position: (props: AcmCountCardProps) => (props.cardHeader ? 'absolute' : 'relative'),
        bottom: '0',
    },
    countTitle: {
        fontSize: 'var(--pf-global--FontSize--sm)',
        fontWeight: 700,
    },
    footer: {
        linkStyle: 'none',
    },
})

export function CardDropdown(props: CardDropdownProps & CardActionsProps) {
    const useStyles = makeStyles({
        dropdown: {
            width: '10rem',
        },
    })
    const classes = useStyles()
    const [isOpen, setOpen] = useState<boolean>(false)

    return (
        <Dropdown
            className="dropdownMenu"
            onClick={(e) => {
                setOpen(!isOpen)
                e.stopPropagation()
            }}
            toggle={<KebabToggle onToggle={() => setOpen(!isOpen)} />}
            isOpen={isOpen}
            isPlain
            dropdownItems={props.dropdownItems.map((item) => (
                <DropdownItem className={classes.dropdown} key={item.text} onClick={item.handleAction}>
                    {item.text}
                </DropdownItem>
            ))}
            position={'right'}
        />
    )
}

export const loadingCard = (props: SkeletonCard) => {
    const useStyles = makeStyles({
        cardSkeleton: {
            height: '250px',
        },
    })
    const classes = useStyles(props)
    return (
        <Card id={props.id} className={classes.cardSkeleton}>
            <CardHeader>
                <Skeleton width="25%" />
            </CardHeader>
            <CardBody>
                <Skeleton width="100%" />
                <br />
                <Skeleton width="100%" />
            </CardBody>
            <CardFooter>
                <Skeleton width="25%" height="4rem" />
            </CardFooter>
        </Card>
    )
}

export const AcmCountCard = (props: AcmCountCardProps) => {
    const classes = useStyles(props)
    const { id, loading, countTitle, cardFooter, cardHeader } = props
    let count = `${props.count}`
    if (parseInt(count) >= 1000) {
        count = `${(parseInt(count) - (parseInt(count) % 100)) / 1000}k`
    }
    if (loading) return loadingCard(props)
    return (
        <Card
            id={id}
            className={classes.card}
            onClick={props.onCardClick}
            isSelectable={!!props.onCardClick}
            isFlat={!props.onCardClick}
        >
            {cardHeader && (
                <CardHeader>
                    {cardHeader.actions && cardHeader.actions.length > 0 && (
                        <CardActions className={classes.actions}>
                            <CardDropdown dropdownItems={cardHeader.actions} />
                        </CardActions>
                    )}
                    <CardHeaderMain>
                        {cardHeader.hasIcon && <AcmTemplateIcon />}
                        <CardTitle>{cardHeader.title}</CardTitle>
                        <p className={classes.headerDescription}>{cardHeader.description}</p>
                    </CardHeaderMain>
                </CardHeader>
            )}
            <CardBody className={classes.body}>
                <div className={classes.count}>{count}</div>
                <div className={classes.countTitle}>{countTitle}</div>
            </CardBody>
            {cardFooter && (
                <CardFooter className={classes.footer}>
                    {cardFooter.countDescription || null}
                    {cardFooter.countLink || null}
                </CardFooter>
            )}
        </Card>
    )
}

import React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { AcmTile } from './AcmTile'

describe('AcmTile', () => {
    const RelatedResourceTile = (props: {
        selected: boolean
        relatedResourceData?: {
            count: number
            kind: string
        }
    }) => {
        return <AcmTile isSelected={props.selected} relatedResourceData={props.relatedResourceData} title={''} />
    }
    const DefaultTile = () => {
        return <AcmTile isSelected={false} title={'Tile title'} />
    }

    test('renders related resource tile component', () => {
        const { getByText } = render(
            <RelatedResourceTile selected={false} relatedResourceData={{ count: 10, kind: 'pod' }} />
        )
        expect(getByText('10')).toBeInTheDocument()
        expect(getByText('pod')).toBeInTheDocument()
    })
    test('renders default tile component', () => {
        const { getByText } = render(<DefaultTile />)
        expect(getByText('Tile title')).toBeInTheDocument()
    })
    test('has zero accessibility defects', async () => {
        const { container } = render(<DefaultTile />)
        expect(await axe(container)).toHaveNoViolations()
    })
})

import React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { AcmTile } from './AcmTile'

describe('AcmTile', () => {
    const LoadingTile = () => {
        return <AcmTile loading={true} isSelected={true} title={'testing'} />
    }

    const DefaultTile = () => {
        return <AcmTile isSelected={false} title={'Tile title'} />
    }

    const SelectedTile = () => {
        return <AcmTile isSelected={true} title={'Tile title'} />
    }

    const RelatedResourceTile = () => {
        return <AcmTile isSelected={false} relatedResourceData={{ count: 10, kind: 'pod' }} title={''} />
    }

    test('renders loading tile component', () => {
        const { queryByText } = render(<LoadingTile />)
        expect(queryByText('testing')).not.toBeInTheDocument()
    })
    test('renders related resource tile component', () => {
        const { getByText } = render(<RelatedResourceTile />)
        expect(getByText('10')).toBeInTheDocument()
        expect(getByText('Related pod')).toBeInTheDocument()
    })
    test('renders default tile component', () => {
        const { getByText } = render(<DefaultTile />)
        expect(getByText('Tile title')).toBeInTheDocument()
    })
    test('has zero accessibility defects - unselected', async () => {
        const { container } = render(<DefaultTile />)
        expect(await axe(container)).toHaveNoViolations()
    })

    test('has zero accessibility defects - selected', async () => {
        const { container } = render(<SelectedTile />)
        expect(await axe(container)).toHaveNoViolations()
    })
})

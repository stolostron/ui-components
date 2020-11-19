import React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { AcmExpandableWrapper } from './AcmExpandableWrapper'

describe('AcmExpandableWrapper', () => {
    const SkeletonCard = () => {
        return <AcmExpandableWrapper />
    }

    test('validates Skeleton Card renders', () => {
        const { getByTestId } = render(<AcmExpandableWrapper />)
        expect(getByTestId('ACM Skeleton Card')).toBeInTheDocument()
    })
})

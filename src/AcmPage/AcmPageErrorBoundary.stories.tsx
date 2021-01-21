import React, { useState, useEffect } from 'react'
import { AcmButton } from '../AcmButton/AcmButton'
import { AcmPageErrorBoundary } from './AcmPageErrorBoundary'

export default {
    title: 'PageErrorBoundary',
    component: AcmPageErrorBoundary,
}

export const PageErrorBoundary = () => {
    return (
        <AcmPageErrorBoundary>
            <ErrorButton />
            <div>Hello</div>
        </AcmPageErrorBoundary>
    )
}

const ErrorButton = () => {
    const [error, setError] = useState<boolean>(false)

    useEffect(() => {
        if (error) {
            throw new Error('An error occurred.')
        }
    }, [error])

    return <AcmButton onClick={() => setError(true)}>Throw error</AcmButton>
}

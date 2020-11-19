import React from 'react'
import { AcmProviderCard, Provider } from './AcmProviderCard'

export default {
    title: 'ProviderCard',
    component: AcmProviderCard,
}

export const ProviderCard = () => {
    return (
        <AcmProviderCard provider={Provider.aws} clusterCount={1} />
    )
}
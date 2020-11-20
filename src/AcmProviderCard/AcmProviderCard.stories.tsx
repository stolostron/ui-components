import '@patternfly/patternfly/patternfly.css'
import React from 'react'
import { AcmOverviewProviders, AcmProviderCard, Provider } from './AcmProviderCard'

export default {
    title: 'ProviderCard',
    component: AcmProviderCard,
}

export const ProviderCard = () => {
    const providers = Object.values(Provider).map((provider, i) => ({
        provider,
        clusterCount: Math.floor(Math.random() * 100 + 1),
        danger: i === 0,
        onClick: (provider) => console.log('Clicked ' + provider),
    }))
    return <AcmOverviewProviders providers={providers} />
}

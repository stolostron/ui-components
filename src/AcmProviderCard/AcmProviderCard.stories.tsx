import '@patternfly/patternfly/patternfly.css'
import React, { useState } from 'react'
import { AcmOverviewProviders, AcmProviderCard, Provider } from './AcmProviderCard'

export default {
    title: 'ProviderCard',
    component: AcmProviderCard,
}

export const ProviderCard = () => {
    const [filter, setFilter] = useState<Provider | undefined>(undefined)
    const providers = Object.values(Provider).map((provider, i) => ({
        provider,
        clusterCount: Math.floor(Math.random() * 100 + 1),
        danger: i === 0,
        isSelected: provider === filter,
        onClick: (provider: Provider) => {
            if (provider === filter) {
                setFilter(undefined)
            } else {
                setFilter(provider)
            }
        },
    }))
    return <AcmOverviewProviders providers={providers} />
}

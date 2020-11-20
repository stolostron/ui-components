import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { AcmOverviewProviders, AcmProviderCard, Provider } from './AcmProviderCard'

describe('AcmOverviewProviders', () => {
    const providers = Object.values(Provider).map((provider, i) => ({
        provider,
        clusterCount: Math.floor(Math.random() * 100 + 1),
        danger: i === 0,
        onClick: jest.fn(),
    }))
    test('renders', () => {
        const { getByTestId } = render(<AcmOverviewProviders providers={providers} />)
        Object.values(Provider).forEach((provider) => {
            const id = provider.toLowerCase().replace(/\s+/g, '-')
            expect(getByTestId(`${id}-provider-card`)).toBeInTheDocument()
        })
    })
    test('has zero accessibility defects', async () => {
        const { container } = render(<AcmOverviewProviders providers={providers} />)
        expect(await axe(container)).toHaveNoViolations()
    })
})

describe('AcmProviderCard', () => {
    const onClick = jest.fn()

    test('renders and can be interacted with', () => {
        const ProviderCard = () => <AcmProviderCard provider={Provider.aws} onClick={onClick} clusterCount={5} />
        const { getByTestId } = render(<ProviderCard />)
        expect(getByTestId('amazon-provider-card')).toBeInTheDocument()
        userEvent.tab()
        expect(getByTestId('amazon-provider-card')).toHaveFocus()
        userEvent.type(getByTestId('amazon-provider-card'), '{enter}')
        expect(onClick).toHaveBeenCalled()
        expect(onClick).toBeCalledWith('amazon')
        userEvent.type(getByTestId('amazon-provider-card'), '{space}')
        expect(onClick).toHaveBeenCalled()
        expect(onClick).toBeCalledWith('amazon')
        userEvent.click(getByTestId('amazon-provider-card'))
        expect(onClick).toHaveBeenCalled()
        expect(onClick).toBeCalledWith('amazon')
    })
    test('can render a danger state', () => {
        const ProviderCard = () => <AcmProviderCard danger provider={Provider.aws} onClick={onClick} clusterCount={5} />
        const { container } = render(<ProviderCard />)
        expect(container.querySelector('#amazon-provider-card .danger-icon')).toBeTruthy()
    })
    test('has zero accessibility defects', async () => {
        const ProviderCard = () => <AcmProviderCard danger provider={Provider.aws} onClick={onClick} clusterCount={5} />
        const { container } = render(<ProviderCard />)
        expect(await axe(container)).toHaveNoViolations()
    })
})

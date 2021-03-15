/* Copyright Contributors to the Open Cluster Management project */

/* istanbul ignore file */
import { render } from '@testing-library/react'
import 'isomorphic-fetch'
import { axe } from 'jest-axe'
import nock from 'nock'
import React from 'react'
import { MemoryRouter } from 'react-router'
import { AcmHeader } from './AcmHeader'

describe('AcmHeader', () => {
    beforeAll(() => {
        const APIServer = nock('https://localhost:3000')
        APIServer.persist().get('/multicloud/common/username').reply(200, { username: 'kubeadmin' })
    })

    test('renders', async () => {
        const { container } = render(
            <MemoryRouter>
                <AcmHeader>
                    <div>test</div>
                </AcmHeader>
            </MemoryRouter>
        )
        expect(await axe(container)).toHaveNoViolations()
    })
})

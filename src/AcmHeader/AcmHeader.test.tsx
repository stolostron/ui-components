/* Copyright Contributors to the Open Cluster Management project */

/* istanbul ignore file */
import React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { AcmHeader } from './AcmHeader'
import 'isomorphic-fetch'
import nock from 'nock'

describe('AcmHeader', () => {
    beforeAll(() => {
        const APIServer = nock('https://localhost:3000')
        APIServer.persist().get('/multicloud/common/username').reply(200, { username: 'kubeadmin' })
    })
    test('renders', async () => {
        const { container } = render(
            <AcmHeader urlpath="/multicloud/policies/all" href="https://patternfly.org" target="_blank">
                <div>test</div>
            </AcmHeader>
        )
        expect(await axe(container)).toHaveNoViolations()
    })
})

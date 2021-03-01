/* Copyright Contributors to the Open Cluster Management project */

/* istanbul ignore file */
import React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { AcmHeaderPrototype } from './AcmHeaderPrototype'
import 'isomorphic-fetch'
import nock from 'nock'

describe('AcmHeaderPrototype', () => {
    beforeAll(() => {
        const APIServer = nock('https://localhost:3000')
        APIServer.persist().get('/multicloud/common/username').reply(200, { username: 'kubeadmin' })
    })
    test('renders', async () => {
        const { container } = render(
            <AcmHeaderPrototype urlpath="/multicloud/policies/all" href="https://patternfly.org" target="_blank">
                <div>test</div>
            </AcmHeaderPrototype>
        )
        expect(await axe(container)).toHaveNoViolations()
    })
})

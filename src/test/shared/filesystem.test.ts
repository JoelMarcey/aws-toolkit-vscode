/*!
 * Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

import * as assert from 'assert'
import * as del from 'del'
import * as fs from 'fs'
import * as path from 'path'
import * as filesystem from '../../shared/filesystem'

describe('filesystem', () => {

    let tempFolder: string

    before(() => {
        // Make a temp folder for all these tests
        // Stick some temp credentials files in there to load from
        tempFolder = fs.mkdtempSync('vsctk')
    })

    after(async () => {
        await del([ tempFolder ])
    })

    describe('readFileAsyncAsString', () => {
        it('reads file contents as a string', async () => {
            const expectedJson: string = generateRandomData()
            const filename = path.join(tempFolder, 'read-async-string-test.json')
            fs.writeFileSync(filename, expectedJson)

            assert.equal(
                await filesystem.readFileAsyncAsString(filename),
                expectedJson
            )
        })
    })

    describe('mkdtempAsync', () => {
        it('rejects on error', async () => {
            let error: Error | string | undefined

            try {
                await filesystem.mkdtempAsync('\n\0')
            } catch (err) {
                error = err as Error | string
            } finally {
                assert.ok(error)
            }
        })
    })

    function generateRandomData(): string {
        const data: { [key: string]: Number } = {}

        for (let i = 0; i < 250; i++) {
            const key: string = `data${Math.round(Math.random() * 1000)}`

            data[key] = Math.random()
        }

        return JSON.stringify(data)
    }
})

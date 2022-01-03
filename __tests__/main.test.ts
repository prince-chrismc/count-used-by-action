import * as core from '@actions/core'
import * as github from '@actions/github'
import nock from 'nock'

import { count } from '../src/count'
import {
  expect,
  test,
  describe,
  beforeAll,
  beforeEach,
  afterAll,
  jest
} from '@jest/globals'

// Inputs for mock @actions/core
let inputs = {} as any

// Shallow clone original @actions/github context
let originalContext = { ...github.context }

describe('queries', () => {
  beforeAll(() => {
    // Mock getInput
    jest.spyOn(core, 'getInput').mockImplementation((name: string) => {
      return inputs[name]
    })

    // Mock error/warning/info/debug
    jest.spyOn(core, 'error').mockImplementation(jest.fn())
    jest.spyOn(core, 'warning').mockImplementation(jest.fn())
    jest.spyOn(core, 'info').mockImplementation(jest.fn())
    jest.spyOn(core, 'debug').mockImplementation(jest.fn())
    jest.spyOn(core, 'startGroup').mockImplementation(jest.fn())
    jest.spyOn(core, 'endGroup').mockImplementation(jest.fn())
    jest.spyOn(core, 'setFailed').mockImplementation(jest.fn())

    // Mock github context
    jest.spyOn(github.context, 'repo', 'get').mockImplementation(() => {
      return {
        owner: 'some-owner',
        repo: 'some-repo'
      }
    })
    github.context.ref = 'refs/heads/some-ref'
    github.context.sha = '1234567890123456789012345678901234567890'
    github.context.eventName = 'push'
    github.context.actor = 'buster'
  })

  beforeEach(() => {
    // Reset inputs
    inputs = {}
    github.context.eventName = originalContext.eventName
    github.context.payload = originalContext.payload
  })

  afterAll(() => {
    // Restore @actions/github context
    github.context.ref = originalContext.ref
    github.context.sha = originalContext.sha
    github.context.eventName = originalContext.eventName
    github.context.actor = originalContext.actor

    // Restore
    jest.restoreAllMocks()
  })

  test('get the count', async () => {
    const scope = nock('https://api.github.com', {
      reqheaders: {
        authorization: 'token justafaketoken'
      }
    })
      .get(
        `/search/code?q=actions%2520checkout%2520language%253Ayaml%2520path%253A.github%252Fworkflows`
      )
      .reply(200, {
        total_count: 101
      })

    const octokit = github.getOctokit('justafaketoken')

    const counted = await count(octokit, github.context, 'actions checkout')
    expect(counted).toBe(101)
  })

  test('encouters an error', async () => {
    const scope = nock('https://api.github.com', {
      reqheaders: {
        authorization: 'token justafaketoken'
      }
    })
      .get(
        `/search/code?q=actions%2520checkout%2520language%253Ayaml%2520path%253A.github%252Fworkflows`
      )
      .reply(422, {
        "message": "Validation Failed",
        "errors": [
          {
            "message": "Must include at least one user, organization, or repository",
            "resource": "Search",
            "field": "q",
            "code": "invalid"
          }
        ],
        "documentation_url": "https://docs.github.com/v3/search/"
      })

    const octokit = github.getOctokit('justafaketoken')

    const counted = count(octokit, github.context, 'actions checkout')
    await expect(counted).rejects.toThrowError()
  })
})

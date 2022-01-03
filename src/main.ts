import * as core from '@actions/core'
import * as github from '@actions/github'

import {count} from './count'

async function run(): Promise<void> {
  try {
    const githubToken = core.getInput('github_token', {required: true}) // Since there's a default it should never be empty
    const octokit = github.getOctokit(githubToken)
    const repo = github.context.repo
    const actionName: Readonly<string> = `${repo.owner} ${repo.repo}`

    const counted = await count(octokit, actionName)
    core.info(`🧮 Found ${actionName} called ${counted} times`)
    core.setOutput('counted', `${counted}`)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error)
  }
}

run()

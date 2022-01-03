import * as core from '@actions/core'
import * as github from '@actions/github'

import {count} from './count'

async function run(): Promise<void> {
  try {
    const githubToken = core.getInput('github_token')
    const octokit = github.getOctokit(githubToken)
    const actionName: Readonly<string> = github.repository.split('/').join(' ')

    const count = await permitted(octokit, github.context, actionName)
    core.info(`🧮 Found ${actionName} called ${count} times`)
    core.setOutput('counted', `${count}`)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error)
  }
}

run()

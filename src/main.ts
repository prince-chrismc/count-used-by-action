import * as core from '@actions/core'
import * as github from '@actions/github'

import {count} from './count'

async function run(): Promise<void> {
  try {
    const githubToken = core.getInput('github_token')
    const octokit = github.getOctokit(githubToken)
    const repo = github.context.repo
    const actionName: Readonly<string> = `${repo.owner} ${repo.repo}`

    const counted = await count(octokit, 'prince-chrismc label-merge-conflicts-action')
    core.info(`🧮 Found ${actionName} called ${counted} times`)
    core.setOutput('counted', `${counted}`)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error)
  }
}

run()

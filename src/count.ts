import * as core from '@actions/core'
import {GitHub} from '@actions/github/lib/utils'

export async function count(
  octokit: InstanceType<typeof GitHub>,
  search: string
): Promise<number> {
  const response = await octokit.rest.search.code({
    q: encodeURIComponent(`${search} language:yaml path:.github/workflows`)
  })

  core.info(JSON.stringify(response))
  return response.data.total_count
}

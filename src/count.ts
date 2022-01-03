import * as core from '@actions/core'
import {Context} from '@actions/github/lib/context'
import {GitHub} from '@actions/github/lib/utils'

// Permission levels - higher in the array have higher access to the repo.
const perms: readonly string[] = ['none', 'read', 'write', 'admin']

export async function count(
  octokit: InstanceType<typeof GitHub>,
  context: Context,
  search: string
): Promise<number> {
  const response = await octokit.rest.search.code({
    q: encodeURIComponent(`${search} language:yaml path:.github/workflows`),
  })

  return response.data.total_count
}

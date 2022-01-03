import {GitHub} from '@actions/github/lib/utils'

export async function count(
  octokit: InstanceType<typeof GitHub>,
  search: string
): Promise<number> {
  const response = await octokit.rest.search.code({
    q: `${search} language:yaml path:.github/workflows`
  })

  return response.data.total_count
}

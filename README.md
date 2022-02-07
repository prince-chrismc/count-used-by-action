# Deprecated: ⚠️ [There's now official support for this in GitHub's UI][ref] ⚠️

[ref]: https://github.blog/2022-01-31-dependency-graph-now-supports-github-actions/

[![MIT](https://img.shields.io/github/license/prince-chrismc/count-used-by-action)](https://github.com/prince-chrismc/count-used-by-action/blob/main/LICENSE)
[![codecov](https://img.shields.io/codecov/c/github/prince-chrismc/count-used-by-action)](https://codecov.io/gh/prince-chrismc/count-used-by-action)
![used by](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/prince-chrismc/count-used-by-action/main/.github/used-by.json)

A GitHub Action to determine the number of times your action is called in workflows across GitHub.

## Getting Started

To have an action that only logs the number of callers, use the action as follows:

```yaml
steps:
- id: count
  uses: prince-chrismc/count-used-by-action@v1
- run: echo 'Found ${{ steps.count.outputs.counted }} callers'
```

### Periodically Creating a Badge

To have the workflow generate a badge, try usinng the action as follows:

```yaml
name: Count Used By

on:
  schedule:
    - cron: "0 0 * * *" # Everyday
  workflow_dispatch: {}
    
jobs:
  used-by:
    runs-on: ubuntu-latest
    steps:
    - id: count
      uses: prince-chrismc/count-used-by-action@v1
    - uses: actions/checkout@v2
    - run: |
       echo '{
         "schemaVersion": 1,
         "label": "Used By",
         "message": "${{ steps.count.outputs.counted }}",
         "color": "blue",
         "namedLogo": "githubactions",
         "logoColor": "#fff"
       }' > .github/used-by.json
    - uses: EndBug/add-and-commit@v8
      with:
        default_author: github_actions
```

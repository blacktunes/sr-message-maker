import { fetchAvt } from './fetch-avatar'
import { fetchChar } from './fetch-character'

const isGitHubActions = process.env.GITHUB_ACTIONS === 'true'

;(async () => {
  await fetchAvt(isGitHubActions)
  await fetchChar(isGitHubActions)
})()

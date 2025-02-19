import { type GitHubRepoParams, GitHubRepoSchema } from './types';

export async function fetchGitHubRepo({ owner, repo }: GitHubRepoParams) {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
  const data = await response.json();

  return GitHubRepoSchema.parse(data);
}

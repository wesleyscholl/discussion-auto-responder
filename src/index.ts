import { getInput, setFailed } from '@actions/core';
import { context, getOctokit } from '@actions/github';

async function run() {
  const token = getInput('gh-token');
  const label = getInput('label');

  const octokit = getOctokit(token);
  const pullRequest = context.payload.pull_request;

  try {
    if (!pullRequest) {
      throw new Error('This action can only be run on Pull Requests');
    }

    await octokit.rest.issues.addLabels({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: pullRequest.number,
      labels: [label],
    });
  } catch (error) {
    setFailed((error as Error)?.message ?? 'Unknown error');
  }
}

run();
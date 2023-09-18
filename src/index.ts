import { getInput, setFailed } from '@actions/core';
import { context, getOctokit } from '@actions/github';
const { Octokit } = require("@octokit/action");

async function run() {
  const octokit = new Octokit();
  const eventPayload = require(String(process.env.GITHUB_EVENT_PATH));
  console.log(eventPayload)
  const discussionId = eventPayload.discussion.node_id;
  console.log(discussionId)

  try {
    const response = await octokit.graphql(
      `
      mutation {
        addDiscussionComment(
          input: {body: "This is a comment from GQL", discussionId: "D_kwDOKMfoY84AVSDz", clientMutationId: "8888"}
        ) {
          clientMutationId
          comment {
            id
            body
          }
        }
      }
      `
    );
  } catch (error) {
    setFailed((error as Error)?.message ?? 'Unknown error');
  }
}

run();



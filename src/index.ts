import { getInput, setFailed } from "@actions/core";
import { context, getOctokit } from "@actions/github";
const { Octokit } = require("@octokit/action");

async function run() {
  const token = getInput('GITHUB_TOKEN');

  const octokit = new Octokit(token);
  const eventPayload = require(String(process.env.GITHUB_EVENT_PATH));
  console.log(eventPayload);
  const discussionId = eventPayload.discussion.node_id;
  console.log(discussionId);

  try {
    const response = await octokit.graphql(
      `
      mutation {
        addDiscussionComment(
          input: {body: "This is a comment from GQL", discussionId: "${discussionId}", clientMutationId: "8888"}
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
    console.log(response);
  } catch (error) {
    setFailed((error as Error)?.message ?? "Unknown error");
  }
}

run();

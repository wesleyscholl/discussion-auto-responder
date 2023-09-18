import { getInput, setFailed } from "@actions/core";
// @ts-ignore
const { Octokit } = require("@octokit/action");

async function run() {
  const token = getInput('GITHUB_TOKEN');
  const commentBody = getInput('comment_body');

  const octokit = new Octokit(token);
  const eventPayload = require(String(process.env.GITHUB_EVENT_PATH));
  const discussionId = eventPayload.discussion.node_id;
  console.log(discussionId);

  try {
    const response = await octokit.graphql(
      `
      mutation {
        addDiscussionComment(
          input: {body: "${commentBody}", discussionId: "${discussionId}", clientMutationId: "1234"}
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

export { run }

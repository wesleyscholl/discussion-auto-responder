import { getInput, setFailed, setOutput } from "@actions/core";
import { Octokit } from "@octokit/action";

interface Res {
  addDiscussionComment: {
    clientMutationId: string;
    comment: {
      id: string;
      body: string;
    };
  };
}

async function run() {
  const token = getInput("GITHUB_TOKEN");
  const commentBody = getInput("comment_body");

  const octokit = new Octokit({ token });
  const eventPayload = require(String(process.env.GITHUB_EVENT_PATH));
  const discussionId = eventPayload.discussion.node_id;
  console.log(discussionId);

  try {
    const response: Res = await octokit.graphql(
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
    setOutput("discussionId", discussionId);
    setOutput("commentId", response?.addDiscussionComment?.comment?.id);
    setOutput("commentBody", response?.addDiscussionComment?.comment?.body);
    setOutput(
      "clientMutationId",
      response?.addDiscussionComment?.clientMutationId
    );
  } catch (error) {
    setFailed((error as Error)?.message ?? "Unknown error");
  }
}

run();

export { run };

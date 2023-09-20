import { getInput, setFailed, setOutput } from "@actions/core";
import { graphql } from "@octokit/graphql";

interface Res {
  addDiscussionComment: {
    clientMutationId: string;
    comment: {
      id: string;
      body: string;
    };
  };
}

export async function run() {
  const token = getInput("GITHUB_TOKEN");
  const commentBody = getInput("comment_body");
  const delay = getInput("delay_seconds");
  const eventPayload = require(String(process.env.GITHUB_EVENT_PATH));
  const discussionId = eventPayload.discussion.node_id;
  await new Promise((f) => setTimeout(f, Number(delay)));

  try {
    const response: Res = await graphql(
      `mutation {
        addDiscussionComment(
          input: { body: "${commentBody}", discussionId: "${discussionId}", clientMutationId: "1234" }
        ) {
          clientMutationId
          comment {
            id
            body
          }
        }
      }`
    );
    await console.log(response);
    await setOutput("discussionId", discussionId);
    await setOutput("commentId", response?.addDiscussionComment?.comment?.id);
    await setOutput(
      "commentBody",
      response?.addDiscussionComment?.comment?.body
    );
    await setOutput(
      "clientMutationId",
      response?.addDiscussionComment?.clientMutationId
    );
  } catch (error) {
    setFailed((error as Error)?.message ?? "Unknown error");
  }
}

if (!process.env.JEST_WORKER_ID) {
  run();
}

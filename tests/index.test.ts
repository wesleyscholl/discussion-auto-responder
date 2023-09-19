import { run } from "../src/index";

jest.mock("@octokit/action");

const octokit: any = {
  graphql: jest.fn(),
};

describe("Discussion Auto Responder", () => {
  it("should successfully post a comment to a discussion", async () => {
    octokit.graphql.mockResolvedValue({
      addDiscussionComment: {
        clientMutationId: "1234",
        comment: {
          id: "1234567890",
          body: "This comment was generated by the Discussion Auto Responder",
        },
      },
    });

    const response = await run();

    expect(response).toEqual({
      discussionId: "1234567890",
      commentId: "1234567890",
      commentBody:
        "This comment was generated by the Discussion Auto Responder",
      clientMutationId: "1234",
    });
  });

  it("should fail if an error occurs while posting a comment", async () => {
    octokit.graphql.mockRejectedValue(new Error("Failed to post comment"));

    try {
      await run();
    } catch (error: any) {
      expect(error.message).toEqual("Failed to post comment");
    }
  });
});

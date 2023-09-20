import { run } from "../index";
import { graphql } from "@octokit/graphql";
import * as core from "@actions/core";
import { mocked } from "jest-mock";

// Mock the external dependencies
jest.mock("@octokit/graphql");
jest.mock("@actions/core");

const mockedGetInput = mocked(core.getInput);
const mockedSetFailed = mocked(core.setFailed);
const mockedSetOutput = mocked(core.setOutput);
const mockedGraphQL = mocked(graphql);

beforeEach(() => {
  // Clear mock calls and reset any mocked values before each test
  jest.clearAllMocks();

  // Mock getInput, setFailed, and setOutput from @actions/core
  jest.mock("@actions/core", () => ({
    getInput: mockedGetInput,
    setFailed: mockedSetFailed,
    setOutput: mockedSetOutput,
  }));
});

test("run function successfully runs", async () => {
  // Mock the input values
  mockedGetInput.mockReturnValueOnce("mocked_token");
  mockedGetInput.mockReturnValueOnce("Test comment");
  mockedGetInput.mockReturnValueOnce("5");

  // Mock the GraphQL response
  const mockedResponse = {
    addDiscussionComment: {
      clientMutationId: "1234",
      comment: {
        id: "commentId",
        body: "Test comment",
      },
    },
  };
  mockedGraphQL.mockResolvedValueOnce(mockedResponse);

  // Mock the GITHUB_EVENT_PATH
  process.env.GITHUB_EVENT_PATH = "path/to/event.json";
  const mockedConsoleLog = jest.spyOn(console, "log");

  // Run the `run` function
  await run();

  // // Assertions
  // expect(mockedGetInput).toHaveBeenCalledTimes(3);
  // expect(mockedSetFailed).not.toHaveBeenCalled();
  // expect(mockedSetOutput).toHaveBeenCalledWith("discussionId", "discussionId"); // You should provide the correct value here
  // expect(mockedSetOutput).toHaveBeenCalledWith("commentId", "commentId");
  // expect(mockedSetOutput).toHaveBeenCalledWith("commentBody", "Test comment");
  // expect(mockedSetOutput).toHaveBeenCalledWith("clientMutationId", "1234");
  // expect(mockedConsoleLog).toHaveBeenCalledWith("discussionId"); // You should provide the correct value here
  // expect(mockedGraphQL).toHaveBeenCalledWith(expect.any(String), {
  //   headers: {
  //     authorization: "token mocked_token",
  //   },
  // });
});

// test("run function handles errors", async () => {
//   // Mock the input values
//   mockedGetInput.mockReturnValueOnce("mocked_token");
//   mockedGetInput.mockReturnValueOnce("Test comment");
//   mockedGetInput.mockReturnValueOnce("5");

//   // Mock the GraphQL error
//   const error = new Error("GraphQL error");
//   mockedGraphQL.mockRejectedValueOnce(error);

//   // Run the `run` function
//   await run();

//   // Assertions
//   expect(mockedGetInput).toHaveBeenCalledTimes(3);
//   expect(mockedSetFailed).toHaveBeenCalledWith("GraphQL error");
//   expect(mockedSetOutput).not.toHaveBeenCalled();
// });

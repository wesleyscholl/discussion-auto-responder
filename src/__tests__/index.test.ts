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
  mockedGetInput.mockReturnValueOnce("{{ github.token }}");
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
  process.env.GITHUB_EVENT_PATH = "src/event.json";
  const mockedConsoleLog = jest.spyOn(console, "log");

  // Run the `run` function
  await run();

  // Assertions
  expect(mockedGetInput).toHaveBeenCalledTimes(3);
  expect(mockedSetFailed).not.toHaveBeenCalled();
  expect(mockedSetOutput).toHaveBeenCalledWith(
    "discussionId",
    "D_kwDOKVDDec4AVkAC"
  );
  expect(mockedSetOutput).toHaveBeenCalledWith("commentId", "commentId");
  expect(mockedSetOutput).toHaveBeenCalledWith("commentBody", "Test comment");
  expect(mockedSetOutput).toHaveBeenCalledWith("clientMutationId", "1234");
  // expect(mockedConsoleLog).toHaveBeenCalledWith("{{ github.token }}");
  expect(mockedConsoleLog).toHaveBeenCalledWith({
    addDiscussionComment: {
      clientMutationId: "1234",
      comment: { body: "Test comment", id: "commentId" },
    },
  });
  expect(mockedGraphQL).toHaveBeenCalledWith(expect.any(String));
});

test("run function handles GraphQL error", async () => {
  // Mock the input values
  mockedGetInput.mockReturnValueOnce("{{ github.token }}");
  mockedGetInput.mockReturnValueOnce("Test comment");
  mockedGetInput.mockReturnValueOnce("5");

  // Mock the GraphQL error
  const errorMessage = "GraphQL error";
  mockedGraphQL.mockRejectedValueOnce(new Error(errorMessage));

  // Run the `run` function
  await run();

  // Assertions
  expect(mockedGetInput).toHaveBeenCalledTimes(3);
  expect(mockedSetFailed).toHaveBeenCalledWith(errorMessage);
  expect(mockedSetOutput).not.toHaveBeenCalled();
});

test("run function handles missing inputs", async () => {
  // Mock missing inputs
  mockedGetInput.mockReturnValueOnce(""); // Missing token
  mockedGetInput.mockReturnValueOnce(""); // Missing commentBody
  mockedGetInput.mockReturnValueOnce(""); // Missing delay
  const mockedConsoleLog = jest.spyOn(console, "log");

  // Run the `run` function
  await run();

  // Assertions
  expect(mockedGetInput).toHaveBeenCalledTimes(3);
  expect(mockedSetOutput).toHaveBeenCalledWith(
    "discussionId",
    "D_kwDOKVDDec4AVkAC"
  );
  expect(mockedSetOutput).toHaveBeenCalledWith("commentId", undefined);
  expect(mockedSetOutput).toHaveBeenCalledWith("commentBody", undefined);
  expect(mockedConsoleLog).toHaveBeenCalledWith(undefined);
});

test("run function handles zero delay", async () => {
  // Mock the input values
  mockedGetInput.mockReturnValueOnce("{{ github.token }}");
  mockedGetInput.mockReturnValueOnce("Test comment");
  mockedGetInput.mockReturnValueOnce("0"); // Zero delay

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

  // Run the `run` function
  await run();

  // Assertions
  expect(mockedGetInput).toHaveBeenCalledTimes(3);
  expect(mockedSetFailed).not.toHaveBeenCalled();
  expect(mockedSetOutput).toHaveBeenCalledWith(
    "discussionId",
    "D_kwDOKVDDec4AVkAC"
  );
  expect(mockedSetOutput).toHaveBeenCalledWith("commentId", "commentId");
  expect(mockedSetOutput).toHaveBeenCalledWith("commentBody", "Test comment");
  expect(mockedSetOutput).toHaveBeenCalledWith("clientMutationId", "1234");
});

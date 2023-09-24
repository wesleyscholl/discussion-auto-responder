import { run } from "../index";
import * as core from "@actions/core";
import { mocked } from "jest-mock";
import { graphql } from "@octokit/graphql";

jest.mock("@octokit/graphql");
jest.mock("@actions/core");
const mockedGetInput = mocked(core.getInput);
const mockedSetOutput = mocked(core.setOutput);
const mockedSetFailed = mocked(core.setFailed);
const mockedGraphQL = mocked(graphql);
let originalEnv: NodeJS.ProcessEnv;

beforeEach(() => {
  // Store the original process.env object
  originalEnv = process.env;
  // Clear mock calls and reset any mocked values before each test
  jest.clearAllMocks();

  // Mock getInput, setFailed, and setOutput from @actions/core
  jest.mock("@actions/core", () => ({
    getInput: mockedGetInput,
    setFailed: mockedSetFailed,
    setOutput: mockedSetOutput,
  }));
  // Mock the GITHUB_EVENT_PATH
  process.env.GITHUB_EVENT_PATH = "src/event.json";
});

afterAll(() => {
  // Restore the original process.env object after testing
  process.env = originalEnv;
});

test("should call run() when JEST_WORKER_ID is not defined", async () => {
  // Mock process.env to simulate JEST_WORKER_ID not being defined
  delete process.env.JEST_WORKER_ID;

  mockedGetInput.mockReturnValueOnce("{{ github.token }}");
  mockedGetInput.mockReturnValueOnce("Test comment");
  mockedGetInput.mockReturnValueOnce("2000");

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

  // Call the conditional block
  await run();

  // Assertions
  expect(mockedGetInput).toHaveBeenCalledTimes(3);
  expect(mockedSetOutput).toHaveBeenCalledWith("discussionId", "D_kwDOKVDDec4AVkAC");
  expect(mockedSetOutput).toHaveBeenCalledWith("commentId", "commentId");
  expect(mockedSetOutput).toHaveBeenCalledWith("commentBody", "Test comment");
  expect(mockedSetOutput).toHaveBeenCalledWith("clientMutationId", "1234");
});

test("should not call run() when JEST_WORKER_ID is defined", () => {
  // Mock process.env to simulate JEST_WORKER_ID being defined
  process.env.JEST_WORKER_ID = "some-worker-id";

  // Mock the run function
  const runSpy = jest.spyOn(core, "setFailed");

  // Call the conditional block
  require("../index"); // This will execute the code block

  // Expectations
  expect(runSpy).not.toHaveBeenCalled();

  // Clean up the spy
  runSpy.mockRestore();
});

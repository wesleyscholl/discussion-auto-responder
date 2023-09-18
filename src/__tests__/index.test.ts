import { run } from "../index";
import { getInput, setFailed } from "@actions/core";
import { context, getOctokit } from "@actions/github";

// Mock getInput and setFailed functions
jest.mock("@actions/core", () => ({
  getInput: jest.fn(),
  setFailed: jest.fn(),
}));

// Mock context and getOctokit functions
jest.mock("@actions/github", () => ({
  context: {
    payload: {
      pull_request: {
        number: 1,
      },
    },
    repo: {
      owner: "owner",
      repo: "repo",
    },
  },
  getOctokit: jest.fn(),
}));

describe("run", () => {
  beforeEach(() => {
    // Clear all mock function calls and reset mock implementation
    jest.clearAllMocks();
  });

  it("should throw an error if not run on a pull request", async () => {
    // Mock the return values for getInput
    (getInput as jest.Mock).mockReturnValueOnce("gh-token-value");
    (getInput as jest.Mock).mockReturnValueOnce("label-value");
    (context as any).payload.pull_request = undefined;

    // Run the function
    await run();

    // Assertions
    expect(setFailed).toHaveBeenCalledWith(
      "This action can only be run on Pull Requests"
    );
  });

  it("should add label to the pull request", async () => {
    // Mock the return values for getInput
    (getInput as jest.Mock).mockReturnValueOnce("gh-token-value");
    (getInput as jest.Mock).mockReturnValueOnce("label-value");
    (context as any).payload.pull_request = {
      number: 1,
    };

    // Mock the Octokit instance and the addLabels method
    const mockAddLabels = jest.fn();
    const mockOctokit = {
      rest: {
        issues: {
          addLabels: mockAddLabels,
        },
      },
    };
    (getOctokit as jest.Mock).mockReturnValueOnce(mockOctokit);

    // Run the function
    await run();

    // Assertions
    expect(getInput).toHaveBeenCalledWith("gh-token");
    expect(getInput).toHaveBeenCalledWith("label");
    expect(getOctokit).toHaveBeenCalledWith("gh-token-value");
    expect(mockAddLabels).toHaveBeenCalledWith({
      owner: "owner",
      repo: "repo",
      issue_number: 1,
      labels: ["label-value"],
    });
    expect(setFailed).not.toHaveBeenCalled();
  });

  it("should handle error and set failed", async () => {
    // Mock the return values for getInput
    (getInput as jest.Mock).mockReturnValueOnce("gh-token-value");
    (getInput as jest.Mock).mockReturnValueOnce("label-value");
    (context as any).payload.pull_request = {
      number: 1,
    };

    // Mock the Octokit instance and throw an error in addLabels
    const mockAddLabels = jest
      .fn()
      .mockRejectedValueOnce(new Error("Test error"));
    const mockOctokit = {
      rest: {
        issues: {
          addLabels: mockAddLabels,
        },
      },
    };
    (getOctokit as jest.Mock).mockReturnValueOnce(mockOctokit);

    // Run the function
    await run();

    // Assertions
    expect(getInput).toHaveBeenCalledWith("gh-token");
    expect(getInput).toHaveBeenCalledWith("label");
    expect(getOctokit).toHaveBeenCalledWith("gh-token-value");
    expect(mockAddLabels).toHaveBeenCalledWith({
      owner: "owner",
      repo: "repo",
      issue_number: 1,
      labels: ["label-value"],
    });
    expect(setFailed).toHaveBeenCalledWith("Test error");
  });
});
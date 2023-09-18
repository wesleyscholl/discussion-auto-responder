import { run } from '../index';
import { getInput, setFailed } from '@actions/core';
import { Octokit } from '@octokit/action';

jest.mock('@actions/core');
jest.mock('@octokit/action');

describe('run', () => {
  let getInputMock: jest.Mock;
  let octokitMock: jest.Mock;
  let eventPayloadMock: jest.Mock;

  beforeEach(() => {
    getInputMock = jest.fn();
    octokitMock = jest.fn();
    eventPayloadMock = jest.fn();

    getInputMock.mockReturnValue('GITHUB_TOKEN');
    octokitMock.mockImplementation(() => {
      return {
        graphql: jest.fn(),
      };
    });
    eventPayloadMock.mockReturnValue({
      discussion: {
        node_id: '1234567890',
      },
    });
  });

  it('should add a comment to the discussion', async () => {
    const commentBody = 'This is a comment.';

    getInputMock.mockReturnValueOnce('comment_body');

    await run();

    expect(octokitMock).toHaveBeenCalledWith('GITHUB_TOKEN');
    expect(octokitMock.mock.instances[0].graphql).toHaveBeenCalledWith(
      `
      mutation {
        addDiscussionComment(
          input: {body: "${commentBody}", discussionId: "1234567890", clientMutationId: "1234"}
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
  });

  it('should fail if there is an error adding the comment', async () => {
    const error = new Error('Failed to add comment.');

    octokitMock.mockImplementationOnce(() => {
      return {
        graphql: jest.fn().mockRejectedValue(error),
      };
    });

    await run();

    expect(setFailed).toHaveBeenCalledWith(error.message);
  });
});
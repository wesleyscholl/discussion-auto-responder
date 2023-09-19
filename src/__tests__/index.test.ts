import { run } from '../index';
import { getInput, setFailed } from '@actions/core';
import { Octokit } from '@octokit/action';

const eventPayload = {
  discussion: {
    node_id: '1234567890',
  },
};

jest.mock('@actions/core');
jest.mock('@octokit/action');

describe('run', () => {
  let getInputMock: jest.Mock;
  let octokitMock: jest.Mock;

  beforeEach(() => {
    getInputMock = jest.fn();
    octokitMock = jest.fn();

    getInputMock.mockReturnValue('GITHUB_TOKEN');
    octokitMock.mockImplementation(() => {
      return {
        graphql: jest.fn(),
      };
    });
  });

  it('should add a comment to the discussion', async () => {
    const commentBody = 'This comment was generated by the Discussion Auto Responder';

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
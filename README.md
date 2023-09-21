# Discussion Autoresponder

Respond to New Discussions with a Preset Comment or Welcome Message

[![Tests](https://img.shields.io/badge/tests-passing-gree.svg?logo=typescript&colorA=24292e&logoColor=white)](https://github.com/wesleyscholl/discussion-auto-responder/blob/main/src/__tests__/index.test.ts)  ![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/wesleyscholl/discussion-auto-responder/.github%2Fworkflows%2Fnode.js.yml?colorA=24292e&logo=github)  [![coverage badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/wesleyscholl/10f0b77400703c4a65f38434106adf2d/raw/aee6dc5c13c440ca5606fa0081512251a01e9ffd/discussion-auto-responder__heads_main.json?&colorA=24292e&label=test%20coverage)](https://gist.github.com/wesleyscholl/10f0b77400703c4a65f38434106adf2d)  [![GitHub Marketplace](https://img.shields.io/badge/marketplace-Discussion%20Auto%20Responder-blue.svg?colorA=24292e&colorB=7F00FF&style=flat&longCache=true&logo=githubactions&logoColor=white)](https://github.com/marketplace/actions/discussion-auto-responder) ![GitHub package.json dynamic](https://img.shields.io/github/package-json/name/wesleyscholl/discussion-auto-responder?colorA=24292e&colorB=7F00FF&logo=github) ![Dynamic YAML Badge](https://img.shields.io/badge/dynamic/yaml?url=https%3A%2F%2Fraw.githubusercontent.com%2Fwesleyscholl%2Fdiscussion-auto-responder%2Fmain%2F.github%2Fworkflows%2Frespond.yml&query=%24.jobs.autorespond.name&colorA=24292e&colorB=7F00FF&logo=yaml&label=description) [![Code Style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?logo=prettier&colorA=24292e&logoColor=white&colorB=7F00FF)](https://github.com/prettier/prettier) ![GitHub top language](https://img.shields.io/github/languages/top/wesleyscholl/discussion-auto-responder?colorA=24292e&colorB=7F00FF&logo=typescript&logoColor=white) ![GitHub contributors](https://img.shields.io/github/contributors/wesleyscholl/discussion-auto-responder?colorA=24292e&colorB=7F00FF&logo=github&logoColor=white) ![GitHub Release (with filter)](https://img.shields.io/github/v/release/wesleyscholl/discussion-auto-responder?colorA=24292e&colorB=7F00FF&logo=github)  ![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/wesleyscholl/discussion-auto-responder?colorA=24292e&colorB=7F00FF&logo=github) [![MIT](https://img.shields.io/badge/license-MIT-blue?colorA=24292e&colorB=7F00FF&logo=github)](https://raw.githubusercontent.com/wesleyscholl/discussion-auto-responder/main/LICENSE)








## About

Discussion Autoresponder allows you to automatically create comments on new GitHub Discussions with a GitHub Action. This could be used to post a welcome comment, a message for responding back soon, and other use cases. 


## Usage

In your workflow, to create a new discussion autoresponder for new discussion topics, include a step like this:


```yaml
- name: Run discussion-auto-responder
  uses: wesleyscholl/discussion-auto-responder@v1.0.x
  id: autoresponder-comment
  with:
   GITHUB_TOKEN: "${{ secrets.PAT_TOKEN }}" # Required, the minimum required: "${{ secrets.GITHUB_TOKEN }}"  
   comment_body: "This comment was generated by the Discussion Autoresponder GitHub Action." # Also optional, this is the default message.
   delay_seconds: 10000 # Written in milliseconds (ms), default 15000 -> 15 seconds.        
       
```


## Requirements

To run this action, the Action Workflow permissions require read and write permissions in the repository for all scopes. 

- To configure this, go to:

**-> Repository Settings
-> Actions
-> General
-> Workflow Permissions**

- Then select: "Read and write permissions - Workflows have read and write permissions in the repository for all scopes."
- Finally click the save button.


## Config Screenshot
<br>
<img width="1118" alt="Screenshot 2023-09-19 at 4 37 29 PM" src="https://github.com/wesleyscholl/discussion-auto-responder/assets/128409641/5fd335d8-e57c-4482-952c-210009a5508a">


## Action Inputs

| Name | Description | Requried? | Default |
| --- | --- | --- | --- |
| `GITHUB_TOKEN` | A GitHub PAT is required, but the default is sufficient for public repos. For private repos, ensure you create a PAT that has `discussion: write` and `repo: write`, then store it as an action secret for usage within the workflow. See more details about tokens here. [PAT](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token). | **Yes** | `${{ secrets.GITHUB_TOKEN }}` | 
| `comment_body` | The contents of the autoresponder comment in string format. | **No** | `"This comment was generated by the Discussion Autoresponder GitHub Action."` |
| `delay_seconds` | Amount of delay time before the autoresponder comment is posted. Written in milliseconds (ms) | **No** | `1500` |



## Action Outputs

| Name | Description | How To Access |
| --- | --- | --- |
| `discussionId` | The node id of the discussion where the autoresponder comment was posted. | `${{ steps.<your-step>.outputs.discussionId }}` |
| `commentId` | The comment id posted in the discussion. | `${{ steps.<your-step>.outputs.commentId }}` |
| `commentBody` | The body of the comment posted. | `${{ steps.<your-step>.outputs.commentBody }}` |
| `clientMutationId` | The unique GraphQL client id. | `${{ steps.<your-step>.outputs.clientMutationId }}` |



#### Example Usage To Access Outputs 
```yml
- name: Show Output
  run: |
    echo "discussionId = ${{ steps.autorespond.outputs.discussionId }}"
    echo "commentId = ${{ steps.autorespond.outputs.commentId }}"
    echo "commentBody = ${{ steps.autorespond.outputs.commentBody }}"
    echo "clientMutationId = ${{ steps.autorespond.outputs.clientMutationId }}"
```




## Example

Example [workflow](https://github.com/wesleyscholl/discussion-auto-responder/blob/main/.github/workflows/respond.yml) can be found here.



## Credits

- [Create and Publish a GitHub Action in Typescript - Leonardo Montini](https://leonardomontini.dev/typescript-github-action)

### Inspired by:
- [peter-evans/create-or-update-comment](https://github.com/peter-evans/create-or-update-comment)
- [abirismyname/create-discussion](https://github.com/abirismyname/create-discussion)

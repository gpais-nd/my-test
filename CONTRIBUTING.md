## Purpose

This documentation outlines the process of contributing to this repository for developers across the organization.

## Project Vision

[Write or link to a Wiki documentation describing the vision of the project, to help developers contributing the project have context and purpose.]

## Coding Conventions to Follow

[Outline any coding conventions developers should follow when contributing to the code base]

## How to Contribute

To contribute to the project follow the steps outlined below:

### Start with a GitHub Issue

- All changes start with a GitHub issue. GitHub issues will be used to review changes before any associated Pull Request has been open. No changes should be accepted unless a GitHub issue is approved. The following GitHub issues are supported:

  - Bug: Used to report and fix any bugs found in the code base. Bug template will require certain information to be provided such as steps to product, environment, etc.
  - Feature: Used for adding any feature enhancements to the code base prior to opening a Pull Request. Feature template will require the purpose of the change, scope and impact.
  - Proposal: Used to outline and request a change without any associated Pull Request. This will be primarily used for having discussions, or proposing any ideas about the current project.

- GitHub issues require following a template; different issue-types may use different templates.

- GitHub issues will have the following labels:

  - Pending Review - Default label once issue is created.
  - In Review - Label applied when maintainer is reviewing the issue.
  - Approved - Label applied when issue is approved by maintainer.
  - Rejected - Label applied when issue is rejected by the maintainer. Any associated PR should not be approved.

- GitHub issues should be `approved by the maintainers` before any associated Pull Request can be merged.

- GitHub issues will be closed once the associated Pull Request have been merged.

### Submit a Pull Request

- All Pull Requests should have an associated GitHub Issue that is `approved` before any Pull Request can be submitted and merged.

- Create a feature branch off of the main trunk development branch, `[branch name]`. The feature branch should follow the naming convention: `[initials]/[short-description-of-branch]`.

- When ready create a Pull request to merge your branch based off the main development trunk.

- Make sure all service checks are passed before assigning the PR for review. (i.e. CI pipeline)

- When ready, assign the maintainer group `[Enter your Maintainer's GitHub Team]` to review.

## Deployment

[Define how projects will be build and deployed via the delivery pipeline.]

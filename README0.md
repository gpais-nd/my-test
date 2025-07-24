# Galaxy UI / Lifecycle UI

The UI for new mail campaign manager. It has http2.

## Node Version

Please check Dockerfile for the latest node version of this project, currently it is 16.14.2

## How to Run Application

Navigate to root of project and run
`yarn` to install all react and express npm dependencies. `yarn start` will run react on http://localhost:3000 and express on http://localhost:3001, both with hotloading. React envs are saved in repository under `apps/mcm-ui/.env.local`, while express envs you need to find in vault and save in a `.env` file under `services/mcm-api`.

## Adding npms

`yarn add <name-of-npm>` under the root of the specific project, e.g. `services/mcm-api` or `apps/mcm-ui`.

## Playground for GraphQL API

Go to https://studio.apollographql.com/sandbox/explorer
<br /> Then put http://localhost:3001/gqlapi in the text input at top left.

## Launch Darkly

https://login.hulu.com/launchdarkly

Our namespace is `mcm`. For local development, please use the Test_local environment. The following defines the mapping between Launch Darkly environments and overall mcm environments.

Local Development - Local_test<br>
Development - Develop_test<br>
Staging - Staging<br>
Production - Production<br><br>
E2E Tests - Test (if needed)

## Terraform

https://terraform.prod.hulu.com/app/Hulu/workspaces?search=mcm

Our terraform code is located at `/terraform` folder at root of project. There are two environments currently, a `non-prod` and `prod`, which matches to our two aws accounts, which are named similarly `cp3-non-prod` and `cp3-prod`. This code is responsible for making our s3 buckets, postgres database, and iam policies.

## Mariner

https://devx.prod.hulu.com/mariner/tool/mcm
https://spinnaker.prod.hulu.com/#/applications/mcm

The mcm app webserver and webapp's infrastructure are not created via terraform. We use an internal Hulu app called Mariner, which is a wrapper around AWS EKS -- kubernetes. A `build.yaml` file at the root of the project defines which Dockerfiles get built for which branches, and the produced docker images are saved in an artifactory repository. We have a separate service, Spinnaker, which can listen to artifactory and make deployments, essentially our CI/CD. Spinnaker works by using helm charts to configure how the produced artifactory image is configured and ran and also its k8s configuration (memory, # of pods, ssl, etc.). We generally start with a template that Hulu provides -- https://github.prod.hulu.com/AppPipelines/app-platform-templates -- and then modify as needed. Our spinnaker congif repository is located at https://github.prod.hulu.com/AppPipelines/mcm. Secrets (envs) are injected via vault. To find vault secrets, please use the devx link above and click on the approprate vault link -> click oidc -> login using Okta.

## Environment-specific Launch

https://github.prod.hulu.com/AppPipelines/mcm

## Project Structure

UI workspace: React component folder structure

```ini
ComponentName
├── components # Subcomponents folder. Optional
│   └── SubcomponentName # Subcomponent folder. Same structure as main component
├── controllers # Controllers folder. Optional
├── hooks # Hooks folder. Optional
├── index.tsx # Main component
└── styles.module.scss # Main component scoped styles. Optional
```

## Extra Documentation

Generic
- [Initial Setup](https://github.prod.hulu.com/DataPlatform/mcm/tree/develop/docs/intial-setup/README.md)
- [Deployments](https://github.prod.hulu.com/DataPlatform/mcm/tree/develop/docs/deployments/README.md)

Frontend

- [Contexts](https://github.prod.hulu.com/DataPlatform/mcm/tree/develop/apps/mcm-ui/docs/contexts/README.md)
- [Forms](https://github.prod.hulu.com/DataPlatform/mcm/tree/develop/apps/mcm-ui/docs/forms/README.md)
- [Styling & Theme](https://github.prod.hulu.com/DataPlatform/mcm/tree/develop/apps/mcm-ui/docs/styling/README.md)

Backend

- [Database](https://github.prod.hulu.com/DataPlatform/mcm/tree/develop/services/mcm-api/docs/db/README.md)
- [GraphQL](https://github.prod.hulu.com/DataPlatform/mcm/tree/develop/services/mcm-api/docs/graphql/README.md)

# Graph QL API

We are using GraphQL to build our API Endpoints, if you need some heads-up on how to use it head over to [their docs](https://graphql.org/code/#javascript)

## Building a new route

To build a new route follow the following steps

### 1- Create the resolver

Head over to `src/gql/resolvers` and create a new folder (if none of the existing works
for you), inside it create a folder named `controllers` and write the function that returns the
data you want to serve.

For example

```typescript
// src/gql/resolvers/example/controllers/index.ts

export const getUsers = async () => {
  try {
    const response = await db
      .select('name', 'email') // column aliases
      .from<Users[]>('users'); // table

    return response;
  } catch (error) {
    logger.error('Query getUsers', error);
    return error;
  }
};
```

### 2- Expose the resolver to GraphQL

Head over to `src/gql/resolvers/example` and create a new file called `index.ts`, inside it you need to export an object with two properties:

- [Queries](https://graphql.org/learn/queries)
- [Mutation](https://graphql.org/learn/queries/)

For example

```typescript
// src/gql/resolvers/example/index.ts

import {getUsers} from './controllers';

export const resolvers = {
  Query: {
    users: async (/* _parent: null, _args: {}, _context: {}, _info: null */) =>
      await getUsers(),
  },
  Mutation: {},
};

export default resolvers;
```

### 3- Create TypeDefinition

Head over to `src/gql/typeDefinitions` and create a new folder with the same name you
used for the one under `src/gql/resolvers`, then create an `index.ts` file and inside it you must return
a GraphQL type definition.

Here we are going to create a `User` type with the properties `name` and `email` because that's what our resolver is returning
from the database (see step 1)

For example

```typescript
// src/gql/typeDefinitions/example/index.ts

import {gql} from 'apollo-server-express';

export const typeDefs = gql`
  type Users {
    name: String!
    email: String!
  }

  type Query {
    users: [Users!]!
  }
`;

export default typeDefs;
```

**NOTE:** The `!` sign next to a graphql type/input indicates that a property is required, if not provided the query will fail.

### 4- Import the resolver and type definition just created and combine them

Head over to `src/gql/index.ts` and combine your new resolver and type definition with the existing ones.

For example

```typescript
// src/gql/index.ts

import exampleTypeDefs from './typeDefinitions/example';
import exampleResolvers from './resolvers/example';

const combinedTypeDefinitions = [
  ...,
  exampleTypeDefs
];

const combinedResolvers = {
  ...,
  Query: {
    ...,
    exampleResolvers.Query,
  },
  Mutation: {
    ...,
    ...exampleResolvers.Mutation,
  },
};

export const typeDefs = combinedTypeDefinitions;
export const resolvers = combinedResolvers;

```

## Debugging

Once you create a new route you should test if everything is working as expected, to do so head over to
[GraphQL Sandbox](https://studio.apollographql.com/sandbox/explorer) while running the project

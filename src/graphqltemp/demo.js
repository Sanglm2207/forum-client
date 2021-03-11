import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        dog(_, { args, toReference }) {
          return toReference({
            __typename: "Dog",
            id: args.id,
          });
        },
      },
    },
  },
});

// @client
// useQuery => loading, error, data : data will be cached
// useQuery the first will be cached, the next will return from caches

// Update cache
// 1. Polling, may useful in some situations
// 2. Refetching a good choice for most of situations

// useLazyQuery

// fetchPolicy:
// cache-first
// cache-only
// chache-and-network: both query and then update the data automatically
// network-only
// no-cache: query's result is not stored in the cache


// NOTES: udpateQuery
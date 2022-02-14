import React from 'react';
import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  split,
} from '@apollo/client';
import { useMemo } from 'react';
import type { NextApiRequest, NextApiResponse } from 'next'
import { HttpLink } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';


export interface GraphQlContext {
  req: NextApiRequest;
  res: NextApiResponse;
}

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;
console.log(`starting with internal server hostname ${process.env['INTERNAL_SERVER_HOSTNAME'] ?? 'server'}`)

const wsLink = typeof window !== 'undefined' ? new WebSocketLink({
  uri: `ws://${process.env['EXTERNAL_SERVER_HOSTNAME'] ?? 'localhost'}/subscriptions`,
  options: {
    reconnect: true
  }
}) : undefined;

const internalHttpLink = new HttpLink({
  uri: `http://${process.env['INTERNAL_SERVER_HOSTNAME'] ?? 'server'}:3001/graphql`
});

const externalHttpLink = new HttpLink({
  uri: `http://${process.env['EXTERNAL_SERVER_HOSTNAME'] ?? 'localhost'}:3001/graphql`
});

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink ?? externalHttpLink,
  split(
    () => typeof window === 'undefined',
    internalHttpLink,
    externalHttpLink,
  ),
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createApolloClient(context?: GraphQlContext): ApolloClient<any> {
  return new ApolloClient({
    /**
     * Enable SSR mode when not running on the client-side
     */
    ssrMode: typeof window === 'undefined',
    link: splitLink,
    cache: new InMemoryCache(),
  });
}

export function initializeApollo(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialState: any = null,
  // Pages with Next.js data fetching methods, like `getStaticProps`, can send
  // a custom context which will be used by `SchemaLink` to server render pages
  context?: GraphQlContext
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): ApolloClient<any> {
  
  const _apolloClient = apolloClient ?? createApolloClient(context);

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // get hydrated here
  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }

  /**
   * SSG and SSR
   * Always create a new Apollo Client
   */
  if (typeof window === 'undefined') {
    return _apolloClient;
  }

  // Create the Apollo Client once in the client
  apolloClient = apolloClient ?? _apolloClient;

  return apolloClient;
}

export const getApolloClient = initializeApollo;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useApollo(initialState: any) {
  const apolloStore = useMemo(() => initializeApollo(initialState), [
    initialState,
  ]);
  return apolloStore;
}


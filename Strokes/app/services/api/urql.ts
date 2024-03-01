// src/urqlClient.tsx
import { createClient, dedupExchange, fetchExchange, Provider } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';
import { authExchange } from '@urql/exchange-auth';

// Simulate retrieving the idToken from storage or state management
const getIdToken = async () => {
  // Retrieve and return the idToken
  // Example: return await AsyncStorage.getItem('idToken');
  return 'your_id_token_here'; // Replace with actual token retrieval logic
};

// Configuring the authExchange for use with urql
const authConfig = {
  addAuthToOperation: ({ authState, operation }) => {
    if (!authState || !authState.token) {
      return operation;
    }

    // fetchOptions can be a function (See Client API) but you can simplify this based on usage
    const fetchOptions =
      typeof operation.context.fetchOptions === 'function'
        ? operation.context.fetchOptions()
        : operation.context.fetchOptions || {};

    return {
      ...operation,
      context: {
        ...operation.context,
        fetchOptions: {
          ...fetchOptions,
          headers: {
            ...fetchOptions.headers,
            "Authorization": authState.token,
          },
        },
      },
    };
  },
  willAuthError: ({ authState }) => {
    if (!authState) return true;
    // optionally check if token is expired
    return false;
  },
  getAuth: async ({ authState }) => {
    if (!authState) {
      const token = await getIdToken();
      if (token) {
        return { token: `Bearer ${token}` };
      }
      return null;
    }
    return null; // return null when the refresh logic fails
  },
};

export const urqlclient = createClient({
  url: process.env.React_App_UriUploadRemote, // Replace with your GraphQL endpoint
  exchanges: [
    dedupExchange,
    cacheExchange,
    authExchange(authConfig), // Configure the auth exchange using the provided config
    fetchExchange,
  ],
});

export const UrqlProvider = ({ children }) => (
  <Provider value={client}>{children}</Provider>
);


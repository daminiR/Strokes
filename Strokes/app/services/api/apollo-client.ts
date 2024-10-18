import {ApolloClient, InMemoryCache, createHttpLink} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import {createUploadLink} from 'apollo-upload-client'; // Import createUploadLink

export const uploadLink = createUploadLink({
  uri: process.env.React_App_UriUploadRemote_1, // Your GraphQL endpoint
});

export const publicClient = new ApolloClient({
  link: uploadLink,
  cache: new InMemoryCache(),
});

// Function to create authenticated Apollo Client
export const createAuthenticatedClient = (idToken: string) => {
  const authLink = setContext((_, {headers}) => ({
    headers: {
      ...headers,
      authorization: idToken ? `Bearer ${idToken}` : '',
    },
  }));

  return new ApolloClient({
    link: authLink.concat(uploadLink), // Combine the authenticated link with httpLink
    cache: new InMemoryCache(), // Optionally use a shared cache if needed
  });
};

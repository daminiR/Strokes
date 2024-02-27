import { ApolloClient, HttpLink, InMemoryCache, ApolloLink } from '@apollo/client';
import { setContext } from 'apollo-link-context';

const httpLink = new HttpLink({
  uri: process.env.React_App_UriUploadRemote, // Replace with your GraphQL endpoint
});

// Simulate retrieving the idToken from storage or state management
const getIdToken = async () => {
  // Retrieve and return the idToken
  // Example: return await AsyncStorage.getItem('idToken');
  return 'your_id_token_here'; // Replace with actual token retrieval logic
};

const authLink: ApolloLink = setContext(async (_, { headers }) => {
  const token = await getIdToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink), // Chain the auth link with the http link
  cache: new InMemoryCache(),
});

export default client;


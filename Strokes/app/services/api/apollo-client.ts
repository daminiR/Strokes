import { ApolloClient, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { createUploadLink } from 'apollo-upload-client'; // Import createUploadLink

// Replace HttpLink with createUploadLink for file upload support
const uploadLink = createUploadLink({
  uri: process.env.React_App_UriUploadRemote, // Your GraphQL endpoint
});

// Simulate retrieving the idToken from storage or state management
const getIdToken = async () => {
  // Retrieve and return the idToken
  // Example: return await AsyncStorage.getItem('idToken');
  return 'your_id_token_here'; // Replace with actual token retrieval logic
};

const authLink = setContext(async (_, { headers }) => {
  const token = await getIdToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(uploadLink), // Use authLink with uploadLink
  cache: new InMemoryCache(),
});

export default client;


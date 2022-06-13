import { ApolloClient } from '@apollo/client'
import { cache } from '../../cache'
import  { createUploadLink } from 'apollo-upload-client';
import { setContext } from '@apollo/client/link/context'
import  _ from 'lodash'
import {getAWSUser} from '@utils';

const initializeClient = async () => {
  const uri_upload = process.env.React_App_UriUploadRemote;
  const uploadLink = createUploadLink({
    uri: uri_upload,
  });
  var token = null;
  var idToken = null;
  return await new Promise((resolve, reject) => {
    getAWSUser()
      .then((args) => {
        if (args) {
          if (args) {
            token = args.session.getAccessToken().getJwtToken();
            idToken = args.session.getIdToken().getJwtToken();
            console.log('id from client', idToken);
            //setCurrentUser(args.attributes);
          }
        }
        const authLink = setContext((_, {headers}) => {
          return {
            headers: {
              ...headers,
              authorization: idToken ? `Bearer ${idToken}` : '',
            },
          };
        });
        var apolloClient = new ApolloClient({
          link: authLink.concat(uploadLink),
          cache: cache,
        });
        resolve(apolloClient);
        //setClient(apolloClient);
      })
      .catch((err) => {
        console.log('getAWS Error');
        console.log(err);
        reject(null);
      });
  }
                          )
};
export {initializeClient}

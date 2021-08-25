import { printAST, HTTPFetchNetworkInterface } from '@apollo/client'
import RNFetchBlob from 'rn-fetch-blob'
import { lookup } from 'mime-types'
import _ from 'lodash'
const path = require('path')

export default function createNetworkInterface (opts) {
  const { uri } = opts
  //return new UploadNetworkInterface(uri, opts)
}

// This logic should strip out any graphql args for the file upload and then create an array to send as multi-part form.
// See here: https://github.com/wkh237/react-native-fetch-blob
export class UploadNetworkInterface extends HTTPFetchNetworkInterface {
}
  // This main function will convert the request to a multi-part form fetch if the variables are set to do so.
  // If the vars aren't set it will just use default logi.
  //fetchFromRemoteEndpoint (req) {
    //if (this.isUpload(req)) {
      //return this.performUploadMutation(req)
    //}
    //return super.fetchFromRemoteEndpoint(req)
  //}
  //// Convert the request to a multi-part form array for react-native-fetch-blob
  //getFormData ({ request }, query) {
    //return [
      //{
        //name: 'operationName',
        //data: request.operationName
      //},
      //{
        //// Strip out the filename from the vars being passed into the graphql query.
        //name: 'variables',
        //data: JSON.stringify(_.omit(request.variables, [request.variables.uploadFileAsForm, request.variables.file]))
      //},
      //{
        //// Tag the arg as 'file'
        //name: 'file',
        //// Get the mime type from the file path
        //type: lookup(request.variables.file),
        //// Get the actual file name
        //filename: path.basename(request.variables.file),
        //// wrap the file into the request obj
        //data: RNFetchBlob.wrap(request.variables.file)
      //},
      //{
        //name: 'query',
        //data: query
      //}
    //]
  //}
  //// This checks to see if the vars specify this should be treated as a file upload.
  //// Setting a variable "uploadFileAsForm" to true will trigger the logic.
  //isUpload ({ request }) {
    //if (request.variables) {
      //for (let key in request.variables) {
        //if (key === 'uploadFileAsForm' && request.variables[key] === true) {
          //return true
        //}
      //}
    //}
    //return false
  //}

  //// Make the fetch
  //// Make the fetch
  //performUploadMutation (req) {
    //const query = printAST(req.request.query)
    //const data = this.getFormData(req, query)

    //return RNFetchBlob.fetch('POST', this._uri, {
      //'Content-Type': 'multipart/form-data',
      //'Accept': '*/*'
    //}, data).then((blobResponse) => {
      //return new Response(blobResponse.data)
    //})
  //}
//}

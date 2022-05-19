//import { sanitizeFile } from '../utils/fileNaming'
//import * as path from 'path';
//import _ from 'lodash'
//import { dest_gcs_images } from '../constants/'
//import {Data, DisplayData } from '../types/Squash'

//const creatGCUpload = (image_set, _id) => {
      //const promise = Promise.all(
        //image_set.map(async (image) => {
          //return new Promise(async (resolve, reject) => {
            //const {
              //filename,
              //mimetype,
              //encoding,
              //createReadStream,
            //} = await image.file;
            //const sanitizedFilename = sanitizeFile(filename, _id);
            //const fileLocation =  path.join(dest_gcs_images, _id, sanitizedFilename)
            //console.log(fileLocation)
            //const gcFile = acsport1.file(
                //fileLocation
            //);
            //let data: Data;
            //let displayData: DisplayData = {
              //imageURL: "",
              //filePath: "",
            //};
            //createReadStream().pipe(
              //gcFile
                //.createWriteStream()
                //.on("finish", () => {
                  //gcFile.makePublic();
                  //data = {
                    //img_idx: image.img_idx,
                    //imageURL: `https://storage.googleapis.com/acsport1/${fileLocation}`,
                    //filePath: `${fileLocation}`,
                  //};
                  //displayData = {
                    //imageURL: `https://storage.googleapis.com/acsport1/${fileLocation}`,
                    //filePath: `${fileLocation}`,
                  //};
                  //console.log("done");
                  //resolve(data);

                //})
                //.on("error", (error) => {
                  //console.log("error");
                  //console.log(error);
                  //reject();
                //})
            //);
          //});
        //})
      //)
      //return promise
//}
//const deleteAllUserImages = async (image_set) => {
  //// remove from gc AND mongdb
  //await new Promise<void>((resolve, reject) => {
    //try {
      //image_set.map(async (imageObj) => {
        //console.log("imageObj", imageObj.filePath)
        //await deleteFromGC(imageObj.filePath);
      //});
      //resolve();
    //} catch {
      //reject();
    //}
  //});
//};
//const deleteFilesFromGC = async (files_to_del, original_uploaded_image_set, add_local_images_length) => {
  //// remove from gc AND mongdb
  //// remove from mongoDb
  //// ote sure about wehen one image is left check again
  //console.log("where does it go");
  //if (original_uploaded_image_set.length - files_to_del.length + add_local_images_length >= 1) {
    //const img_idx_del = files_to_del.map((imgObj) => imgObj.img_idx);
    //const filtered_array = original_uploaded_image_set.filter(
      //(imgObj) => !img_idx_del.includes(imgObj.img_idx)
    //);
    //console.log("check filtered again", filtered_array);
    //files_to_del.map(async (file_to_del) => {
      //await deleteFromGC(file_to_del.filePath);
    //});
    //return filtered_array;
  //}
  //else{
    //return original_uploaded_image_set

  //}
//};
//const deleteFromGC = async (file_to_del: string) => {
       //await acsport1.file(file_to_del).delete().then(
        //() => {
            //console.log(`file ${file_to_del} deleted`)
        //}
       //)
       //.catch(error => {
            //console.log(error)
        //})
//}
 //export {deleteAllUserImages, deleteFromGC, deleteFilesFromGC, creatGCUpload}

import { sanitizeFile } from '../utils/fileNaming'
import * as path from 'path';
import _ from 'lodash'
import { dest_gcs_images } from '../constants/'
import {Data, DisplayData } from '../types/Squash'
import AWS from 'aws-sdk'
import stream from 'stream'

const s3 = new AWS.S3({region: 'us-east-1'});
const uploadStream = ({ Bucket, Key, encoding, mimetype}) => {
  //const s3 = new AWS.S3({region: 'us-east-1'});
  const pass = new stream.PassThrough();
  return {
    writeStream: pass,
    promise: s3
      .upload(
        {
          Bucket: Bucket,
          Key: Key,
          Body: pass,
          ContentType: mimetype,
          ContentEncoding: encoding,
          //ContentEncoding: 'base64',
        }
      )
      .promise()
  };
}

// TODO: error shows before uplaod complete but uplaod works some async problem
const createAWSUpload = (image_set, _id) => {
      const promise = Promise.all(
        image_set.map(async (image) => {
          return new Promise(async (resolve, reject) => {
            const {
              filename,
              mimetype,
              encoding,
              createReadStream,
            } = await image.file;
            const sanitizedFilename = sanitizeFile(filename, _id);
            const fileLocation = path.join(
              dest_gcs_images,
              _id,
              sanitizedFilename.concat('.jpeg')
            );
            console.log("fileLoaction:", fileLocation);
            let data: Data;
            let displayData: DisplayData = {
              imageURL: "",
              filePath: "",
            };
            const { writeStream, promise } = uploadStream({
              Bucket: "sport-aws-images",
              Key: fileLocation,
              encoding: encoding,
              mimetype: mimetype,
            });
            const pipeline = createReadStream().pipe(writeStream);
            promise
              .then((awsMetaData) => {
                data = {
                  img_idx: image.img_idx,
                  imageURL: awsMetaData.Location,
                  filePath: `${fileLocation}`,
                };
                displayData = {
                  imageURL: awsMetaData.Location,
                  filePath: `${fileLocation}`,
                };
                console.log("upload completed successfully");
                resolve(data);
                console.log("done");
                console.log("upload completed successfully");
              })
              .catch((err) => {
                console.log("upload failed.", err.message);
                reject()
              });
            createReadStream().unpipe();
          });
        })
      )
      return promise
}
const deleteAllUserImages = async (image_set) => {
  // remove from gc AND mongdb
  await new Promise<void>((resolve, reject) => {
    try {
      image_set.map(async (imageObj) => {
        console.log("imageObj", imageObj.filePath)
      });
      resolve();
    } catch {
      reject();
    }
  });
};

const deleteAWSObjects = async({ Bucket, keys }) => {
  const obj = keys.map(key => {return {Key: key.filePath}});
  console.log(obj)
  const options = {
    Bucket: Bucket,
    Delete: {
        Objects: obj,
    }
  }
  try {
    await s3.deleteObjects(options,function(err,data){
        if (err)    console.log(err,err.stack);
        else        console.log("Response:",data);
    }).promise();
} catch (e) {}

}
const deleteFilesFromAWS = async (files_to_del, original_uploaded_image_set, add_local_images_length) => {
  if (original_uploaded_image_set.length - files_to_del.length + add_local_images_length >= 1) {
    const img_idx_del = files_to_del.map((imgObj) => imgObj.img_idx);
    const filtered_array = original_uploaded_image_set.filter(
      (imgObj) => !img_idx_del.includes(imgObj.img_idx)
    );
    await deleteAWSObjects({
      Bucket: "sport-aws-images",
      keys: files_to_del,
    })
    return filtered_array;
  }
  else{
    return original_uploaded_image_set

  }
};
 export {deleteAllUserImages, deleteFilesFromAWS, createAWSUpload}

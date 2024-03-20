import { sanitizeFile } from '../utils/fileNaming'
import * as path from 'path';
import _ from 'lodash'
import { dest_gcs_images } from '../constants/'
import {Data, DisplayData } from '../types/Squash'
import AWS from 'aws-sdk'
import stream from 'stream'

const s3 = new AWS.S3({region: 'us-east-1'});
const uploadStream = ({ Bucket, Key, encoding, mimetype, img_idx}) => {
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
          Metadata: {
            img_idx: img_idx.toString(), // User-defined metadata

          },
        },
        {
          partSize: 10 * 1024 * 1024,
          queueSize: 5,
        }
      )
      .promise(),
  };
}

const destinationBucket = 'sport-aws-images'; // Your AWS S3 Bucket
const destinationBasePath = dest_gcs_images

async function createAWSUpload(imageSet, uniqueId) {
  try {
    const uploadResults = await Promise.all(
      imageSet.map(async ({ReactNativeFile: image, img_idx: img_idx}) => {
        // Destructuring directly from the awaited image.file promise

        const { filename, mimetype, encoding, createReadStream } = await image;

        const sanitizedFilename = sanitizeFile(filename, uniqueId);
        const fileKey = path.join(
          destinationBasePath,
          uniqueId,
          `${sanitizedFilename}.jpeg`
        );
        console.log("File location:", fileKey);
        try {
          const { writeStream, promise: uploadPromise } = uploadStream({
            Bucket: destinationBucket,
            Key: fileKey,
            mimetype,
            encoding, // Use the provided encoding
            img_idx: img_idx
          });

          // Pipe the stream from createReadStream to the writeStream for upload
          createReadStream().pipe(writeStream);
          const awsMetaData = await uploadPromise;
          console.log("Upload completed successfully:", fileKey);
          return {
            img_idx: img_idx,
            imageURL: awsMetaData.Location,
            filePath: fileKey,
          };
        } catch (error) {
          if (error instanceof Error) {
            console.error("Upload failed:", fileKey, error.message);
            throw new Error(`Upload failed for ${fileKey}: ${error.message}`);
          } else {
            // Handle the case where the error is not an Error instance
            console.error("Upload failed with an unknown error:", fileKey);
            throw new Error(
              `Upload failed for ${fileKey} with an unknown error`
            );
          }
        }
      })
    );

    return uploadResults;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error during AWS upload process:", error.message);
      throw new Error("Failed to complete AWS uploads");
    } else {
      console.error("Unknown Error during AWS upload process:");
      throw new Error("Failed to complete AWS uploads");
    }

  }
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


/**
 * Deletes multiple images from AWS S3.
 *
 * @param {Array} imageDataArray An array of image data objects containing the filePaths to be deleted.
 * @returns {Promise} A promise that resolves when the images are deleted.
 */
async function deleteImagesFromS3(imageDataArray) {
  const params = {
    Bucket: "sport-aws-images", // The name of your S3 bucket
    Delete: {
      Objects: imageDataArray.map((imageData) => ({ Key: imageData.filePath })),
      Quiet: false,
    },
  };
    try {
    const deleteResponse = await s3.deleteObjects(params).promise();
    console.log("Images deleted successfully:", deleteResponse.Deleted);
    return deleteResponse;
  } catch (error: unknown) {
    // Use a TypeScript type guard to safely check the error type
    if (error instanceof Error) {
      console.error("Failed to delete images:", error.message);
      throw new Error(`Failed to delete images from S3: ${error.message}`);
    } else {
      // Handle non-Error objects: log a generic message or perform other actions as needed
      console.error("An unexpected error occurred during the deletion process.");
      throw new Error('An unexpected error occurred during the deletion process.');
    }
  }

}


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
const deleteFilesFromAWS = async (
  files_to_del,
  original_uploaded_image_set,
  add_local_images_length
) => {
  if (
    original_uploaded_image_set.length -
      files_to_del.length +
      add_local_images_length >=
    1
  ) {
    const img_idx_del = files_to_del.map((imgObj) => imgObj.img_idx);
    const filtered_array = original_uploaded_image_set.filter(
      (imgObj) => !img_idx_del.includes(imgObj.img_idx)
    );
    await deleteAWSObjects({
      Bucket: "sport-aws-images",
      keys: files_to_del,
    });
    return filtered_array;
  } else {
    return original_uploaded_image_set;
  }
};
const manageImages = async (
  addLocalImages,
  removeUploadedImages,
  originalImages,
  _id
) => {
  const removed_image_set = await deleteFilesFromAWS(
    removeUploadedImages,
    originalImages,
    addLocalImages.length
  );
  const data_set = await createAWSUpload(addLocalImages, _id);
  const final_image_set = removed_image_set.concat(data_set);
  console.log("final", final_image_set)
  return final_image_set;
};

  export {manageImages, deleteAllUserImages, deleteFilesFromAWS, createAWSUpload, deleteImagesFromS3}

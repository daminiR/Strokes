import { sanitizeFile } from '../utils/fileNaming'
import * as path from 'path';
import _ from 'lodash'
import { dest_gcs_images } from '../constants/'
import {Data, DisplayData } from '../types/Squash'
import AWS from 'aws-sdk'
import stream from 'stream'

const s3 = new AWS.S3({ region: 'us-east-1' });
const destinationBucket = 'sport-aws-images'; // Your AWS S3 Bucket
const destinationBasePath = dest_gcs_images

// Function to facilitate stream-based uploading to AWS S3
/**
 * Creates a stream for uploading files to S3.
 * @param {Object} param0 Object containing bucket details and file information.
 * @returns {Object} Returns an object with the writable stream and a promise that resolves upon successful upload.
 */
const uploadStream = ({ Bucket, Key, Body, ContentType }) => {
  const pass = new stream.PassThrough();
  return {
    writeStream: pass,
    promise: s3.upload({
      Bucket,
      Key,
      Body: pass,
      ContentType,
    }).promise(),
  };
};

// Function to upload an array of images to AWS S3
/**
 * Uploads an array of images to AWS S3.
 * @param {Array} images Array of image objects to upload.
 * @param {String} uniqueId Unique identifier for the user to construct the file path.
 * @returns {Promise<Array>} A promise that resolves with the uploaded images' metadata.
 */

async function createAWSUpload(images, uniqueId) {
  return Promise.all(images.map(async (image) => {
    const { filename, mimetype, createReadStream } = await image;
    const sanitizedFilename = sanitizeFile(filename, uniqueId);
    const Key = `${destinationBasePath}/${uniqueId}/${sanitizedFilename}.jpeg`;

    try {
      const { writeStream, promise } = uploadStream({
        Bucket: destinationBucket,
        Key,
        Body: createReadStream(),
        ContentType: mimetype,
      });

      createReadStream().pipe(writeStream);
      const { Location } = await promise;

      console.log(`Upload successful: ${Location}`);
      return { imageURL: Location, filePath: Key };
    } catch (error) {
      console.error(`Upload error for file ${Key}:`, error);
      throw new Error(`Upload failed for ${Key}: ${error.message}`);
    }
  })).catch(error => {
    throw new Error(`AWS upload process failed: ${error.message}`);
  });
}


// Function to delete a specified list of images from AWS S3
/**
 * Deletes specified images from AWS S3.
 * @param {Array<Object>} imageDataArray Array of objects containing the 'filePath' of images to be deleted.
 * @returns {Promise<Array>} A promise that resolves with the details of deleted images.
 */
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
    Bucket: destinationBucket,
    Delete: { Objects: imageDataArray.map(({ filePath }) => ({ Key: filePath })) },
  };

  try {
    const { Deleted } = await s3.deleteObjects(params).promise();
    console.log("Deleted images:", Deleted);
    return Deleted;
  } catch (error) {
    console.error("Failed to delete images from S3:", error);
    throw new Error(`Deletion from S3 failed: ${error.message}`);
  }
}

/**
 * Asynchronously deletes a list of objects from an AWS S3 bucket.
 * This function maps an array of keys to the S3 deleteObjects operation format and
 * attempts to delete them. It logs the deletion response or any errors encountered.
 *
 * @param {Object} params - The parameters for deletion, including the bucket name and keys of objects.
 * @param {String} params.Bucket - The name of the S3 bucket from which objects are to be deleted.
 * @param {Array<Object>} params.keys - An array of objects, each containing the 'filePath' property
 *                                      which is used to construct the key for S3 deletion.
 *
 * Note: The 'filePath' should be the full S3 object key path (e.g., 'folder/subfolder/filename.ext')
 *       that uniquely identifies the file within the bucket.
 */

const deleteAWSObjects = async({ Bucket, keys }) => {
  // Map each filePath to the format expected by AWS S3 deleteObjects operation
  const obj = keys.map(key => ({ Key: key.filePath }));

  // Log the objects to be deleted for debugging purposes
  console.log("Objects to be deleted:", obj);

  // Construct the options object for the S3 deleteObjects method
  const options = {
    Bucket: Bucket, // The target S3 bucket
    Delete: {
      Objects: obj, // List of objects to delete
    },
  };

  try {
    // Perform the delete operation, awaiting its completion
    const deleteResponse = await s3.deleteObjects(options).promise();

    // Log the response from S3 upon successful deletion
    console.log("Deletion response from S3:", deleteResponse);
  } catch (error) {
    // Catch and log any errors encountered during the deletion operation
    console.error("Failed to delete objects from S3:", error);
    // Here, you could throw an error or handle it based on your application's needs
    // throw new Error("Failed to delete objects from S3");
  }
};

/**
 * Asynchronously deletes a set of files from AWS S3.
 * This function interfaces with `deleteImagesFromS3` to perform the actual deletion
 * and handles the response to format it for the caller's convenience.
 *
 * @param {Array<Object>} filesToDelete - An array of objects representing the files to delete.
 *        Each object should contain at least a 'filePath' property that maps to the Key in S3.
 * @returns {Promise<Array<String>>} A promise that resolves to an array of the keys of successfully deleted files.
 * @throws {Error} Throws an error if the deletion process fails, providing a message from the caught exception.
 */
async function deleteFilesFromAWS(filesToDelete) {
  try {
    // Attempt to delete the provided files using the `deleteImagesFromS3` utility function
    const deleteResponse = await deleteImagesFromS3(filesToDelete);

    // Log a success message with details of the deleted files for auditing or debugging
    console.log("Files deleted successfully:", deleteResponse.Deleted);

    // Extract and return just the keys (file paths) of the successfully deleted files for the caller's convenience
    const deletedKeys = deleteResponse.Deleted.map(({ Key }) => Key);
    return deletedKeys;
  } catch (error) {
    // Log the error encountered during deletion for troubleshooting
    console.error("Error deleting files from AWS:", error);

    // Throw a new error to indicate failure in the deletion process, preserving the original error message for context
    throw new Error(`Failed to delete files from AWS S3: ${error.message}`);
  }
}

async function manageImages(addLocalImages, removeUploadedImages, id) {
  // Keep track of successfully uploaded and deleted images for potential rollback
  let uploadedImages = [];
  let deletedImageKeys = [];

  try {
    // Delete specified images from S3
    if (removeUploadedImages.length > 0) {
      const deletedFiles = await deleteFilesFromAWS(removeUploadedImages);
      console.log("Successfully deleted images:", deletedFiles);
      // Store deleted image keys for potential rollback
      deletedImageKeys = deletedFiles.map(({ Key }) => Key);
    }

    // Upload new images to S3
    if (addLocalImages.length > 0) {
      uploadedImages = await createAWSUpload(addLocalImages, id);
      console.log("Successfully uploaded images:", uploadedImages);
    }

    // Further operations or return statement
    // Assuming further operations might throw an error which leads to catching block execution
    return { uploadedImages, deletedImageKeys };
  } catch (error) {
    console.error("Error managing images, attempting rollback:", error.message);

    // Rollback uploaded images if any
    if (uploadedImages.length > 0) {
      try {
        await deleteImagesFromS3(uploadedImages.map(({ filePath }) => ({ filePath })));
        console.log("Rolled back uploaded images successfully.");
      } catch (rollbackError) {
        console.error("Failed to rollback uploaded images:", rollbackError);
        // Consider how to handle failed rollbacks. Options include logging, alerting, or retry mechanisms.
      }
    }

    // Rollback deleted images if any
    // Note: Restoring deleted images would require having backup copies or not permanently deleting images until you are sure the entire operation is successful.
    // This example does not implement deleted images restoration due to the complexity and requirements for backups.
    // Consider implementing soft delete mechanisms or delayed permanent deletion to support rollback.

    throw new Error(`Failed to manage images, rollback attempted. Original error: ${error.message}`);
  }
}

 export {manageImages, deleteAllUserImages, deleteFilesFromAWS, createAWSUpload, deleteImagesFromS3}

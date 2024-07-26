// /* eslint-disable prefer-const */
// // import { Injectable } from '@nestjs/common';
// // import { v4 as uuidv4 } from 'uuid';
// // import * as sharp from 'sharp';
// // import * as aws from 'aws-sdk';

// // @Injectable()
// // export class AwsStorageService {
// //   AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
// //   S3 = new aws.S3({
// //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
// //     secretAccessKey: process.env.AWS_SECRET_KEY,
// //   });

// //   constructor() {}

// //   async uploadFile(file: Express.Multer.File): Promise<string> {
// //     const uniqueId = this.generateUniqueId();
// //     const filename = `${uniqueId}_${file.originalname}`;

// //     const compressedBuffer = await this.compressFile(
// //       file.buffer,
// //       file.mimetype,
// //       300 * 1024,
// //     ); // Compress to be under 300 KB

// //     return this.s3_upload(
// //       compressedBuffer,
// //       this.AWS_S3_BUCKET,
// //       filename,
// //       file.mimetype,
// //     );
// //   }

// //   private async s3_upload(file, bucket, name, mimetype) {
// //     const params = {
// //       Bucket: bucket,
// //       Key: String(name),
// //       Body: file,
// //       ACL: 'public-read',
// //       ContentType: mimetype,
// //       ContentDisposition: 'inline',
// //       CreateBucketConfiguration: {
// //         LocationConstraint: 'ap-southeast-1',
// //       },
// //     };

// //     try {
// //       let s3Response = await this.S3.upload(params).promise();
// //       return s3Response.Location;
// //     } catch (e) {
// //       console.log(e);
// //     }
// //   }

// //   private async compressFile(
// //     buffer: Buffer,
// //     mimeType: string,
// //     maxSize: number = 200 * 1024,
// //   ): Promise<Buffer> {
// //     let quality = 100;
// //     let compressedBuffer: Buffer;

// //     // Function to compress based on mime type and quality
// //     const compress = async (quality: number): Promise<Buffer> => {
// //       switch (mimeType) {
// //         case 'image/jpeg':
// //         case 'image/jpg':
// //           return sharp(buffer).jpeg({ quality }).toBuffer();
// //         case 'image/png':
// //           return sharp(buffer).png({ quality }).toBuffer();
// //         case 'image/webp':
// //           return sharp(buffer).webp({ quality }).toBuffer();
// //         default:
// //           throw new Error('Unsupported file type');
// //       }
// //     };

// //     // Initial compression
// //     compressedBuffer = await compress(quality);

// //     // Iteratively reduce the quality to achieve the desired file size
// //     while (compressedBuffer.length > maxSize && quality > 10) {
// //       quality -= 10;
// //       compressedBuffer = await compress(quality);
// //     }

// //     // If the image is still larger than maxSize, try resizing
// //     if (compressedBuffer.length > maxSize) {
// //       let width = (await sharp(buffer).metadata()).width;
// //       let height = (await sharp(buffer).metadata()).height;

// //       while (compressedBuffer.length > maxSize && width && height) {
// //         width = Math.floor(width * 0.9);
// //         height = Math.floor(height * 0.9);
// //         compressedBuffer = await sharp(buffer).resize(width, height).toBuffer();
// //       }
// //     }

// //     return compressedBuffer;
// //   }

// //   private generateUniqueId(): string {
// //     return uuidv4();
// //   }

// //   async deleteFile(file_url: string): Promise<string> {
// //     try {
// //       const key = file_url.split("/").pop();
   
// //       const params = {
// //         Bucket: this.AWS_S3_BUCKET,
// //         Key: key
// //       }

// //       let deletedFile;

// //       const findFile = await this.S3.getObject(params).promise()
// //       if(findFile) {
// //         deletedFile = await this.S3.deleteObject(params).promise()
// //       }
      
// //       return deletedFile;
// //     } catch (err: any) {
// //       console.log(err)
// //     }
// //   }
// // }
// import { Injectable } from '@nestjs/common';
// import { v4 as uuidv4 } from 'uuid';
// import * as sharp from 'sharp';
// import {
//   S3Client,
//   PutObjectCommand,
//   GetObjectCommand,
//   DeleteObjectCommand,
// } from '@aws-sdk/client-s3';

// @Injectable()
// export class AwsStorageService {
//   AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
//   S3 = new S3Client({
//     region: 'ap-southeast-1',
//     credentials: {
//       accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//       secretAccessKey: process.env.AWS_SECRET_KEY,
//     },
//   });

//   constructor() {}

//   async uploadFile(file: Express.Multer.File): Promise<string> {
//     const uniqueId = this.generateUniqueId();
//     const filename = `${uniqueId}_${file.originalname}`;

//     const compressedBuffer = await this.compressFile(
//       file.buffer,
//       file.mimetype,
//       300 * 1024,
//     ); // Compress to be under 300 KB

//     return this.s3_upload(
//       compressedBuffer,
//       this.AWS_S3_BUCKET,
//       filename,
//       file.mimetype,
//     );
//   }

//   private async s3_upload(
//     file: Buffer,
//     bucket: string,
//     name: string,
//     mimetype: string,
//   ): Promise<string> {
//     const params = {
//       Bucket: bucket,
//       Key: name,
//       Body: file,
//       ContentType: mimetype,
//       ContentDisposition: 'inline',
//     };

//     try {
//       const command = new PutObjectCommand(params);
//       const upload = await this.S3.send(command);
//       const region = await this.S3.config.region();
      
//       return `https://${bucket}.s3.${region}.amazonaws.com/${name}`;
//     } catch (e) {
//       console.log(e);
//       throw new Error('Error uploading file to S3');
//     }
//   }

//   private async compressFile(
//     buffer: Buffer,
//     mimeType: string,
//     maxSize: number = 200 * 1024,
//   ): Promise<Buffer> {
//     let quality = 100;
//     let compressedBuffer: Buffer;

//     // Function to compress based on mime type and quality
//     const compress = async (quality: number): Promise<Buffer> => {
//       switch (mimeType) {
//         case 'image/jpeg':
//         case 'image/jpg':
//           return sharp(buffer).jpeg({ quality }).toBuffer();
//         case 'image/png':
//           return sharp(buffer).png({ quality }).toBuffer();
//         case 'image/webp':
//           return sharp(buffer).webp({ quality }).toBuffer();
//         default:
//           throw new Error('Unsupported file type');
//       }
//     };

//     // Initial compression
//     compressedBuffer = await compress(quality);

//     // Iteratively reduce the quality to achieve the desired file size
//     while (compressedBuffer.length > maxSize && quality > 10) {
//       quality -= 10;
//       compressedBuffer = await compress(quality);
//     }

//     // If the image is still larger than maxSize, try resizing
//     if (compressedBuffer.length > maxSize) {
//       let { width, height } = await sharp(buffer).metadata();

//       while (compressedBuffer.length > maxSize && width && height) {
//         width = Math.floor(width * 0.9);
//         height = Math.floor(height * 0.9);
//         compressedBuffer = await sharp(buffer).resize(width, height).toBuffer();
//       }
//     }

//     return compressedBuffer;
//   }

//   private generateUniqueId(): string {
//     return uuidv4();
//   }

//   async deleteFile(fileUrl: string): Promise<string> {
//     try {
//       const key = fileUrl.split('/').pop();

//       const params = {
//         Bucket: this.AWS_S3_BUCKET,
//         Key: key,
//       };

//       const findFileCommand = new GetObjectCommand(params);
//       await this.S3.send(findFileCommand);

//       const deleteFileCommand = new DeleteObjectCommand(params);
//       await this.S3.send(deleteFileCommand);

//       return `File ${key} successfully deleted from ${this.AWS_S3_BUCKET}`;
//     } catch (err: any) {
//       console.log(err);
//       throw new Error('Error deleting file from S3');
//     }
//   }
// }

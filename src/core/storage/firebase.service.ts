import { Injectable, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Bucket } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import * as sharp from 'sharp';

@Injectable()
export class FirebaseStorageService {
    private bucket: Bucket;

    constructor(@Inject('FIREBASE_ADMIN') private readonly firebase: admin.app.App) {
        this.bucket = firebase.storage().bucket();
    }

    async uploadFile(file: Express.Multer.File, filePath: string): Promise<string> {
        const uniqueId = this.generateUniqueId();
        const filename = `${uniqueId}_${file.originalname}`;
        const filenameWithPercent20 = filename.replace(/\s+/g, '%20');
        const encodedPath = encodeURIComponent(filePath);

        // console.log("Uploading file:", filename);

        const compressedBuffer = await this.compressFile(file.buffer, file.mimetype, 300 * 1024); // Compress to be under 300 KB

        const fileUpload = this.bucket.file(`${filePath}${filename}`);
        const stream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype,
            },
        });

        return new Promise((resolve, reject) => {
            stream.on('error', (err) => {
                console.error('Error uploading file:', err);
                reject(err);
            });

            stream.on('finish', async () => {
                resolve(`https://firebasestorage.googleapis.com/v0/b/${this.bucket.name}/o/${encodedPath}${filenameWithPercent20}?alt=media`);
            });

            stream.end(compressedBuffer);
        });
    }

    private async compressFile(buffer: Buffer, mimeType: string, maxSize: number = 200 * 1024): Promise<Buffer> {
        let quality = 100;
        let compressedBuffer: Buffer;

        // Function to compress based on mime type and quality
        const compress = async (quality: number): Promise<Buffer> => {
            switch (mimeType) {
                case 'image/jpeg':
                case 'image/jpg':
                    return sharp(buffer).jpeg({ quality }).toBuffer();
                case 'image/png':
                    return sharp(buffer).png({ quality }).toBuffer();
                case 'image/webp':
                    return sharp(buffer).webp({ quality }).toBuffer();
                default:
                    throw new Error('Unsupported file type');
            }
        };

        // Initial compression
        compressedBuffer = await compress(quality);

        // Iteratively reduce the quality to achieve the desired file size
        while (compressedBuffer.length > maxSize && quality > 10) {
            quality -= 10;
            compressedBuffer = await compress(quality);
        }

        // If the image is still larger than maxSize, try resizing
        if (compressedBuffer.length > maxSize) {
            let width = (await sharp(buffer).metadata()).width;
            let height = (await sharp(buffer).metadata()).height;

            while (compressedBuffer.length > maxSize && width && height) {
                width = Math.floor(width * 0.9);
                height = Math.floor(height * 0.9);
                compressedBuffer = await sharp(buffer)
                    .resize(width, height)
                    .toBuffer();
            }
        }

        return compressedBuffer;
    }

    private generateUniqueId(): string {
        return uuidv4();
    }

    async deleteFile(fileUrl: string): Promise<void> {
        // Extract the file path from the URL
        const match = fileUrl.match(/\/o\/(.*)\?alt=media/);
        if (!match || !match[1]) {
            throw new Error('Invalid file URL');
        }
        const encodedPath = match[1];
        const filePath = decodeURIComponent(encodedPath);
        const file = this.bucket.file(filePath);

        try {
            await file.delete();
            console.log(`File ${filePath} deleted successfully.`);
        } catch (error) {
            console.error('Error deleting file:', error);
            throw new Error('Error deleting file');
        }
    }
}

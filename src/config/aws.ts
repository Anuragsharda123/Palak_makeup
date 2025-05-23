// src/config/s3.config.ts
import { S3Client } from '@aws-sdk/client-s3';
import { Local } from '../environment/env';


const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  // endpoint: Local.S3_END_POINT,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export default s3;

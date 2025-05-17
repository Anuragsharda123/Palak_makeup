import s3 from "../config/aws";
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Local } from "../environment/env";
import { Upload } from "@aws-sdk/lib-storage";

// const S3:any = s3;
const bucketName = Local.S3_Bucket_Name;

export const generateUploadUrl = async (key: string, contentType: string, buffer:any) => {
  const uploader = new Upload({
      client: s3,
      params: {
        Bucket: bucketName,
        Key: `${key}`,
        Body: buffer,
        ContentType: contentType,   // "video/mp4"
      },
    });

    const result = await uploader.done();   // waits for multipart upload to finish
  // const url = await getSignedUrl(s3, command, { expiresIn: 60 * 5 });
  return result;
};

export const generateDownloadUrl = async (key: string): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  const url = await getSignedUrl(s3, command);
  return url;
};

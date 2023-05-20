import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand
} from "@aws-sdk/client-s3";
import { File } from "formidable";
import { getBasename, getExtension } from "@/util";
import fs from "fs";
import { ErrorMessage } from "@/types";

const accessKeyId = process.env.R2_ACCESS_KEY_ID as string;
const secretAccessKey = process.env.R2_ACCESS_KEY_SECRET as string;
const endpoint = process.env.R2_ENDPOINT as string;
const readonlyEndpoint = process.env.R2_WORKER_URL as string;
const Bucket = process.env.R2_BUCKET_NAME as string;

const s3 = new S3Client({
  region: "auto",
  endpoint,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
});

async function put(file: File): Promise<string | ErrorMessage> {
  const filename = getBasename(file.originalFilename!) + getExtension(file.originalFilename!);

  try {
    await s3.send(new PutObjectCommand({
      Bucket,
      Key: filename,
      Body: fs.createReadStream(file.filepath)
    }));
  } catch (e) {
    console.log(e);
    return { message: "Error saving image." };
  }

  return readonlyEndpoint + filename;
}

async function del(url: string): Promise<string | ErrorMessage> {  
  const filename = getBasename(url) + getExtension(url);

  try {
    await s3.send(new DeleteObjectCommand({
      Bucket,
      Key: filename
    }));
  } catch (e) {
    console.log(e);
    return { message: "Error deleting image." };
  }

  return url;
}

const r2Bucket = {
  put,
  del
}

export default r2Bucket;
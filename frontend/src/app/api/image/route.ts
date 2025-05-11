import { NextRequest, NextResponse } from "next/server";
import {
  S3Client,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const Bucket = process.env.AWS_BUCKET_NAME;
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET as string,
  },
});

export async function POST (req: NextRequest) {
  try{
    const formData = await req.formData();
    const files = formData.getAll("file") as File[];

    const uploadedFileNames: string[] = []

    await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const Body = Buffer.from(arrayBuffer);

        const result = await s3.send(
          new PutObjectCommand({
            Bucket,
            Key: file.name,
            Body,
          })
        );

        uploadedFileNames.push(file.name); // collect the filename
        return result;
      })
    );

    return NextResponse.json({ uploaded: uploadedFileNames })
  } catch (err) {
    console.error("[IMAGE_POST_ERROR]", err);
    return NextResponse.json({ error: "Failed to send image to s3" }, { status: 400 });
  }
}


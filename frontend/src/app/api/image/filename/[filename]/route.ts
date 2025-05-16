import { NextRequest, NextResponse } from "next/server";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { verifyAdmin, verifyDonor } from "hooks/verify";

const Bucket = process.env.AWS_BUCKET_NAME;
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET as string,
  },
});

export async function GET(
  req: NextRequest,
  { params }: { params: { filename: string } },
) {
  if (!((await verifyAdmin()) || (await verifyDonor()))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 401 });
  }
  const { filename } = await params;

  try {
    const command = new GetObjectCommand({ Bucket, Key: filename });
    const url = await getSignedUrl(s3, command, { expiresIn: 300 });

    return NextResponse.json({ url });
  } catch (error: any) {
    console.error("Error getting presigned URL:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { filename: string } },
) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 401 });
  }
  const { filename } = await params;

  try {
    const command = new DeleteObjectCommand({ Bucket, Key: filename });
    await s3.send(command);

    return NextResponse.json({ message: `Deleted ${filename} from bucket.` });
  } catch (error: any) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { error: "Failed to delete file from S3" },
      { status: 500 },
    );
  }
}

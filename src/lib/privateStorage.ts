import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { readFile } from "node:fs/promises";
import { resolveSecuredPath } from "@/lib/signing";

const bucket = process.env.S3_BUCKET;
const region = process.env.S3_REGION;
const accessKeyId = process.env.S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
const endpoint = process.env.S3_ENDPOINT;
const prefix = (process.env.S3_PREFIX ?? "").replace(/^\/+|\/+$/g, "");

const s3Configured = Boolean(bucket && region && accessKeyId && secretAccessKey);
const s3 = s3Configured
  ? new S3Client({
      region,
      endpoint: endpoint || undefined,
      forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
      credentials: { accessKeyId: accessKeyId!, secretAccessKey: secretAccessKey! },
    })
  : null;

export function isS3StorageConfigured(): boolean {
  return s3Configured;
}

export function assertPrivateStorageConfigured(): void {
  if (
    process.env.NODE_ENV === "production" &&
    !s3Configured &&
    !process.env.SECURED_DIR
  ) {
    throw new Error(
      "Configure SECURED_DIR or complete S3_* private storage settings in production."
    );
  }
}

function relativeKey(declaredPath: string): string | null {
  const normalised = declaredPath.replaceAll("\\", "/");
  const parts = normalised.split("/").filter(Boolean);
  if (
    !normalised.startsWith("/") ||
    parts.length !== 2 ||
    !["documents", "previews"].includes(parts[0]) ||
    parts[1] !== parts[1].replace(/[^A-Za-z0-9._-]/g, "")
  ) {
    return null;
  }
  return [prefix, parts[0], parts[1]].filter(Boolean).join("/");
}

async function streamToBuffer(body: AsyncIterable<Uint8Array>, maxBytes: number): Promise<Buffer> {
  const chunks: Buffer[] = [];
  let total = 0;
  for await (const chunk of body) {
    const part = Buffer.from(chunk);
    total += part.byteLength;
    if (total > maxBytes) throw new Error("PRIVATE_ASSET_TOO_LARGE");
    chunks.push(part);
  }
  return Buffer.concat(chunks, total);
}

export async function readPrivateAsset(
  declaredPath: string,
  maxBytes: number
): Promise<Buffer> {
  if (s3) {
    const key = relativeKey(declaredPath);
    if (!bucket || !key) throw new Error("PRIVATE_ASSET_NOT_FOUND");
    const response = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    if (!response.Body) throw new Error("PRIVATE_ASSET_NOT_FOUND");
    if (response.ContentLength && response.ContentLength > maxBytes) {
      throw new Error("PRIVATE_ASSET_TOO_LARGE");
    }
    return streamToBuffer(response.Body as AsyncIterable<Uint8Array>, maxBytes);
  }

  const target = resolveSecuredPath(declaredPath);
  if (!target) throw new Error("PRIVATE_ASSET_NOT_FOUND");
  if (process.env.NODE_ENV === "production" && !process.env.SECURED_DIR) {
    throw new Error("PRIVATE_STORAGE_NOT_CONFIGURED");
  }
  // Local development only. Production uses S3 or an explicitly mounted volume.
  return readFile(target).then((buffer) => {
    if (buffer.byteLength > maxBytes) throw new Error("PRIVATE_ASSET_TOO_LARGE");
    return buffer;
  });
}

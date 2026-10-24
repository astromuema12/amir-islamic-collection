import { v2 as cloudinary } from "cloudinary";

function configureCloudinary() {
  const cloud_name = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const api_key = process.env.CLOUDINARY_API_KEY;
  const api_secret = process.env.CLOUDINARY_API_SECRET;

  if (!cloud_name || !api_key || !api_secret) {
    throw new Error("Missing Cloudinary env vars");
  }

  cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
  });
}

export async function uploadImage(
  file: string,
  folder = "amir-islamic"
): Promise<string> {
  configureCloudinary();
  const result = await cloudinary.uploader.upload(file, {
    folder,
    resource_type: "image",
    transformation: [{ quality: "auto", fetch_format: "auto" }],
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  } as any);
  return result.secure_url;
}

export async function uploadImages(
  files: string[],
  folder = "amir-islamic"
): Promise<string[]> {
  configureCloudinary();
  return Promise.all(files.map((file) => uploadImage(file, folder)));
}

export async function deleteImage(publicId: string) {
  configureCloudinary();
  await cloudinary.uploader.destroy(publicId, {
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  } as any);
}

export function getCloudinaryPublicId(url: string): string {
  const parts = url.split("/");
  const filename = parts[parts.length - 1];
  return filename.split(".")[0];
}

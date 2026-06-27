import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(
  file: string,
  folder = "amir-islamic"
): Promise<string> {
  const result = await cloudinary.uploader.upload(file, {
    folder,
    resource_type: "image",
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  });
  return result.secure_url;
}

export async function uploadImages(
  files: string[],
  folder = "amir-islamic"
): Promise<string[]> {
  return Promise.all(files.map((file) => uploadImage(file, folder)));
}

export async function deleteImage(publicId: string) {
  await cloudinary.uploader.destroy(publicId);
}

export function getCloudinaryPublicId(url: string): string {
  const parts = url.split("/");
  const filename = parts[parts.length - 1];
  return filename.split(".")[0];
}

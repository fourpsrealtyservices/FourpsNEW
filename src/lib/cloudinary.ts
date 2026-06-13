import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export async function uploadImage(file: string, folder: string = 'fourps/properties'): Promise<{
  url: string;
  publicId: string;
  width: number;
  height: number;
}> {
  const result = await cloudinary.uploader.upload(file, {
    folder,
    resource_type: 'image',
    transformation: [
      { quality: 'auto', fetch_format: 'auto' }
    ]
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
  };
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export function getBlurredUrl(publicId: string): string {
  return cloudinary.url(publicId, {
    transformation: [
      { effect: 'blur:2000', quality: 'auto', fetch_format: 'auto' }
    ]
  });
}

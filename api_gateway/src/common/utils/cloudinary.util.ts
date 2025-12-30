/**
 * Extract publicId từ Cloudinary URL
 *
 * Example:
 * Input: https://res.cloudinary.com/dpabf2tar/raw/upload/v1767125278/spotify/tracks/spotify/tracks/116434c77e6a4210.mp3
 * Output: spotify/tracks/spotify/tracks/116434c77e6a4210
 */
export function extractPublicIdFromUrl(url: string): string {
  if (!url) return '';

  try {
    const cleanUrl = url.split('?')[0]; // remove query params

    const match = cleanUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.[^/.]+$/i);

    return match?.[1] ?? '';
  } catch {
    return '';
  }
}

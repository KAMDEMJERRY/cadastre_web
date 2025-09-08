import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function uploadFile(file: File): Promise<{ url: string; downloadUrl: string }> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload/', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Upload error details:', errorData);
      throw new Error(errorData.error || `Upload failed: ${response.status}`);
    }

    const data = await response.json();
    return {
      url: data.url,
      downloadUrl: data.downloadUrl
    };
  } catch (error) {
    console.error('Upload function error:', error);
    throw error;
  }
}
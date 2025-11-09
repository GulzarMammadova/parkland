import { useState } from 'react';
import { uploadImage } from '../lib/storage';

export function useImageUpload() {
  const [isLoading, setLoading] = useState(false);
  const [error, setErr] = useState(null);

  async function upload(file, folder = '') {
    setLoading(true);
    setErr(null);
    try {
      const { publicUrl, path } = await uploadImage(file, folder);
      return { url: publicUrl, path };
    } catch (e) {
      setErr(e?.message || 'Upload error');
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { upload, isLoading, error };
}

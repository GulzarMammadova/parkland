import { useState } from 'react';
import { useImageUpload } from '../hooks/useImageUpload';

export default function ImageUploader({ onUploaded, folder = 'projects', buttonText = 'Upload' }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const { upload, isLoading, error } = useImageUpload();

  function onPick(e) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : '');
  }

  async function onSend() {
    if (!file) return;
    const res = await upload(file, folder);
    if (res) {
      onUploaded?.(res.url, res.path);
      setFile(null);
      setPreview('');
    }
  }

  return (
    <div style={{ display: 'grid', gap: 12, maxWidth: 440 }}>
      <input type="file" accept="image/*" onChange={onPick} />
      {preview && <img src={preview} alt="" style={{ maxWidth: '100%', borderRadius: 8 }} />}
      <button disabled={!file || isLoading} onClick={onSend}>
        {isLoading ? 'Uploading…' : buttonText}
      </button>
      {error && <small style={{ color: 'crimson' }}>{error}</small>}
    </div>
  );
}

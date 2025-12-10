import { useEffect, useState } from 'react';
import { listFiles, getPublicUrl, removeFiles } from '../lib/storage';
import ImageUploader from './ImageUploader';

export default function GalleryAdmin({ folder = '' }) {
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const rows = await listFiles(folder);
    const withUrls = rows.map((r) => {
      const path = folder ? `${folder}/${r.name}` : r.name;
      return { name: r.name, path, url: getPublicUrl(path) };
    });
    setItems(withUrls);
  }

  useEffect(() => { refresh(); }, [folder]);

  async function onRemove(item) {
    if (busy) return;
    setBusy(true);
    try {
      await removeFiles([item.path]); // удаляем точным путём
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <h2 style={{ margin: 0 }}>Media / {folder || 'root'}</h2>
      <ImageUploader onUploaded={refresh} folder={folder} />
      <div style={{ display: 'grid', gap: 12 }}>
        {items.map((it) => (
          <div key={it.path} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <img src={it.url} alt="" style={{ height: 72, width: 96, objectFit: 'cover', borderRadius: 8 }} />
            <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {it.path}
            </div>
            <a href={it.url} target="_blank" rel="noreferrer">Open</a>
            <button onClick={() => onRemove(it)} disabled={busy}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

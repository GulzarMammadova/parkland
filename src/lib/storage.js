import { supabase } from './supabase';

const BUCKET = 'projects';

const extOf = (name) => {
  const p = (name || '').split('.');
  return p.length > 1 ? p.pop().toLowerCase() : 'bin';
};

export async function uploadImage(file, folder = '') {
  const ext = extOf(file?.name || 'file');
  const filename = `${crypto.randomUUID()}.${ext}`;
  const path = folder ? `${folder}/${filename}` : filename;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { cacheControl: '31536000', upsert: false });

  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
} 

/* ВАЖНО: корень бакета запрашиваем БЕЗ аргумента */
export async function listFiles(prefix = '') {
  const pathArg = prefix ? prefix : undefined; // <-- ключевая строка
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(pathArg, { limit: 1000, sortBy: { column: 'created_at', order: 'desc' } });

  if (error) throw error;
  return data ?? [];
}

export async function removeFiles(paths) {
  const { error } = await supabase.storage.from(BUCKET).remove(paths);
  if (error) throw error;
}

export function getPublicUrl(path) {
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

import { supabase } from './supabase';

const BUCKET = 'projects';

const extOf = (name) => {
  const p = (name || '').split('.');
  return p.length > 1 ? p.pop().toLowerCase() : 'bin';
};

/** Загрузка (в указанный префикс, по умолчанию portfolio) */
export async function uploadImage(file, prefix = 'portfolio') {
  const ext = extOf(file?.name || 'file');
  const filename = `${crypto.randomUUID()}.${ext}`;
  const path = prefix ? `${prefix}/${filename}` : filename;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { cacheControl: '31536000', upsert: false });

  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}

/** Один уровень list */
async function listOnce(prefix = '') {
  const pathArg = prefix ? prefix : undefined; // корень — без аргумента
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(pathArg, { limit: 1000, sortBy: { column: 'name', order: 'asc' } });
  if (error) throw error;
  return data ?? [];
}

/** Простой листинг (экспорт для совместимости со старым кодом) */
export async function listFiles(prefix = '') {
  return listOnce(prefix);
}

/**
 * Рекурсивный список файлов с путями.
 * Обходит prefix (например "portfolio") и подпапки (depth<=2):
 * portfolio/<project-slug>/<files>
 */
export async function listFilesDeep(prefix = 'portfolio', maxDepth = 2) {
  const results = [];
  const queue = [{ prefix, depth: 0 }];

  while (queue.length) {
    const { prefix: cur, depth } = queue.shift();
    const items = await listOnce(cur);

    for (const it of items) {
      const isFolder = !it.metadata || it.metadata === null;
      if (isFolder) {
        if (depth < maxDepth) {
          const next = cur ? `${cur}/${it.name}` : it.name;
          queue.push({ prefix: next, depth: depth + 1 });
        }
      } else {
        const path = cur ? `${cur}/${it.name}` : it.name;
        results.push({ ...it, __path: path });
      }
    }
  }

  return results;
}

/** Публичная ссылка */
export function getPublicUrl(path) {
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

/** Удаление по полным путям */
export async function removeFiles(paths) {
  const { error } = await supabase.storage.from(BUCKET).remove(paths);
  if (error) throw error;
}

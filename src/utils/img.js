// Универсальная функция для Supabase Image Transformations.
// Если render API включено, подставляет /render/image/public/
// иначе просто возвращает publicUrl без изменений.

export function img(publicUrl, { width = 1200, quality = 80, resize = 'cover' } = {}) {
  if (!publicUrl) return '';
  if (publicUrl.includes('/object/public/')) {
    return publicUrl
      .replace('/object/public/', '/render/image/public/')
      .concat(`?width=${width}&quality=${quality}&resize=${resize}`);
  }
  return publicUrl;
}

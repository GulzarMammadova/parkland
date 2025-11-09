/* // Преобразует publicUrl → render API (если включены Image Transformations в Supabase)
export function img(publicUrl, { width = 1400, quality = 80, resize = 'cover' } = {}) {
  if (!publicUrl) return '';
  const hasRender = publicUrl.includes('/object/public/');
  return hasRender
    ? publicUrl.replace('/object/public/', '/render/image/public/')
               .concat(`?width=${width}&quality=${quality}&resize=${resize}`)
    : publicUrl;
}
 */
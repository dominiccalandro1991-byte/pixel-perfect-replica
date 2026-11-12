import { supabase } from '@/integrations/supabase/client';

export async function uploadPhoto(file: File, userId: string) {
  if (!file.type.startsWith('image/') || file.size > 10 * 1024 * 1024) throw new Error('Choose a photo smaller than 10 MB.');
  const bitmap = await createImageBitmap(file);
  if(bitmap.width < 200 || bitmap.height < 200) { bitmap.close(); throw new Error('Your photo must be at least 200 × 200 pixels.'); }
  const ratio = Math.min(1, 1920 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * ratio); canvas.height = Math.round(bitmap.height * ratio);
  const ctx = canvas.getContext('2d');
  if(!ctx) throw new Error('Photo processing is unavailable.');
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height); bitmap.close();
  const blob = await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('Could not process photo.')), 'image/webp', .88));
  const path = `${userId}/${crypto.randomUUID()}.webp`;
  const {error} = await supabase.storage.from('holiday-photos').upload(path,blob,{contentType:'image/webp'});
  if(error) throw error;
  return path;
}
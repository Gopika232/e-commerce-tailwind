import { encryptData, decryptData } from './crypto.util';

export async function save(key: string, data: any) {
  const encrypted = await encryptData(data);
  localStorage.setItem(key, encrypted);
}

export async function load(key: string) {
  const encrypted = localStorage.getItem(key);
  if (!encrypted) return null;
  return await decryptData(encrypted);
}

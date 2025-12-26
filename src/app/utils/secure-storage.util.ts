/*Secure Local Storage Utility (AES-GCM) */

const SECRET = 'e-commerce-secret-32bytes-key!';

/*Generate AES-GCM Key */
async function getKey(): Promise<CryptoKey> {
  const hash = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(SECRET)
  );

  return crypto.subtle.importKey(
    'raw',
    hash,
    'AES-GCM',
    false,
    ['encrypt', 'decrypt']
  );
}
/*Encrypt Data */
async function encryptData(data: any): Promise<string> {
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(JSON.stringify(data));

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoded
  );

  return btoa(JSON.stringify({
    iv: Array.from(iv),
    data: Array.from(new Uint8Array(encrypted))
  }));
}

/*Decrypt Data */
async function decryptData(cipher: string): Promise<any> {
  const parsed = JSON.parse(atob(cipher));
  const key = await getKey();

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: new Uint8Array(parsed.iv) },
    key,
    new Uint8Array(parsed.data)
  );

  return JSON.parse(new TextDecoder().decode(decrypted));
}

/* Save to Local Storage */
export async function saveSecure(key: string, data: any) {
  const encrypted = await encryptData(data);
  localStorage.setItem(key, encrypted);
}
/* Load from Local Storage*/
export async function loadSecure(key: string) {
  const encrypted = localStorage.getItem(key);
  if (!encrypted) return null;

  try {
    return await decryptData(encrypted);
  } catch (error) {
    alert('⚠️ Data has been modified or corrupted!');
    localStorage.removeItem(key);
    return null;
  }
}
/*Remove Item */
export function removeSecure(key: string) {
  localStorage.removeItem(key);
}

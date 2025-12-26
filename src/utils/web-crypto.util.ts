const SECRET = 'ecommerce-secret-32bytes-key!!';;

export async function encryptData(data: any): Promise<string> {
  const enc = new TextEncoder().encode(JSON.stringify(data));
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(SECRET),
    'AES-GCM',
    false,
    ['encrypt']
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc);
  return btoa(JSON.stringify({ iv: Array.from(iv), data: Array.from(new Uint8Array(encrypted)) }));
}

export async function decryptData(cipher: string): Promise<any[]> {
  const parsed = JSON.parse(atob(cipher));
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(SECRET),
    'AES-GCM',
    false,
    ['decrypt']
  );
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: new Uint8Array(parsed.iv) },
    key,
    new Uint8Array(parsed.data)
  );
  return JSON.parse(new TextDecoder().decode(decrypted));
}

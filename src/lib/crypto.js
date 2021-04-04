
// https://jameshfisher.com/2017/10/30/web-cryptography-api-hello-world/
export async function sha256 (data) {
  const encoder = new TextEncoder()
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(data))
  return Array.prototype.map.call(
    new Uint8Array(digest),
    x => (('00' + x.toString(16)).slice(-2))
  ).join('')
}

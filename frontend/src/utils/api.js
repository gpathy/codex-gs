export const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function apiFetch(path, { method = 'GET', body, token } = {}){
  const res = await fetch(apiBase + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {}),
    },
    body
  })
  if (!res.ok){
    const text = await res.text()
    throw new Error(text || 'Request failed')
  }
  const ct = res.headers.get('content-type') || ''
  return ct.includes('application/json') ? res.json() : res.text()
}


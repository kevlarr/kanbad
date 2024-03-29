/**
 * Wraps the Fetch API to standardize request headers, error handling, etc.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface RequestOptions {
  method: string;
  headers: { [index:string] : string };
  body?: string;
}

function request(method: string, path: string, data?: {}) {
  const opts: RequestOptions = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    opts.body = JSON.stringify(data);
  }

  const fullPath = `${API_URL}/${path}`
  console.log(`${method} ${fullPath}`)

  return fetch(fullPath, opts)
    .then((resp) => {
      console.log(resp)

      if (resp.status >= 400) {
        throw new Error(`${resp.status} ${resp.statusText}`);
      }

      // DELETE returns "204 No Content"
      if (resp.status == 204) {
        return true;
      }

      return resp.json();
    })
}

export default {
  get: (path: string) => request('GET', path),
  post: (path: string, data?: {}) => request('POST', path, data || {}),
  patch: (path: string, data: {}) => request('PATCH', path, data),
  delete: (path: string) => request('DELETE', path),
};

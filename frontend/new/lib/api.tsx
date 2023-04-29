/**
 * Wraps the Fetch API to standardize request headers, error handling, etc.
 */

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

    return fetch(`/api/v1/${path}`, opts).then((resp) => {
        if (resp.status >= 400) {
            throw new Error(`${resp.status} ${resp.statusText}`);
        }

        // DELETE returns "204 No Content"
        if (resp.status == 204) {
            return true;
        }

        return resp.json();
    });
}

export default {
    get: (path: string) => request('GET', path),
    post: (path: string, data?: {}) => request('POST', path, data || {}),
    put: (path: string, data: {}) => request('PUT', path, data),
    delete: (path: string) => request('DELETE', path),
};

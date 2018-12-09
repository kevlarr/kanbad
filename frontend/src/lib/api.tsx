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
        if (resp.status !== 200) {
            throw new Error(`${resp.status} ${resp.statusText}`);
        }

        return resp.json();
    });
}

export default {
    get: (path: string) => request('GET', path),
    post: (path: string, data: {}) => request('POST', path, data),
};

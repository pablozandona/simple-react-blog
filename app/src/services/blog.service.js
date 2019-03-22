import { authHeader } from '../helpers';
import { BASE_URL } from '../constants';

export const blogService = {
    create,
    getAll,
    getPosts,
    getBlog,
    createPost,
};

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/blog/list`, requestOptions).then(handleResponse);
}

function getPosts(id) {
    const requestOptions = {
        method: 'GET',
    };
    return fetch(`${BASE_URL}/blog/${id}/posts`, requestOptions).then(handleResponse);
}

function getBlog(id) {
    const requestOptions = {
        method: 'GET',
    };
    return fetch(`${BASE_URL}/blog/${id}`, requestOptions).then(handleResponse);
}

function create(info) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(info)
    };

    return fetch(`${BASE_URL}/blog/create`, requestOptions).then(handleResponse);
}

function createPost(info) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(info)
    };

    return fetch(`${BASE_URL}/post/create`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}

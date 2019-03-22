import {BASE_URL} from "../constants";

export const userService = {
    login,
    logout,
    register,
    hasLogin,
};

function hasLogin() {
    return JSON.parse(localStorage.getItem('user'));
}

function login(login) {
    const {user, password} = login;
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, password })
    };
    return fetch(`${BASE_URL}/user/authenticate`, requestOptions)
        .then(handleResponse);
}

function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
}

function register(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`${BASE_URL}/user/register`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 403) {
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

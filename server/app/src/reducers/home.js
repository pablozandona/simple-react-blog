import {userService} from "../services";

export default (state = {isLogged: false}, action) => {
    switch (action.type) {
        case 'SET_USER':
            return {
                ...state,
                user: action.user,
                isLogged: true,
            };
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                user: action.user,
                isLogged: true,
            };
        case 'LOGOUT':
            userService.logout();
            return {
                isLogged: false,
            };
        default:
            return state;
    }
};

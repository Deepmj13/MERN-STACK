import { createContext, useReducer, useEffect } from 'react';
import api from '../utils/api';

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null
};

const AuthContext = createContext(initialState);

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                loading: false,
                error: null
            };
        case 'LOGIN_FAIL':
        case 'LOGOUT':
        case 'AUTH_ERROR':
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                loading: false,
                error: action.payload
            };
        case 'SET_LOADING':
            return {
                ...state,
                loading: true
            };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Load user
    useEffect(() => {
        const loadUser = async () => {
            try {
                const res = await api.get('/auth/me');
                dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
            } catch (err) {
                dispatch({ type: 'AUTH_ERROR' });
            }
        };
        loadUser();
    }, []);

    // Login User
    const login = async (formData) => {
        try {
            // Send request
            const res = await api.post('/auth/login', formData);
            // Wait for cookie to be set? It's automatic.
            dispatch({ type: 'LOGIN_SUCCESS', payload: res.data.user });
        } catch (err) {
            dispatch({ type: 'LOGIN_FAIL', payload: err.response.data.msg });
            throw err;
        }
    };

    // Register User
    const register = async (formData) => {
        try {
            const res = await api.post('/auth/register', formData);
            dispatch({ type: 'LOGIN_SUCCESS', payload: res.data.user });
        } catch (err) {
            dispatch({ type: 'LOGIN_FAIL', payload: err.response.data.msg });
            throw err;
        }
    }

    // Logout
    const logout = async () => {
        // Ideally call endpoint to clear cookie
        // await api.post('/auth/logout');
        // But for now clear state (cookie remains unless cleared by server or manual expiration)
        // Let's implement logout endpoint later if needed, for new just client side wrapper
        dispatch({ type: 'LOGOUT' });
    };

    return (
        <AuthContext.Provider
            value={{
                user: state.user,
                isAuthenticated: state.isAuthenticated,
                loading: state.loading,
                error: state.error,
                login,
                register,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;

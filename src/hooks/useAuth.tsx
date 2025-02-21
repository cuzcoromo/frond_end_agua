import { useState, useEffect } from 'react';

const useAuth = () => {
    const [token, setToken] = useState(() => {
        return localStorage.getItem('token') || null;
    });

    const [userData, setUserData] = useState(() => {
        // Inicializamos el estado con los datos del usuario que estén en localStorage
        const storedUserData = localStorage.getItem('userData');
        return storedUserData ? JSON.parse(storedUserData) : null;
    });

    // Guardar el token y los datos del usuario en localStorage cuando cambien
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);

    useEffect(() => {
        if (userData) {
            localStorage.setItem('userData', JSON.stringify(userData));
        } else {
            localStorage.removeItem('userData');
        }
    }, [userData]);

    // Función para limpiar el estado de autenticación
    const clearAuth = () => {
        setToken(null);
        setUserData(null);
    };

    return {
        token,
        userData,
        setToken,
        setUserData,
        clearAuth
    };
};

export default useAuth;
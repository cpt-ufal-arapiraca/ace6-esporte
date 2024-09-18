import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { verifyToken } from '../../services/api';

const PrivateRoute = ({ element: Component }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        const checkToken = async () => {
            if (token) {
                const validToken = await verifyToken(token);
                setIsAuthenticated(validToken);
            } else {
                setIsAuthenticated(false);
                localStorage.removeItem('authToken');
            }
        };
        checkToken();
    }, [token]);

    if (isAuthenticated === null) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Spin size="large" />
        </div>;
    }
    
    return isAuthenticated ? <Component /> : <Navigate to="/login" />;
};

export default PrivateRoute;
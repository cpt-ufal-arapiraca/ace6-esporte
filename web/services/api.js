import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const login = async (email, password) => {
    try {
        const response = await api.post('login', {
            email: email,
            password: password
        });
        return response;
    } catch (error) {
        if (error.request.status === 404) {
            throw Error('Usuário não encontrado.');
        }
        else if (error.request.status === 401) {
            throw Error('Credenciais inválidas ou usuário inativo.');
        }
        else {
            throw Error('Ocorreu um erro ao fazer o login. Tente novamente.');
        }  
    }
}

export const verifyToken = async (token) => {
    try {
        const response = await api.post('verify-token', {}, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
}

export const createUser = async (name, email, password, identity, student_registration) => {
    try {
        const response = await api.post('register', {
            name: name,
            email: email,
            password: password,
            identity: identity,
            student_registration: student_registration
        });
        return response;
    } catch (error) {
        if (error.response.data.detail === "Student registration already exists") {
            throw Error('Matrícula já registrada.');
        }
        else if (error.response.data.detail === "Email already registered") {
            throw Error('E-mail em uso.');
        }
        else {
            throw Error('Ocorreu um erro ao fazer o cadastro. Tente novamente.');
        }
    }
}
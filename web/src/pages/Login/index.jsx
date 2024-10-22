import React, { useState } from 'react'; 
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Flex, Form, Input, Modal, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { login } from '../../../services/api';
import './styles.css';

const Login = () => {
    const [modalForgotPasswordOpen, setModalForgotPasswordOpen] = useState(false);
    const [modalConfirmOpen, setModalConfirmOpen] = useState(false); // Estado para o segundo modal
    const [email, setEmail] = useState(''); // Armazenar o email do usuário
    const [verificationCode, setVerificationCode] = useState(''); // Armazenar o código de verificação
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate(); // Para navegar entre as páginas

    const onFinish = async (values) => {
        try {
            const result = await login(values.email, values.password);
            if (result.status === 200) {
                localStorage.setItem('authToken', result.data.access_token);
                navigate('/');
            }
        } catch (error) {
            messageApi.open({
                type: 'error',
                content: error.message,
            });
        }
    };

    const handleRegisterNavigate = () => {
        navigate('/registrar');
    };

    const handleRequestNewPassword = () => {
        if (email) {
            setModalForgotPasswordOpen(false); // Fecha o modal de esquecimento de senha
            setModalConfirmOpen(true); // Abre o segundo modal de confirmação
        } else {
            messageApi.open({
                type: 'error',
                content: 'Por favor, insira o e-mail registrado.',
            });
        }
    };

    const handleVerificationSubmit = () => {
        if (verificationCode) {
            // Simulando a verificação do código com sucesso
            messageApi.open({
                type: 'success',
                content: 'Código verificado com sucesso!',
            });
            setModalConfirmOpen(false); // Fecha o modal de verificação
            navigate('/recuperar-senha'); // Redireciona para a página de recuperação de senha
        } else {
            messageApi.open({
                type: 'error',
                content: 'Por favor, insira o código de verificação.',
            });
        }
    };

    return (
        <main>
            <div className='generalPage'>
                <div className='templateAside'>
                    {/* inserir a imagem e logo */}
                </div>
                <div className='loginForm'>
                    {contextHolder}
                    <div className='formContainer'>
                        <p id='loginTitle'>Login</p>
                        <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        size='large'
                        >
                        <Form.Item
                            name="email"
                            rules={[
                                {
                                    type: 'email',
                                    message: 'O e-mail não é válido.',
                                },
                                {
                                    required: true,
                                    message: 'Por favor, insira seu e-mail.',
                                },
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined className="site-form-item-icon" />} 
                                placeholder="E-mail" 
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                            {
                                required: true,
                                message: 'Por favor, insira sua senha.',
                            },
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                placeholder="Senha"
                            />
                        </Form.Item>
                        <Form.Item 
                            style={{
                                marginBottom: 0
                            }}
                        >
                            <Flex className='rememberMe' justify='space-between' align='center'>
                                <Form.Item name="remember" valuePropName="checked" noStyle>
                                    <Checkbox>Lembrar de mim</Checkbox>
                                </Form.Item>

                                <Button
                                    type="link"
                                    size='small'
                                    onClick={() => setModalForgotPasswordOpen(true)}
                                >
                                    Esqueceu a senha?
                                </Button>

                                {/* Primeiro Modal: Esqueceu a senha */}
                                <Modal
                                    className='modalForgotPassword'
                                    centered
                                    open={modalForgotPasswordOpen}
                                    footer={[
                                        <Button size='large' key="submit" type="primary" onClick={handleRequestNewPassword}>
                                            Solicitar nova senha
                                        </Button>
                                    ]}
                                    onCancel={() => setModalForgotPasswordOpen(false)}
                                >
                                    <div className="modal-header">
                                        <div className="icon-container">
                                            <div className='circle'>
                                                <LockOutlined className="lock-icon" />
                                            </div>
                                        </div>
                                        <h2 className="modal-title">Esqueceu a senha?</h2>
                                    </div>
                                    <p>Insira seu e-mail registrado para solicitar uma nova senha.</p>
                                    <Input
                                        type="email"
                                        placeholder="E-mail"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Modal>

                                {/* Segundo Modal: Insira o código de verificação */}
                                <Modal
                                    className='modalConfirmPassword'
                                    centered
                                    open={modalConfirmOpen}
                                    footer={[
                                        <Button size='large' key="submit" type="primary" onClick={handleVerificationSubmit}>
                                            Verificar código
                                        </Button>
                                    ]}
                                    onCancel={() => setModalConfirmOpen(false)}
                                >
                                    <div className="modal-header">
                                        <div className="icon-container">
                                            <div className='circle'>
                                                <LockOutlined className="lock-icon" />
                                            </div>
                                        </div>
                                        <h2 className="modal-title">Insira o código de verificação</h2>
                                    </div>
                                    <p>Digite o código enviado para o seu e-mail.</p>
                                    <Input
                                        type="text"
                                        placeholder="Código de verificação"
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value)}
                                    />
                                </Modal>
                            </Flex>
                        </Form.Item>

                        <Form.Item
                            style={{
                                marginBottom: 0
                            }}
                        >
                            <Button 
                                type="primary"
                                htmlType="submit" 
                                className="login-form-button"
                                block
                            >
                                Entrar
                            </Button>

                            <p className='registrationOption' style={{textAlign: 'center', marginTop: 5, marginBottom: 5}}>
                                <b>Não tem uma conta?</b>
                                <Button
                                    type="link"
                                    size="small"
                                    onClick={handleRegisterNavigate}
                                >
                                    Registre-se aqui.
                                </Button>
                            </p>
                        </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Login;

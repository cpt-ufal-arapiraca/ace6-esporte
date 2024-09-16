import React, { useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Flex, Form, Input, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const Login = () => {
    const [modalForgotPasswordOpen, setModalForgotPasswordOpen] = useState(false);
    const navigate = useNavigate();

    const onFinish = (values) => {
        console.log('Valores do login-form: ', values);
    };

    const handleRegisterNavigate = () => {
        navigate('/registrar');
    };

    return (
        <main>
            <div className='generalPage'>
                <div className='templateAside'>
                    {/* inserir a imagem e logo */}
                </div>
                <div className='loginForm'>
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
                                <Modal
                                    className='modalForgotPassword'
                                    centered
                                    open={modalForgotPasswordOpen}
                                    footer={[
                                        <Button size='large' key="submit" type="primary">
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
                                    <p>Não se preocupe! Clique no botão abaixo para solicitar uma nova senha.</p>
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
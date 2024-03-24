import React from 'react';
import './login.css';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Flex, Form, Input } from 'antd';

const Login = () => {
    const onFinish = (values) => {
        console.log('Valores do login-form: ', values);
      };

    return (
        <main>
            <div className='generalPage'>
                <div className='templateAside'>
                    {/* inserir a imagem e logo */}
                </div>
                <div className='loginForm'>
                    <div className='formContainer'>
                        <p id='title'>Login</p>
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
                                    message: 'O email não é válido.',
                                },
                                {
                                    required: true,
                                    message: 'Por favor, insira seu email.',
                                },
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined className="site-form-item-icon" />} 
                                placeholder="Email" 
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
                            <Flex justify='space-between' align='center'>
                                <Form.Item name="remember" valuePropName="checked" noStyle>
                                    <Checkbox>Lembrar de mim</Checkbox>
                                </Form.Item>

                                <a className="linkHref" href="">
                                    Esqueceu a senha?
                                </a>
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
                            <p style={{textAlign: 'center', marginTop: 5, marginBottom: 5}}>
                                Não tem uma conta? <a className="linkHref" href="">Registre-se aqui</a>.
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
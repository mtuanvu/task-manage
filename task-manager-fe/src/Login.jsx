import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';

function Login() {
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            // Gửi yêu cầu đăng nhập tới endpoint /api/token/
            const response = await axios.post('http://localhost:8000/api/token/', values);
            // Lưu token vào localStorage
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            message.success('Login successful');
            window.location.href = '/'; // Chuyển hướng đến trang chính sau khi đăng nhập thành công
        } catch (error) {
            message.error('Invalid username or password');
        }
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: 400, margin: 'auto', paddingTop: '50px' }}>
            <h2>Login</h2>
            <Form
                name="login"
                onFinish={onFinish}
                layout="vertical"
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default Login;

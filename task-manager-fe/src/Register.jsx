import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';

function Register() {
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await axios.post('http://localhost:8000/api/register/', values);
            message.success('Registration successful');
            window.location.href = '/login'; // Chuyển hướng đến trang đăng nhập sau khi đăng ký thành công
        } catch (error) {
            message.error('Registration failed. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: 400, margin: 'auto', paddingTop: '50px' }}>
            <h2>Register</h2>
            <Form
                name="register"
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
                        Register
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default Register;

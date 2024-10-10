import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Button, Layout, Menu } from 'antd';
import TaskList from './TaskList';
import Login from './Login';
import Register from './Register';

const { Header, Content } = Layout;

function App() {
    const isAuthenticated = !!localStorage.getItem('access_token');

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login'; // Sử dụng window.location.href thay vì useNavigate
    };

    return (
        <Router>
            <Layout>
                <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Menu theme="dark" mode="horizontal" style={{ flexGrow: 1 }}>
                        <Menu.Item key="taskList">
                            <Link to="/">Task List</Link>
                        </Menu.Item>
                    </Menu>
                    <div>
                        {isAuthenticated ? (
                            <Button type="primary" onClick={handleLogout}>
                                Logout
                            </Button>
                        ) : (
                            <>
                                <Button type="primary" style={{ marginRight: 10 }}>
                                    <Link to="/login">Login</Link>
                                </Button>
                                <Button type="primary">
                                    <Link to="/register">Register</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </Header>
                <Content style={{ padding: '50px' }}>
                    <Routes>
                        <Route path="/" element={<TaskList />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Routes>
                </Content>
            </Layout>
        </Router>
    );
}

export default App;

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, DatePicker, message, List, Card, Checkbox } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

const { Option } = Select;

function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [editingTaskId, setEditingTaskId] = useState(null);

    // Hàm lấy danh sách công việc từ API
    const fetchTasks = async () => {
        const accessToken = localStorage.getItem('access_token');
        try {
            const response = await axios.get('http://localhost:8000/api/tasks/', {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            setTasks(response.data);
        } catch (error) {
            message.error('Error fetching tasks');
        }
    };

    // Hàm thêm hoặc cập nhật công việc
    const addOrUpdateTask = async (values) => {
        const accessToken = localStorage.getItem('access_token');
        setLoading(true);
        try {
            const taskData = {
                ...values,
                deadline: values.deadline.format('YYYY-MM-DD'),
            };

            if (editingTaskId) {
                // Sử dụng ID của công việc đang chỉnh sửa
                await axios.put(`http://localhost:8000/api/tasks/${editingTaskId}/`, taskData, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                message.success('Task updated successfully');
                setEditingTaskId(null); // Đặt lại sau khi cập nhật
            } else {
                await axios.post('http://localhost:8000/api/tasks/', taskData, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                message.success('Task added successfully');
            }

            form.resetFields();
            fetchTasks();
        } catch (error) {
            message.error(error.response?.status === 400 ? 'Bad request: Check the data format' : 'Error adding/updating task');
        }
        setLoading(false);
    };

    // Hàm xóa công việc
    const deleteTask = async (taskId) => {
        const accessToken = localStorage.getItem('access_token');
        try {
            await axios.delete(`http://localhost:8000/api/tasks/${taskId}/`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            message.success('Task deleted successfully');
            fetchTasks();
        } catch (error) {
            message.error('Error deleting task');
        }
    };

    // Bắt đầu chỉnh sửa công việc
    const editTask = (task) => {
        setEditingTaskId(task.id); // Đặt ID của task đang chỉnh sửa
        form.setFieldsValue({
            ...task,
            deadline: dayjs(task.deadline),
        });
    };

    // Đánh dấu công việc là hoàn thành/chưa hoàn thành
    const toggleTaskCompletion = async (task) => {
        const accessToken = localStorage.getItem('access_token');
        try {
            await axios.patch(`http://localhost:8000/api/tasks/${task.id}/`, {
                is_completed: !task.is_completed,
            }, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            fetchTasks();
        } catch (error) {
            message.error('Error updating task status');
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const onFinish = (values) => {
        addOrUpdateTask({
            title: values.title,
            description: values.description,
            deadline: values.deadline,
            priority: values.priority,
            is_completed: editingTaskId ? tasks.find(task => task.id === editingTaskId).is_completed : false,
        });
    };

    return (
        <div style={{ maxWidth: 600, margin: 'auto', paddingTop: '50px' }}>
            <h2 style={{ textAlign: 'center' }}>Task List</h2>
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter a title' }]}>
                    <Input placeholder="Enter task title" />
                </Form.Item>
                <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please enter a description' }]}>
                    <Input placeholder="Enter task description" />
                </Form.Item>
                <Form.Item name="deadline" label="Deadline" rules={[{ required: true, message: 'Please select a deadline' }]}>
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="priority" label="Priority" rules={[{ required: true, message: 'Please select priority' }]}>
                    <Select placeholder="Select priority level">
                        <Option value="high">High</Option>
                        <Option value="medium">Medium</Option>
                        <Option value="low">Low</Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
                        {editingTaskId ? 'Update Task' : 'Add Task'}
                    </Button>
                </Form.Item>
            </Form>

            <div style={{ marginTop: '30px' }}>
                <h3 style={{ textAlign: 'center' }}>All Tasks</h3>
                {tasks.length > 0 ? (
                    <List
                        grid={{ gutter: 16, column: 1 }}
                        dataSource={tasks}
                        renderItem={(task) => (
                            <List.Item>
                                <Card title={<Checkbox checked={task.is_completed} onChange={() => toggleTaskCompletion(task)}>{task.title}</Checkbox>}>
                                    <p><strong>Description:</strong> {task.description}</p>
                                    <p><strong>Deadline:</strong> {task.deadline}</p>
                                    <p><strong>Priority:</strong> {task.priority}</p>
                                    <p><strong>Completed:</strong> {task.is_completed ? 'Yes' : 'No'}</p>
                                    <Button type="link" onClick={() => editTask(task)} style={{ padding: 0 }}>
                                        Edit
                                    </Button>
                                    <Button type="link" danger onClick={() => deleteTask(task.id)} style={{ padding: 0, marginLeft: 8 }}>
                                        Delete
                                    </Button>
                                </Card>
                            </List.Item>
                        )}
                    />
                ) : (
                    <p style={{ textAlign: 'center' }}>No tasks found</p>
                )}
            </div>
        </div>
    );
}

export default TaskList;

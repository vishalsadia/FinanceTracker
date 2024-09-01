import React from 'react';
import {
    Card, Col, Row, Button, Modal, Form, Input, DatePicker, Select, 
    message
} from "antd";

function AddIncome({
    isIncomeModalVisible,
    handleIncomeCancel,
    onFinish,
}) {
    const [form] = Form.useForm();

    return (
        <Modal 
            style={{ fontWeight: 600 }}
            title="Add Income"
            visible={isIncomeModalVisible}
            onCancel={handleIncomeCancel}
            footer={null}
        >
            <Form 
                form={form}
                layout='vertical'
                onFinish={(values) => {
                    onFinish(values, "income");
                    form.resetFields();
                }}
            >
                <Form.Item
                    style={{ fontWeight: 600 }}
                    label="Name"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: "Please input the name of the transaction!",
                        },
                    ]}
                >
                    <Input type="text" className="custom-input" />
                </Form.Item>
                
                <Form.Item
                    style={{ fontWeight: 600 }}
                    label="Amount"
                    name="amount"
                    rules={[
                        { required: true, message: "Please input the income amount!" },
                    ]}
                >
                    <Input type="number" className="custom-input" />  
                </Form.Item>
                
                <Form.Item
                    style={{ fontWeight: 600 }}
                    label="Date"
                    name="date"
                    rules={[
                        { required: true, message: "Please input the income date!" },
                    ]}
                >          
                    <DatePicker format="YYYY-MM-DD" className='custom-input' />
                </Form.Item> 

                <Form.Item
                    style={{ fontWeight: 600 }}
                    label="Tag"
                    name="tag"
                    rules={[
                        { required: true, message: "Please input a tag!" },
                    ]}
                >
                    <Select className="custom-input">
                        {/* Add options here */}
                    </Select>
                </Form.Item> 
            </Form>
        </Modal>
    );
}

export default AddIncome;

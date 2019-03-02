import React from 'react';
import {
    Button, Modal, Form, Input, Radio, Icon,notification
  } from 'antd';
import axios from 'axios';
import {API_BASE_URL,ACCESS_TOKEN} from '../../constants/index';
const openNotificationWithIcon = (type,description) => {
notification[type]({
    message: 'Flidi App',
    description: description,
});
};
  
const UpdateInfoForm = Form.create({ name: 'form_in_modal' })(
    // eslint-disable-next-line
    class extends React.Component {
    
        constructor(props){
            super(props);
            this.state={
                confirmDirty: false,
                visible:true
            }
    
        }

        componentDidMount(){
            this.props.form.setFieldsValue({
                firstName: this.props.user.firstName,
                lastName: this.props.user.lastName,
                email: this.props.user.email
            });
        }
        handleSubmit = (e) => {
            e.preventDefault();
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    values['username'] = this.props.user.username;
                    values['id'] = this.props.user.id;
                    values['email'] = this.props.user.email;
                    var headers = {
                        'Content-Type': 'application/json'
                    }
                    if(localStorage.getItem(ACCESS_TOKEN)) {
                        headers['Authorization'] = 'Bearer ' + localStorage.getItem(ACCESS_TOKEN);
                    }
                    axios.put(`${API_BASE_URL}/users/${this.props.user.id}`, values, {
                        headers: headers
                    }).then(res=>{
                        console.log(res);
                        if(res.data.success){
                            openNotificationWithIcon('success','Cập nhật thông tin thành công');
                            //this.props.onCancel();
                            setTimeout(function(){
                                window.location.reload();
                            },500);
                        }
                        else{
                            openNotificationWithIcon('error','Đã có lỗi xảy ra');
                        }
                    }).catch(err=>{
                        openNotificationWithIcon('error','Đã có lỗi xảy ra');
                    })
                }
            });
            return false;
        }
      
      render() {
        const {
          visible, onCancel, onCreate, form,user
        } = this.props;
        const { getFieldDecorator } = form;
        return (
          <Modal
            visible={visible}
            onCancel={onCancel}
            title="Cập nhật thông tin"
            okText="Lưu"
            footer={null}
          >
            <Form layout="vertical" onSubmit={this.handleSubmit}>
               <Form.Item
          label="First Name"
        >
          {getFieldDecorator('firstName', {
            rules: [{
              required: true, message: 'Vui lòng nhập First Name',
            }],
          })(
            <Input type="text" />
          )}
            </Form.Item>
            <Form.Item

            label="Last Name"
            >
            {getFieldDecorator('lastName', {
                rules: [{
                required: true, message: 'Vui lòng nhập Last Name',
                }],
            })(
                <Input type="text"/>
            )}
            </Form.Item>
            <Form.Item

            label="Email"
            >
            {getFieldDecorator('email', {
                rules: [{
                required: true, message: 'Vui lòng nhập Email',
                }],
            })(
                <Input disabled={true} type="email"/>
            )}
            </Form.Item>
            <Form.Item>
                <Button type="primary"  htmlType="submit"> <Icon type="info-circle" />Cập nhật</Button>
              </Form.Item>
            </Form>
          </Modal>
        );
      }
    }
  );
  export default UpdateInfoForm;
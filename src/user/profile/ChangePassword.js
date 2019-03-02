import React from 'react';
import {
    Button, Modal, Form, Input, Radio, Icon,notification
  } from 'antd';
  import {API_BASE_URL,ACCESS_TOKEN} from '../../constants/index';
  import axios from 'axios';

  const openNotificationWithIcon = (type,description) => {
    notification[type]({
      message: 'Flidi App',
      description: description,
    });
  };
  const ChangePasswordForm = Form.create({ name: 'form_in_modal' })(
    // eslint-disable-next-line
    class extends React.Component {
    
        constructor(props){
            super(props);
            this.state={
                confirmDirty: false,
                visible:true
            }
    
        }
        handleSubmit = (e) => {
            e.preventDefault();
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    values['username'] = this.props.user.username;
                    values['id'] = this.props.user.id;
                    values['newPassword'] = values['password'];
                    var headers = {
                        'Content-Type': 'application/json'
                    }
                    if(localStorage.getItem(ACCESS_TOKEN)) {
                        headers['Authorization'] = 'Bearer ' + localStorage.getItem(ACCESS_TOKEN);
                    }
                    axios.put(`${API_BASE_URL}/users/${this.props.user.id}/password`, values, {
                        headers: headers
                    }).then(res=>{
                        console.log(res);
                        if(res.data.success){
                            openNotificationWithIcon('success','Đổi mật khẩu thành công');
                            this.props.onCancel();
                        }
                        else{
                            openNotificationWithIcon('error','Đổi mật khẩu thất bại, vui lòng nhập chính xác mật khẩu');
                        }
                    }).catch(err=>{
                        openNotificationWithIcon('error','Đổi mật khẩu thất bại, vui lòng nhập chính xác mật khẩu');
                    })
                }
            });
            return false;
        }
      

        handleConfirmBlur = (e) => {
            const value = e.target.value;
            this.setState({ confirmDirty: this.state.confirmDirty || !!value });
          }
        
          compareToFirstPassword = (rule, value, callback) => {
            const form = this.props.form;
            if (value && value !== form.getFieldValue('password')) {
              callback('Mật khẩu nhập lại không trùng!');
            } else {
              callback();
            }
          }
        
          validateToNextPassword = (rule, value, callback) => {
            const form = this.props.form;
            if (value && this.state.confirmDirty) {
              form.validateFields(['confirm'], { force: true });
            }
            callback();
          }
      render() {
        const {
          visible, onCancel, onCreate, form,
        } = this.props;
        const { getFieldDecorator } = form;
        return (
          <Modal
            visible={visible}
            onCancel={onCancel}
            title="Đổi mật khẩu"
            okText="Lưu"
            footer={null}
          >
          
            <Form layout="vertical" onSubmit={this.handleSubmit}>
                <Form.Item
                label="Mật khẩu hiện tại"
                >
                {getFieldDecorator('oldPassword', {
                    rules: [{
                    required: true, message: 'Vui lòng nhập mật khẩu hiện tại!',
                    }],
                })(
                    <Input type="password" />
                )}
                </Form.Item>
               <Form.Item
                label="Mật khẩu mới"
                >
                {getFieldDecorator('password', {
                    rules: [{
                    required: true, message: 'Vui lòng nhập mật khẩu!',
                    }, {
                    validator: this.validateToNextPassword.bind(this),
                    }],
                })(
                    <Input type="password" />
                )}
                </Form.Item>
            <Form.Item

            label="Nhập lại mật khẩu"
            >
            {getFieldDecorator('confirm', {
                rules: [{
                required: true, message: 'Vui lòng nhập lại mật khẩu',
                }, {
                validator: this.compareToFirstPassword.bind(this),
                }],
            })(
                <Input type="password" onBlur={this.handleConfirmBlur.bind(this)} />
            )}
            </Form.Item>
            <Form.Item>
                <Button type="primary"  htmlType="submit"> <Icon type="lock" />Cập nhật</Button>
              </Form.Item>
            </Form>
          </Modal>
        );
      }
    }
  );
  export default ChangePasswordForm;
import React,{Component} from 'react';
import {
    Form, Button, Icon, Rate,Input, notification
  } from 'antd';
import UploadPhoto from './UploadPhoto';
import axios from 'axios';
import {ADMIN_URL} from '../../config';
import { getCurrentUser } from '../../util/APIUtils';
const FormItem = Form.Item;
const TextArea = Input.TextArea;

const openNotificationWithIcon = (type,description) => {
    notification[type]({
      message: 'Flidi App',
      description: description,
    });
  };
class PostForm extends Component {
    uploader = React.createRef();
    user_id = 1;
    constructor(props){
        console.log(props);
        super(props);
        getCurrentUser()
            .then(response => {
                console.log(response);
                this.user_id = response.id;
            }).catch(error => {
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const photos = this.uploader.current.getPhotos();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const formData = new FormData();
                photos.forEach((file) => {
                    formData.append('files[]', file.originFileObj);
                });
                for(var key in values){
                    formData.append(key,values[key]);
                }
                formData.append('user_id',this.user_id);
                formData.append('location_id',this.props.location_id);
                axios.post(`${ADMIN_URL}/api/blog/create`, formData, {
                    headers: {
                    'Content-Type': 'multipart/form-data'
                    }
                }).then(res=>{
                    console.log(res);
                    if(res.data.result){
                        openNotificationWithIcon('success','Đăng bài thành công');
                        this.props.obj.hidePostForm();
                        this.props.obj.postlist.current.loadData();
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
  
    normFile = (e) => {
      console.log('Upload event:', e);
      if (Array.isArray(e)) {
        return e;
      }
      return e && e.fileList;
    }
  
    render() {
        var formLayout = 'vertical'
        const formItemLayout = formLayout === 'horizontal' ? {
          labelCol: { span: 4 },
          wrapperCol: { span: 14 },
        } : null;
        const buttonItemLayout = formLayout === 'horizontal' ? {
          wrapperCol: { span: 14, offset: 4 },
        } : null;
        const { getFieldDecorator } = this.props.form;
        console.log(getFieldDecorator);
        return (
          <div>
            <Form layout={formLayout} onSubmit={this.handleSubmit}>
              <FormItem
                label="Tiêu đề"
                {...formItemLayout}
              >
               {getFieldDecorator('blog_title', {
                    rules: [{ required: true, message: 'Vui lòng nhập tiêu đề' }],
                })(
                    <Input placeholder="Tiêu đề" />
                )}
              </FormItem>
              <FormItem
                label="Nội dung"
                {...formItemLayout}
              >
              {getFieldDecorator('detail', {
                    rules: [{ required: true, message: 'Vui lòng nhập nội dung' }],
                })(
                    <TextArea rows={5} placeholder="Cảm nghĩ của bạn về nơi này" />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="Đánh giá"
                >
                {getFieldDecorator('rating', {
                    initialValue: 3.5,
                })(
                    <Rate />
                )}
                </FormItem>
                <Form>
                    <UploadPhoto ref={this.uploader} action={'//jsonplaceholder.typicode.com/posts/'}></UploadPhoto>
                </Form>
              <FormItem style={{marginTop:'20px'}} {...buttonItemLayout}>
                <Button type="primary"  htmlType="submit"><Icon type="form" /> Đăng bài</Button>
              </FormItem>
            </Form>
          </div>
        );
      }
  }
  
  export default Form.create()(PostForm);
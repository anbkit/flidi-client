import React,{Component} from 'react';
import PostRepository from '../../repositories/PostRepository';
import {ADMIN_URL} from '../../config';
import { getAvatarColor } from '../../util/Colors';
import axios from 'axios';
import {
    Comment, Avatar, Form, Button, List, Input,notification
  } from 'antd';
  import moment from 'moment';
  
  const TextArea = Input.TextArea;
  const openNotificationWithIcon = (type,description) => {
    notification[type]({
      message: 'Flidi App',
      description: description,
    });
  };
  const CommentList = ({ comments }) => (
    <List
      dataSource={comments}
      header={`${comments.length} bình luận`}
      itemLayout="horizontal"
      renderItem={item => <Comment 
        author={item.user.first_name + ' '+item.user.last_name} 
        content={item.detail}
        datetime={item.created_at}
        avatar={<Avatar size={'large'} style={{ backgroundColor: getAvatarColor(item.user.first_name[0].toUpperCase()) }}>
                        {item.user.first_name[0].toUpperCase()}
                    </Avatar>}
        />}
    />
  );
  
  const Editor = ({
    onChange, onSubmit, submitting, value,
  }) => (
    <div>
      <Form.Item>
        <TextArea placeholder={'Viết bình luận của bạn...'} rows={4} onChange={onChange} value={value} />
      </Form.Item>
      <Form.Item>
        <Button
          htmlType="submit"
          loading={submitting}
          onClick={onSubmit}
          type="primary"
        >
          Add Comment
        </Button>
      </Form.Item>
    </div>
  );
  
  class CommentPost extends React.Component {
    state = {
      comments: [],
      submitting: false,
      value: '',
    }

    componentDidMount(){
        this.loadData();
    }
    componentWillReceiveProps(){
        this.loadData();
    }
  
    handleSubmit = () => {
      if (!this.state.value) {
        return;
      }

      this.setState({
        submitting: true,
      });
      
      const formData = new FormData();
      formData.append('detail',this.state.value);
      formData.append('user_id',this.props.user_id);
      axios.post(`${ADMIN_URL}/api/comment/create/${this.props.item.blog_id}`, formData, {
            headers: {
            'Content-Type': 'multipart/form-data'
            }
        }).then(res=>{
            if(res.data.result){
                openNotificationWithIcon('success','Bình luận thành công');
                this.setState({
                    submitting: false,
                    value: ''
                  });
                this.loadData();
            }
            else{
                openNotificationWithIcon('error','Đã có lỗi xảy ra');
            }
        }).catch(err=>{
            openNotificationWithIcon('error','Đã có lỗi xảy ra');
        })
    }
  
    loadData(){
        PostRepository.getComments(this.props.item.blog_id)
        .then(res=>{
            console.log(res);
            this.setState({
                comments:res.data.items
            });
        })
        .catch(err=>{
            console.log(err);
        })
    }
    handleChange = (e) => {
      this.setState({
        value: e.target.value,
      });
    }
  
    render() {
      const { comments, submitting, value } = this.state;
  
      return (
        <div>
          {comments.length > 0 && <CommentList comments={comments} />}
          <Comment
            content={(
              <Editor
                onChange={this.handleChange}
                onSubmit={this.handleSubmit}
                submitting={submitting}
                value={value}
              />
            )}
          />
        </div>
      );
    }
  }
  
export default CommentPost;
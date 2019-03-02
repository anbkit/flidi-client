import React,{Component} from 'react'
import { notification, List, Avatar, Icon,Card, Carousel,Modal,Button,Dropdown ,Menu, Layout} from 'antd';
import axios from 'axios';
import {ADMIN_URL} from '../../config';
import EditPostForm from './EditPostForm';
const openNotificationWithIcon = (type,description) => {
    notification[type]({
      message: 'Flidi App',
      description: description,
    });
  };
class PopoverPost extends Component{
    state={
        visiblePostForm:false
    }
    deletePost(post){
        const cur = this;
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có muốn xóa bài viết',
            okText: 'Xóa',
            onOk:function(){
                const formData = new FormData();
                axios.post(`${ADMIN_URL}/api/blog/delete/${post.blog_id}`, formData, {
                    headers: {
                    'Content-Type': 'multipart/form-data'
                    }
                }).then(res=>{
                    if(res.data.result){
                        openNotificationWithIcon('success','Xóa bài viết thành công');
                        if(cur.props.afterDeleted){
                            cur.props.afterDeleted();
                        }
                    }
                    else{
                        openNotificationWithIcon('error','Đã có lỗi xảy ra');
                    }
                }).catch(err=>{
                    openNotificationWithIcon('error','Đã có lỗi xảy ra');
                })
            },
            cancelText: 'Hủy',
          });
    }

    editPost(post){
        this.setState({
            visiblePostForm:true
        })
    }

    hidePostForm(){
        this.setState({
            visiblePostForm:false
        })
    }
    render(){
        const item = this.props.item;
        var fileList= [];
        item.image.map(function(img_src){
            fileList.push({
                uid: '-1',
                name: 'xxx.png',
                status: 'done',
                url: img_src,
              })
        });
        fileList.reverse();
        return (
        <div style={{height:'22px'}}>
             <Modal
                title="Cập nhật bài viết"
                visible={this.state.visiblePostForm}
                footer={null}
                width={650}
                onCancel={this.hidePostForm.bind(this)}
            >
                <EditPostForm onCancel={this.hidePostForm.bind(this)} postlist={this.props.postlist} fileList={fileList} obj={this} item={item}></EditPostForm>
            </Modal>
       
       <Dropdown trigger={['click']} overlay={
            <Menu>
                <Menu.Item onClick={this.deletePost.bind(this,item)} key="1">Xóa bài viết</Menu.Item>
                <Menu.Item onClick={this.editPost.bind(this,item)} key="2" >Cập nhật bài viết</Menu.Item>
            </Menu>
        }>
        <Button shape='circle'>
            <Icon type="ellipsis" />
        </Button>
        </Dropdown>
        </div>
        )
    }
}
export default PopoverPost;
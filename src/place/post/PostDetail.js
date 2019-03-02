import React,{Component} from 'react';
import {
    Form, Button, Rate,Input, notification,List,Avatar, Icon,Card,Carousel, Comment, Tooltip
  } from 'antd';
import UploadPhoto from './UploadPhoto';
import moment from 'moment';
import axios from 'axios';
import {ADMIN_URL} from '../../config';
import { getCurrentUser } from '../../util/APIUtils';
import { getAvatarColor } from '../../util/Colors';
import CommentPost from './CommentPost';
import PostRepository from '../../repositories/PostRepository';
import {
    Link,
    withRouter
} from 'react-router-dom';
const FormItem = Form.Item;
const TextArea = Input.TextArea;

const IconText = ({ type, text }) => (
	<span>
		<Icon type={type} style={{ marginRight: 8 }} />
		{text}
	</span>
);
const openNotificationWithIcon = (type,description) => {
    notification[type]({
      message: 'Flidi App',
      description: description,
    });
  };
class PostDetail extends Component {
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
    state={
        isLiked:false,
        likes:[]
    }

    componentWillMount(){
        this.loadLikes();
    }
    loadLikes(){
        PostRepository.getLikes(this.props.item.blog_id)
        .then(res=>{
            var cur = this;
            res.data.items.map(function(item){
                if(item.user_id==cur.user_id){
                    cur.setState({
                        isLiked:true
                    });
                }
            })
            this.setState({
                likes:res.data.items
            });
        })
        .catch(err=>{
            console.log(err);
        })
    }

    handLike(e){
        e.preventDefault();
        const formData = new FormData();
        formData.append('user_id',this.user_id);
        var url = `${ADMIN_URL}/api/blog/like/${this.props.item.blog_id}`;
        if(this.state.isLiked){
            var url = `${ADMIN_URL}/api/blog/unlike/${this.props.item.blog_id}`;
        }
        axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res=>{
                if(res.data.result){
                    openNotificationWithIcon('success',!this.state.isLiked?'Bạn đã thích':'Bạn đã bỏ thích');
                    this.setState({
                        isLiked:!this.state.isLiked
                    })
                    this.loadLikes();
                }
                else{
                    openNotificationWithIcon('error','Đã có lỗi xảy ra');
                }
            }).catch(err=>{
                openNotificationWithIcon('error','Đã có lỗi xảy ra');
            })
    }
    handleSubmit = (e) => {
        e.preventDefault();
        return false;
    }

    render() {
        const item = this.props.item;
        return( 
            <List
            itemLayout="vertical"
            size="large"
            dataSource={[item]}
            renderItem={item => (
            <List.Item 
                key={item.title}
            >
                 <Card 
                        style={{ width: '100%' }}
                        cover={
                            <Carousel autoplay style={{height:600}}>
                                {
                                    item.image.map(function(img_src){
                                        return <img src={img_src} />
                                    })
                                }
                            </Carousel>
                        }
                    >
                    </Card>
                        <List.Item.Meta
                            avatar={<Link to={`/users/${item.user.username}/posts`}>
                            <Avatar size={'large'} style={{ backgroundColor: getAvatarColor(item.user.first_name[0].toUpperCase()) }}>
                            {item.user.first_name[0].toUpperCase()}
                            </Avatar>
                        </Link>}
                            title={
                                <Link to={`/users/${item.user.username}/posts`}>
                                    {item.user.first_name + ' '+item.user.last_name}
                                </Link>
                            }
                            description={item.created_at_str}
                        />
                    <div style={{marginTop:'10px'}}>
                        <p>{item.detail}</p>
                    </div>
                    <Button type={this.state.isLiked?'primary':'default'} onClick={this.handLike.bind(this)}>
                        <IconText type="like-o" text={this.state.likes.length} />
                    </Button>
                    <CommentPost user_id={this.user_id} item={item}></CommentPost>
           </List.Item> 
           )}
           />
        )   
    }
  }
  
  export default PostDetail;
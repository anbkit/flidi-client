import React,{Component} from 'react'
import PostRepository from '../../repositories/PostRepository';
import { List, Avatar, Icon,Card, Carousel,Modal,Button,Dropdown ,Menu} from 'antd';
import { getAvatarColor } from '../../util/Colors';
import ItemPost from './Item';
import PostDetail from './PostDetail';
import PopoverPost from './PopoverPost';
import { getCurrentUser } from '../../util/APIUtils';
import './Post.css';
import {
    Link,
    withRouter
} from 'react-router-dom';
/*const listData = [];
listData.push({
	href: '#',
	title: `An Nguyen`,
	avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
	description: '2018-01-12 12:20',
	image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjs49pcEPvxA9eCcex-SzWWDGeAywZON29j2ejwbLO3DHo6ZmBxg',
	content: 'Với sân đỗ trực thăng độc đáo cùng nhiều văn phòng, khu mua sắm, vui chơi giải trí hiện đại, tòa tháp Bitexco là một trong những biểu tượng của TP HCM sau 40 năm giải phóng.Tọa lạc tại quận 1, tháp tài chính Bitexco nằm ở "trái tim" thành phố, biểu thị cho sự hiện đại, năng động và hội nhập của Sài Gòn',
});

listData.push({
	href: '#',
	title: `Dai Tran`,
	image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhif7oo6UwnBf1c8x-OwPG90rPfVBUHR2grxF1OoLRRmBfS0-j',
	avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
	description: '2017-02-10 12:20',
	content: 'Tòa nhà Bitexco gồm 68 tầng lầu và 3 tầng hầm, tổng chiều cao là 262m. Bên trong tòa nhà bao gồm nhiều khu như văn phòng, khu nhà hàng, khu trung tâm mua sắm, khu thực phẩm, rạp chiếu phim, khu vui chơi giải trí v.v..giá dịch vụ cũng khá đắt đỏ nhưng hợp lý và khách tham quan cần tuân thủ một số qui định của tòa nhà',
});*/

const IconText = ({ type, text,onClick }) => (
	<span onClick={onClick}>
		<Icon type={type} style={{ marginRight: 8 }} />
		{text}
	</span>
);

class PostList extends Component{
		constructor(props){
            super(props);
            getCurrentUser()
                .then(response => {
                    console.log(response);
                    this.user_id = response.id;
                    this.setState({
                        user_id:response.id
                    })
                }).catch(error => {
            });
        }
        user_id = null;
		state = {
            listData:[],
            visiblePost:false,
            item:{},
            user_id:null,
            title_post:''
        }
        componentDidMount(){
            this.loadData();
        }

		loadData(){
            if(!this.props.is_user_page){
                PostRepository.getList(this.props.location_id)
                .then(res=>{
                    console.log(res);
                    this.setState({
                        listData:res.data.items
                    });
                })
                .catch(err=>{
                    console.log(err);
                })
            }
            else{
                PostRepository.getListByUser(this.props.user_id)
                .then(res=>{
                    console.log(res);
                    this.setState({
                        listData:res.data.items
                    });
                })
                .catch(err=>{
                    console.log(err);
                })
            }
		}

        showPost(item){
            this.setState({
                visiblePost:true,
                item:item,
                title_post:item.blog_title
            })
        }
    
        hidePost(){
            this.setState({
                visiblePost:false
            })
        }

        

		render(){
            return  <div>
                {
                <Modal
                    title={this.state.title_post}
                    visible={this.state.visiblePost}
                    footer={null}
                    width={650}
                    onCancel={this.hidePost.bind(this)}
                >
                    <PostDetail item={this.state.item}></PostDetail>
                </Modal>
                }
                <List
            itemLayout="vertical"
            size="large"
            dataSource={this.state.listData}
            renderItem={item => (
                <List.Item
                    style={{ width: 550,marginTop:40 }}
                    key={item.title}
                    actions={[
                        <IconText onClick={this.showPost.bind(this,item)} type="like-o" text={item.likes.length} />, 
                        <IconText onClick={this.showPost.bind(this,item)} type="message" text={item.comments.length} />
                    ]}
                    >
                    <Card
                        onClick={this.showPost.bind(this,item)}
                        style={{ width: 550,cursor:'pointer' }}
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
                            <div style={{flex:1,flexDirection:'row',justifyContent:'space-between',display: 'flex'}}>
                                <Link to={`/users/${item.user.username}/posts`}>
                                {item.user.first_name + ' '+item.user.last_name}
                                </Link>
                                {this.state.user_id==item.user_id?<PopoverPost postlist={this} afterDeleted={this.loadData.bind(this)} item={item}></PopoverPost>:null}
                            </div>
                            
                            
                        }
                        description={
                            item.created_at_str
                        }
                    />
                    <div style={{marginTop:'10px'}}>
                        {
                            this.props.is_user_page?
                            <p>
                                <Link to={`/place/${item.location.province_id}/${item.location.location_id}`}>
                                    <Icon type="environment"></Icon> {item.location.location_name}
                                </Link>
                            </p>
                            :null
                        }
                        <h6>{item.blog_title}</h6>
                        <p>{item.detail}</p>
                    </div>
                </List.Item>
            )}
        />
        </div>
    }
}
export default PostList;
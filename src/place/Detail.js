import React, {Component} from 'react';
import { Tabs,Layout,Card,Icon,Button,Modal,Menu} from 'antd';
import { StickyContainer, Sticky } from 'react-sticky';
import PhotoList from './photo/PhotoList';
import PostList from './post/PostList';
import Item from '../maps/Item';
import PostForm from './post/PostForm';
import PlaceRepository from '../repositories/PlaceRepository';
import { withRouter } from 'react-router-dom';
import SidebarItem from '../maps/SidebarItem';
import { GoogleMap,withGoogleMap,withScriptjs} from "react-google-maps"
import {GOOGLE_MAPS_API_KEY,DEFAULT_PROVINCE} from '../constants/index';
import {ADMIN_URL} from '../config';
const { Meta } = Card;
const {
    Sider
} = Layout;

const TabPane = Tabs.TabPane;

const renderTabBar = (props, DefaultTabBar) => (
  <Sticky bottomOffset={80}>
    {({ style }) => (
      <DefaultTabBar {...props} style={{ ...style, zIndex: 1, background: '#fff' }} />
    )}
  </Sticky>
);

class Detail extends Component{
    postlist = React.createRef();
    constructor(props){
        super(props);
        console.log(this.props.match.params);
    }

    state = {
        visiblePostForm:false,
        item:{},
        items:[],
        centerCoordinate:{lat:10.823099,lng:106.629662}
    }

    componentDidMount(){
        this.setState({
           item:PlaceRepository.read(this.props.match.params.id).then(res=>{
               console.log(res.data);
               this.setState({
                   item:res.data
               })
               this.setState({
                centerCoordinate:{
                    lat:res.data.latitude,
                    lng:res.data.longitude
                }
            })
           })
        })
        PlaceRepository.getPlaces(this.props.match.params.pid).then(res=>{
            var items = [];
            var id = this.props.match.params.id;
            res.data.map(item=>{
                if(item.id!=id){
                    items.push(item);
                }
            })
            this.setState({
                items:items
            })
        })
    }

    showPostForm(){
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
        var item = this.state.item;
        console.log(item);
        var MyMapComponent = withScriptjs(withGoogleMap(props => {
            return <GoogleMap
                defaultZoom={12}
                defaultCenter={this.state.centerCoordinate}
            >
            </GoogleMap>
          }))
          if(item){
            var MyMapComponent = withScriptjs(withGoogleMap(props => {
                return <GoogleMap
                    defaultZoom={14}
                    defaultCenter={this.state.centerCoordinate}
                >
                <Item data={item}> </Item>
                </GoogleMap>
              }))
          }
        
        return(
            <div className="container">
                <Layout>
                    <Modal
                        title="Đăng bài"
                        visible={this.state.visiblePostForm}
                        footer={null}
                        width={650}
                        onCancel={this.hidePostForm.bind(this)}
                    >
                        <PostForm obj={this} location_id={this.props.match.params.id}></PostForm>
                    </Modal>
                <Card
                    height={350}
                    style={{overflow:'hidden',height:'450px'}}
                    cover={<img style={{maxHeight:'340px'}} alt="example" src={ADMIN_URL+'/storage/'+this.state.item.cover} />}
                >
                <Meta
                    title={<h5>{this.state.item.name}</h5>}
                    description={this.state.item.address}
                />
                </Card>
                    <StickyContainer>
                        <Layout>
                        <Sider width={300}>
                            <Card title="Địa điểm lân cận" bordered={false} style={{ width: 300 }}>
                            </Card>
                            <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
                             {this.state.items.map(function(item,key){
                                return <SidebarItem width={300} data={item} key={key}></SidebarItem>
                            })}
                    </Menu>
                        </Sider>
                        <Tabs style={{marginLeft:30}} defaultActiveKey="1" renderTabBar={renderTabBar}>
                            <TabPane tab={<span><Icon type="info-circle" />Giới thiệu</span>} key="1" style={{ height: 200 }}>
                            <p>{this.state.item.detail}</p>
                            </TabPane>
                            <TabPane tab={<span><Icon type="picture" />Hình ảnh</span>} key="2">
                                <PhotoList place_id={this.props.match.params.id}></PhotoList>
                            </TabPane>
                            <TabPane tab={<span><Icon type="form" />Bài viết</span>} key="3">
                                <Button onClick={this.showPostForm.bind(this)} type="primary"><Icon type="form" /> Viết bài</Button>
                                <PostList place={this.state.item} ref={this.postlist} location_id = {this.props.match.params.id}></PostList>
                            </TabPane>
                            <TabPane tab={<span><Icon type="environment" />Bản đồ</span>} key="4">
                            <MyMapComponent
                                isMarkerShown
                                googleMapURL={"https://maps.googleapis.com/maps/api/js?key="+GOOGLE_MAPS_API_KEY+"&v=3.exp&libraries=geometry,drawing,places"}
                                loadingElement={<div style={{ height: `100%` }} />}
                                containerElement={<div style={{ height: `800px` }} />}
                                mapElement={<div style={{ height: `100%` }} />}
                            />
                            </TabPane>
                        </Tabs>
                        </Layout>
                    </StickyContainer>
                </Layout>
            </div>
        )
    }
}

export default withRouter(Detail);
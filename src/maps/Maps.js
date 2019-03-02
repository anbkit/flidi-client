import React,  {Component} from 'react';
import { GoogleMap,withGoogleMap,withScriptjs} from "react-google-maps"
import Item from './Item';
import SidebarItem from './SidebarItem';
import {GOOGLE_MAPS_API_KEY,DEFAULT_PROVINCE} from '../constants/index';
import { Layout, Menu, Icon } from 'antd';
import PlaceRepository from '../repositories/PlaceRepository'; 
import ProvinceRepository from '../repositories/ProvinceRepository';
const queryString = require('query-string');
const {
    Sider
} = Layout;

class Maps extends Component{
    constructor(props){
        super(props);
        this.query = queryString.parseUrl(window.location.href).query;
    }
    state = {
        items:[],
        province:{},
        centerCoordinate:{lat:10.823099,lng:106.629662}
    }

    componentDidMount(){
        var pid = this.query.pid?this.query.pid:DEFAULT_PROVINCE;
        var keyword = this.query.keyword?this.query.keyword:'';
        console.log(pid);
        ProvinceRepository.get(pid).then(res=>{
            console.log(res);
            this.setState({
                province:res.data,
                centerCoordinate:{
                    lat:res.data.latitude,
                    lng:res.data.longitude
                }
            })
        });
        PlaceRepository.search(pid,keyword).then(res=>{
            this.setState({
                items:res.data
            })
        })
    }
    render(){
        const MyMapComponent = withScriptjs(withGoogleMap(props => {
            return <GoogleMap
                defaultZoom={14}
                defaultCenter={this.state.centerCoordinate}
            >
            {this.state.items.map(function(item,key){
                return <Item key={key} data={item}> </Item>
            })}
            </GoogleMap>
          }))
        
        return (
            <Layout>
                <Sider width={400} style={{
                        overflow: 'auto', height: '100vh', position: 'fixed', left: 0,
                        borderTop:1,
                        backgroundColor:'#e7eaec'
                    }}
                    trigger={null}
                    collapsible
                    >
                    <Menu theme="dark" style={{backgroundColor:'#e7eaec'}} mode="inline" defaultSelectedKeys={['4']}>
                        {this.state.items.map(function(item,key){
                            return <SidebarItem data={item} key={key}></SidebarItem>
                        })}
                    </Menu>
                </Sider>
                <Layout style={{ marginLeft:400 }}>
                
                <MyMapComponent
                    isMarkerShown
                    googleMapURL={"https://maps.googleapis.com/maps/api/js?key="+GOOGLE_MAPS_API_KEY+"&v=3.exp&libraries=geometry,drawing,places"}
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `800px` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                />
                </Layout>
            </Layout>
        );

    }
}
export default Maps;
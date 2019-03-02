/*global google*/ 
import React, {Component} from 'react';
import {Marker,InfoWindow} from "react-google-maps"
import {
	Link,
	withRouter
} from 'react-router-dom';

const { MarkerWithLabel } = require("react-google-maps/lib/components/addons/MarkerWithLabel");
class  Item extends Component{
    constructor(props){
        super(props);
    }

    state = {
        visibleLabel:false
    }

    hoverMakerHandle(){
       this.setState({
            visibleLabel:true
       });
    }

    hoverOutMakerHandle(){
        this.setState({
            visibleLabel:false
       });
    }

    clickHandle(){
        var item = this.props.data;
        this.props.history.push(`/place/${item.province_id}/${item.id}`);
    }

    render(){
        console.log(this.props);
        return (
            <Marker
                position={{ lat: this.props.data.latitude, lng:this.props.data.longitude }}
                label={''}
                onMouseOver={()=>this.hoverMakerHandle()}
                onClick={()=>{this.clickHandle()}}
            >
                <MarkerWithLabel
                    onMouseOver={()=>this.hoverMakerHandle()}
                    onMouseOut={()=>this.hoverOutMakerHandle()}
                    visible={this.state.visibleLabel}
                    position={{ lat: this.props.data.latitude, lng:this.props.data.longitude}}
                    labelAnchor={new google.maps.Point(0, 0)}
                    labelStyle={{backgroundColor: "#fff", fontSize: "15px", padding: "14px"}}
                >
                    <div>{this.props.data.address}</div>
                </MarkerWithLabel>
                {<InfoWindow>
                    <div style={{fontSize:'14px'}}>{this.props.data.name}</div>
                </InfoWindow>}
            </Marker> 
        )
    }
}
export default Item;
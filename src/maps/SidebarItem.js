import React from 'react';
import {
	 Switch, Card, Icon, Avatar,Rate
  }from 'antd';
import { Skeleton } from 'antd';
import {
	Link,
	withRouter
} from 'react-router-dom';
  const { Meta } = Card;
  class SidebarItem extends React.Component {
	state = {
	  loading: false,
	}

	constructor(props){
		super(props);
	}
  
	onChange = (checked) => {
	  this.setState({ loading: !checked });
	}
  
	render() {
	  const { loading } = this.state;
	  var item = this.props.data;
	  return (
		<div>
		  <Card
		  hoverable ={true}
		  style={{ width: this.props.width?this.props.width:400, marginTop: 16 }}
		  actions={[
			<div>
				<span style={{marginRight:'3px'}}>12</span>
				<Icon type="message" />
	  </div>,
	  <div>
		<span style={{marginRight:'3px'}}>20</span>
		<Icon type="picture" />
	   </div>
	   ,
	   <div>
		<span style={{marginRight:'3px'}}>14</span>
			   <Icon type="user-add" />
	   </div>
		]}
		>
		  <Skeleton loading={loading} avatar active>
			<Meta
			  avatar={<Avatar size={'large'}  shape={'square'} src={item.image} />}
			  title={
					<Link to={`/place/${item.province.id}/${item.id}`}>{item.name}</Link>
				}
			  description={
					<div>
						<div>{item.address}</div>
						<div>{item.des}</div>
						<Rate disabled allowHalf defaultValue={item.rating} />
				  </div>
				}
			/>
		  </Skeleton>
		</Card>
		</div>
	  );
	}
  }
  export default withRouter(SidebarItem);
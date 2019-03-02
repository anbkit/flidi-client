import React, { Component } from 'react';
import {
    Link,
    withRouter
} from 'react-router-dom';
import './AppHeader.css';
import {AppContext}  from "../app/context";
import { Layout, Menu, Dropdown, Icon,Row, Col,Button} from 'antd';
import SearchBox from './SearchBox';

const Header = Layout.Header;
class AppHeader extends Component {
    showModalLogin = ()=>{
    };
    showModalSignup = ()=>{
    };
    constructor(props) {
        super(props);
        this.handleMenuClick = this.handleMenuClick.bind(this);
    }

    handleMenuClick({ key }) {
        if (key === "logout") {
            this.props.onLogout();
        }
        if(key==="login"){
            this.showModalLogin();
        }
    }

    render() {
        let menuItems;
        if (this.props.currentUser) {
            menuItems = [
                <Menu.Item key="/">
                    <Link to="/">
                        <Icon type="home" className="nav-icon" />
                    </Link>
                </Menu.Item>,
                <Menu.Item key="/profile" className="profile-menu">
                    <ProfileDropdownMenu
                        currentUser={this.props.currentUser}
                        handleMenuClick={this.handleMenuClick} />
                </Menu.Item>
            ];
        } else {
            menuItems = [

                <Menu.Item style={{borderBottom:'0px solid red'}} onClick={()=>{this.showModalLogin()}} key="login">
                     <Button type="primary">
                        Đăng nhập
                    </Button>
                </Menu.Item>,
                <Menu.Item style={{borderBottom:'0px solid red'}} onClick={()=>{this.showModalSignup()}} key="signup">
                    <Button  type="primary">
                        Đăng ký
                    </Button>
                </Menu.Item>
            ];
        }

        return (
            <AppContext.Consumer>
                {({showModalLogin,showModalSignup}) => {
                    this.showModalLogin = showModalLogin;
                    this.showModalSignup = showModalSignup;
                    return (
                <Header className="app-header">
                    <div className="container">
                    <Row>
                        <Col span={4}>
                        <div className="app-title" >
                            <Link to="/"><Icon style={{fontSize:25,marginRight:4}} type="environment" /><span>Flidi</span></Link>
                        </div>
                        </Col>
                        <Col span={10}>
                            <SearchBox></SearchBox>
                        </Col>
                        <Menu
                            className="app-menu"
                            mode="horizontal"
                            selectedKeys={[this.props.location.pathname]}
                            style={{ lineHeight: '62px',borderBottom:'0px solid red'}} >
                            {menuItems}
                        </Menu>
                        </Row>
                    </div>
                    </Header>)}}
            </AppContext.Consumer>
        );
    }
}

AppHeader.contextType = AppContext;
function ProfileDropdownMenu(props) {
    const dropdownMenu = (
        <Menu onClick={props.handleMenuClick} className="profile-dropdown-menu">
            <Menu.Item key="user-info" className="dropdown-item" disabled>
                <div className="user-full-name-info">
                    {props.currentUser.name}
                </div>
                <div className="username-info">
                    @{props.currentUser.username}
                </div>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="listpost" className="dropdown-item">
                <Link to={`/users/${props.currentUser.username}/posts`}>Bài viết</Link>
            </Menu.Item>
            <Menu.Item key="profile" className="dropdown-item">
                <Link to={`/users/${props.currentUser.username}`}>Profile</Link>
            </Menu.Item>
            <Menu.Item key="logout" className="dropdown-item">
                Logout
            </Menu.Item>
        </Menu>
    );

    return (
        <Dropdown
            overlay={dropdownMenu}
            trigger={['click']}
            getPopupContainer={() => document.getElementsByClassName('profile-menu')[0]}>
            <a className="ant-dropdown-link">
                <Icon type="user" className="nav-icon" style={{ marginRight: 0 }} /> <Icon type="down" />
            </a>
        </Dropdown>
    );
}

export default withRouter(AppHeader);
import React, { Component } from 'react';
import {
    Link,
    withRouter
} from 'react-router-dom';
import './AppHeader.css';
import { Layout, Menu, Dropdown, Icon } from 'antd';
const Footer = Layout.Footer;


class AppFooter extends Component {

    render(){
        return(
            <Footer theme="dark" style={{ textAlign: 'center' }}>
               Flidi ©2018. All right reserved
            </Footer>
        );
    }
}
export default AppFooter;
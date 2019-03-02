import React, { Component } from 'react';
import './App.css';
import {
    Route,
    withRouter,
    Switch
} from 'react-router-dom';

import { getCurrentUser } from '../util/APIUtils';
import { ACCESS_TOKEN } from '../constants';

import Login from '../user/login/Login';
import Signup from '../user/signup/Signup';
import Profile from '../user/profile/Profile';
import UserPost from '../user/profile/UserPost';
import AppHeader from '../common/AppHeader';
import AppFooter from '../common/AppFooter';
import Maps from '../maps/Maps';
import NotFound from '../common/NotFound';
import LoadingIndicator from '../common/LoadingIndicator';
import PrivateRoute from '../common/PrivateRoute';

import { Layout, notification,Modal } from 'antd';
import Blank from '../blank/Blank';
import {AppContext}  from "./context";
import Detail from '../place/Detail';

const { Content } = Layout;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            isAuthenticated: false,
            isLoading: false,
            loginVisible:false,
            signupVisible:false,
            showModalLogin: this.showModalLogin,
            hideModalLogin: this.hideModalLogin,
            showModalSignup: this.showModalSignup,
            hideModalSignup: this.hideModalSignup
        }
        this.handleLogout = this.handleLogout.bind(this);
        this.loadCurrentUser = this.loadCurrentUser.bind(this);
        this.handleLogin = this.handleLogin.bind(this);

        notification.config({
            placement: 'topRight',
            top: 70,
            duration: 3,
        });
    }

    showModalLogin = () => {
        this.setState({
            loginVisible: true,
        });
    }

    hideModalLogin = ()=>{
        this.setState({
            loginVisible: false,
        });
    }

    showModalSignup = () => {
        this.setState({
            signupVisible: true,
        });
    }

    hideModalSignup = ()=>{
        this.setState({
            signupVisible: false,
        });
    }

    loadCurrentUser() {
        this.setState({
            isLoading: true
        });
        getCurrentUser()
            .then(response => {
                this.setState({
                    currentUser: response,
                    loginVisible:false,
                    isAuthenticated: true,
                    isLoading: false
                });
            }).catch(error => {
                this.setState({
                    isLoading: false
                });
            });
    }

    componentWillMount() {
        this.loadCurrentUser();
    }

    handleLogout(redirectTo = "/", notificationType = "success", description = "You're successfully logged out.") {
        localStorage.removeItem(ACCESS_TOKEN);

        this.setState({
            currentUser: null,
            isAuthenticated: false
        });

        this.props.history.push(redirectTo);

        notification[notificationType]({
            message: 'Flidi App',
            description: description,
        });
    }

    handleLogin() {
        notification.success({
            message: 'Flidi App',
            description: "You're successfully logged in.",
        });
        this.loadCurrentUser();
        this.props.history.push("/");
    }

    render() {
        if (this.state.isLoading) {
            return <LoadingIndicator />
        }
        console.log(this.state);
        return (
            <Layout className="app-container">
             <AppContext.Provider value={this.state}>
                <Modal
                    title="Đăng nhập"
                    visible={this.state.loginVisible}
                    onCancel={this.hideModalLogin}
                    footer={null}
                    >
                    <Login onLogin={this.handleLogin} ></Login>
                </Modal>
                <Modal
                    title="Đăng ký"
                    visible={this.state.signupVisible}
                    onCancel={this.hideModalSignup}
                    footer={null}
                    >
                    <Signup></Signup>
                </Modal>
                <AppHeader isAuthenticated={this.state.isAuthenticated}
                    currentUser={this.state.currentUser}
                    onLogout={this.handleLogout} />

                <Content className="app-content">
                        <Switch>
                            <Route exact path="/" render={(props) => <Blank />}></Route>
                            <Route path="/login"
                                render={(props) => <Login onLogin={this.handleLogin} {...props} />}>
                            </Route>
                            <Route path="/maps"
                                render={(props) => <Maps {...props} />}>
                            </Route>
                            <Route path="/place/:pid/:id"
                                render={(props) => <Detail {...props} />}>
                            </Route>
                            <Route path="/signup" component={Signup}></Route>
                            <Route path="/users/:username/posts"
                                render={(props) => <UserPost  currentUser={this.state.currentUser} {...props} />}>
                            </Route>
                            <Route path="/users/:username"
                                render={(props) => <Profile isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props} />}>
                            </Route>
                            <Route component={NotFound}></Route>
                        </Switch>
                </Content>
                <AppFooter></AppFooter>
                </AppContext.Provider>
            </Layout>
        );
    }
}

export default withRouter(App);

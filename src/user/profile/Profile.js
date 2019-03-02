import React, { Component } from 'react';
import { getUserProfile } from '../../util/APIUtils';
import { Avatar,Button } from 'antd';
import { getAvatarColor } from '../../util/Colors';
import { formatDate } from '../../util/Helpers';
import LoadingIndicator from '../../common/LoadingIndicator';
import './Profile.css';
import NotFound from '../../common/NotFound';
import ServerError from '../../common/ServerError';
import ChangePasswordForm from './ChangePassword';
import UpdateInfoForm from './UpdateInfo';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isLoading: false,
            visible: false,
            visibleInfo:false
        }
        this.loadUserProfile = this.loadUserProfile.bind(this);
    }

    loadUserProfile(username) {
        this.setState({
            isLoading: true
        });

        getUserProfile(username)
            .then(response => {
                this.setState({
                    user: response,
                    isLoading: false
                });
            }).catch(error => {
                if (error.status === 404) {
                    this.setState({
                        notFound: true,
                        isLoading: false
                    });
                } else {
                    this.setState({
                        serverError: true,
                        isLoading: false
                    });
                }
            });
    }

    componentDidMount() {
        const username = this.props.match.params.username;
        this.loadUserProfile(username);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.match.params.username !== nextProps.match.params.username) {
            this.loadUserProfile(nextProps.match.params.username);
        }
    }

    showModal = () => {
        this.setState({ visible: true });
    }
    
    handleCancel = () => {
        this.setState({ visible: false });
    }

    showModalInfo = () => {
        this.setState({ visibleInfo: true });
    }
    
    handleCancelInfo = () => {
        this.setState({ visibleInfo: false });
    }
    
    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }

    render() {
        if (this.state.isLoading) {
            return <LoadingIndicator />;
        }

        if (this.state.notFound||!this.props.isAuthenticated) {
            return <NotFound />;
        }

        if (this.state.serverError) {
            return <ServerError />;
        }

        return (
            <div className="profile">
                {
                    this.state.user!=null?
                    <div>
                        <ChangePasswordForm
                            user={this.state.user}
                            wrappedComponentRef={this.saveFormRef}
                            visible={this.state.visible}
                            onCancel={this.handleCancel}
                            />
                        <UpdateInfoForm
                            user={this.state.user}
                            wrappedComponentRef={this.saveFormRef}
                            visible={this.state.visibleInfo}
                            onCancel={this.handleCancelInfo}
                            />
                            }
                    </div>
                    :<div></div>
                }
                {
                    this.state.user ? (
                        <div className="user-profile">
                            <div className="user-details">
                                <div className="user-avatar">
                                    <Avatar className="user-avatar-circle" style={{ backgroundColor: getAvatarColor(this.state.user.name) }}>
                                        {this.state.user.name[0].toUpperCase()}
                                    </Avatar>
                                </div>
                                <div className="user-summary">
                                    <div className="full-name">{this.state.user.name}</div>
                                    <div className="username">@{this.state.user.username}</div>
                                    <div className="user-joined">
                                        Joined {formatDate(this.state.user.joinedAt)}
                                    </div>
                                    <div style={{marginTop:'10px'}}>
                                        <Button style={{textAlign:'left'}} onClick={this.showModalInfo.bind(this)} type="default" block={true} icon="info-circle">Cập nhật thông tin</Button>
                                    </div>
                                    <div style={{marginTop:'10px'}}>
                                        <Button style={{textAlign:'left'}} onClick={this.showModal.bind(this)} type="default" block={true} icon="lock">Đổi mật khẩu</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null
                }
            </div>
        );
    }
}

export default Profile;
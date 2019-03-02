import React,{Component} from 'react'
import { Upload, Icon, Modal } from 'antd';
import firebase from 'firebase';
import {FIREBASE_CONFIG,ADMIN_URL} from '../../config';
import axios from 'axios';
import reqwest from 'reqwest';
console.log(FIREBASE_CONFIG);
firebase.initializeApp(FIREBASE_CONFIG);
const storage = firebase.storage();

class UploadPhoto extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: []
  };

  componentWillMount(){
    const fileList= this.props.fileList?this.props.fileList:[];
    var cur = this;
    fileList.forEach((file) => {
        fetch(file.url)
            .then(res => res.blob()) // Gets the response and returns it as a blob
            .then(blob => {
                // Here's where you get access to the blob
                // And you can use it for whatever you want
                // Like calling ref().put(blob)

                // Here, I use it to make an image appear on the page
                console.log(blob);
                let objectURL = URL.createObjectURL(blob);
                var image = new File([blob], file.url.split('/').pop(),{type: blob.type, lastModified: Date.now()})
                console.log(image);
                image.uid = file.url.split('/').pop();
                image.url = file.url;
                image.src = file.url;
                cur.uploadFile(image);
            });
    });
  }
  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  getPhotos(){
    const { fileList } = this.state;
    return fileList;
  }
  uploadFile(file,fileList){
      console.log(file);
      this.setState(state => ({
        fileList: [...state.fileList, file],
      }));
      console.log(this.state.fileList);
      return false;
  }

  handleChange = ({ fileList }) => this.setState({ fileList })

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="camera" />
        <div className="ant-upload-text">Hình ảnh</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          listType="picture-card"
		  fileList={fileList}
		  beforeUpload={this.uploadFile.bind(this)}
		  multiple={true}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default UploadPhoto;
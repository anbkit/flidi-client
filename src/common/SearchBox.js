import React,{Component} from 'react';
import ProvinceRepository from '../repositories/ProvinceRepository';
import {Input,Select} from 'antd';
import {
    withRouter
} from 'react-router-dom'

const Search = Input.Search;
const Option = Select.Option;
const queryString = require('query-string');
  
class SearchBox extends Component{
    position = 'header';
    constructor(props){
        super(props);
    }
    componentDidMount(){
        ProvinceRepository.getList().then((res)=>{
            this.setState({
                ProvinceList:res.data
            })
        })
    }
    query = {

    };
    state = {
        province_id:1,
        ProvinceList:[]
    }

    handleSearch(keyword){
        var params = {
            keyword:keyword,
            pid:this.state.province_id
        };
        var search_url =  '/maps?'+Object.keys(params).map(key => key + '=' + params[key]).join('&');
        this.props.history.push(search_url);
    }

    render(){
        this.query = queryString.parseUrl(window.location.href).query;
        var ProvinceList = this.state.ProvinceList;
        var selectAfter = (
            <Select defaultValue={this.query.pid} onChange={(val)=>{this.setState({province_id:val})}} defaultValue="Hồ Chí Minh" style={{ width: 124 }}>
                {ProvinceList.map((item,key)=>{
                    return <Option key={key} value={item.id}>{item.name}</Option>
                })}
            </Select>
        );
        if(this.props.position=='banner'){
            return (<Search
                size={'large'}
                placeholder="Bạn muốn đi đâu?"
                onSearch={value => this.handleSearch(value)}
                enterButton="Tìm kiếm"
                className={'search-home'}
                style={{display:'inline-block',verticalAlign:'middle'}}
                addonBefore={selectAfter}
            />
        )
        }
        else{
            return (<Search
                placeholder="Bạn muốn đi đâu?"
                onSearch={value => this.handleSearch(value)}
                enterButton
                className={'search-home'}
                style={{display:'inline-block',verticalAlign:'middle'}}
                addonBefore={selectAfter}
            />
        )
        }
    }
}
export default withRouter(SearchBox)
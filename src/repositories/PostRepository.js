import axios from 'axios';
import {ADMIN_URL} from '../config';

var PlaceRepository = {};
PlaceRepository.getList=(location_id)=>{
    return axios.get(`${ADMIN_URL}/api/blog/list/${location_id}`);
}
PlaceRepository.getListByUser=(user_id)=>{
    return axios.get(`${ADMIN_URL}/api/blog/posts/${user_id}`);
}
PlaceRepository.getComments=(blog_id)=>{
    return axios.get(`${ADMIN_URL}/api/blog/comments/${blog_id}`);
}
PlaceRepository.getLikes=(blog_id)=>{
    return axios.get(`${ADMIN_URL}/api/blog/likes/${blog_id}`);
}


export default PlaceRepository;
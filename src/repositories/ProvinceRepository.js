import axios from 'axios';
import {API_BASE_URL,ACCESS_TOKEN} from '../constants/index';
var ProvinceRepository = {};
ProvinceRepository.List = [
    {id:1,name:'Hồ Chí Minh'},
    {id:2,name:'Hà Nội'},
    {id:3,name:'Đà Lạt'},
    {id:4,name:'Đà Nẵng'},
    {id:5,name:'Hội An'},
    {id:7,name:'Sapa'}
];

ProvinceRepository.getList=()=>{
    return axios.get(`${API_BASE_URL}/provinces`);
};

ProvinceRepository.getPopularList=()=>{
    return axios.get(`${API_BASE_URL}/provinces/popular`);
};

ProvinceRepository.get = (id)=>{
    console.log(id)
    return axios.get(`${API_BASE_URL}/provinces/${id}`);
}
ProvinceRepository.PopularLists = [
    {
        id:1,
        name:'Hồ Chí Minh',
        total:120,
        image:'images/find-place1.jpg'
    },
    {
        id:2,
        name:'Hà Nội',
        total:62,
        image:'images/find-place2.jpg'
    },
    {
        id:3,
        name:'Đà Lạt',
        total:94,
        image:'images/find-place3.jpg'
    },
    {
        id:4,
        name:'Đà Nẵng',
        total:30,
        image:'images/find-place4.jpg'
    },
    {
        id:5,
        name:'Hội An',
        total:40,
        image:'images/find-place5.jpg'
    }
]

export default ProvinceRepository;
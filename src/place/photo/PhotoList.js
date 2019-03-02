import React,{Component} from 'react'
import PostRepository from '../../repositories/PostRepository';
import { render } from 'react-dom';
import Gallery from 'react-photo-gallery';
import Lightbox from 'react-images';
import PlaceRepository from '../../repositories/PlaceRepository';

const photos = [
    { src: 'https://mytourcdn.com/upload_images/Image/Location/29_9_2015/Du-lich-toa-nha-bitexco-sai-gon-mytour-1.jpg', width: 4, height: 3 },
    { src: 'https://image2.tienphong.vn/665x449/Uploaded/2018/bzivobpc/2015_02_27/115609-1.jpg', width: 1, height: 1 },
    { src: 'https://www.justgola.com/media/a/00/0e/57535_og_1.jpeg', width: 3, height: 4 },
    { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQH4BaUavjen_d08l26NsD8SCO2QMB4ZQ7KuVyHrVr_hPV2eN3M', width: 3, height: 4 },
    { src: 'http://reatimes.vn/media/uploaded/56/2018/02/02/bitexco.jpg', width: 3, height: 4 },
    { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQt5CTaGlFlg-piAoDgkB4oBd18rE16j7AxgJCmqG82iKLSN1N3', width: 4, height: 3 },
    { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTp6CaWB25LjEY55ROx8v9L2N0lWNIVrjDeOwS8yggLvBJCfOdAEQ', width: 3, height: 4 },
    { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVkZBIhFr9yAHvsNiWWm2la_7uuP1t4bk5Vfj3cW4_qhg5iGXj', width: 4, height: 3 },
    { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVkZBIhFr9yAHvsNiWWm2la_7uuP1t4bk5Vfj3cW4_qhg5iGXj', width: 4, height: 3,caption:'Hello' }
  ];
  
class PhotoList extends Component{
    constructor() {
        super();
        this.state = { currentImage: 0 ,photos:[]};
        this.closeLightbox = this.closeLightbox.bind(this);
        this.openLightbox = this.openLightbox.bind(this);
        this.gotoNext = this.gotoNext.bind(this);
        this.gotoPrevious = this.gotoPrevious.bind(this);
      }
      

      componentWillMount(){
        PlaceRepository.getPhotos(this.props.place_id)
        .then(res=>{
            var cur = this;
            var photos=[];
            res.data.items.map(function(item){
                photos.push({
                    src:item
                })
            })
            this.setState({
                photos:photos
            });
        })
        .catch(err=>{
            console.log(err);
        })
      }

      openLightbox(event, obj) {
        this.setState({
          currentImage: obj.index,
          lightboxIsOpen: true,
        });
      }
      closeLightbox() {
        this.setState({
          currentImage: 0,
          lightboxIsOpen: false,
        });
      }
      gotoPrevious() {
        this.setState({
          currentImage: this.state.currentImage - 1,
        });
      }
      gotoNext() {
        this.setState({
          currentImage: this.state.currentImage + 1,
        });
      }
      render() {
        return (
          <div>
            <Gallery photos={this.state.photos} onClick={this.openLightbox} />
            <Lightbox images={this.state.photos}
                backdropClosesModal={true}
                showCloseButton={false}
                onClose={this.closeLightbox}
                onClickPrev={this.gotoPrevious}
                onClickNext={this.gotoNext}
                currentImage={this.state.currentImage}
                isOpen={this.state.lightboxIsOpen}
                showImageCount={false}
                showThumbnails={true}
            />
          </div>
        )
      }
    
}
export default PhotoList;
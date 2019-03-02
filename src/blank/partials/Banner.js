import React from 'react';
import SearchBox from '../../common/SearchBox';

export default function Banner() {
  return (
    <section className="slider home-banner d-flex align-items-center">
        <div className="container">
            <div className="row d-flex justify-content-center">
                <div className="col-md-12">
                    <div className="slider-title_box">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="slider-content_wrap">
                                    <h1 className="title-banner">Tìm hiểu thực tế các chuyến đi</h1>
                                    <h5>Tại 63 tỉnh thành trên cả nước</h5>
                                </div>
                            </div>
                        </div>
                        <div className="row d-flex justify-content-center">
                            <div className="col-md-9">
                                <div className="btn-group" role="group" aria-label="Basic example">
                                    <SearchBox position={'banner'}></SearchBox>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
}
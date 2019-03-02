import React, { Component } from 'react';
import Banner from './partials/Banner';
import Popular from './partials/Popular';
import './Blank.css';

class Blank extends Component {
    render() {
        return (
            <div>
            <Banner key="banner" onEnterChange={this.onEnterChange} />
            <Popular key="popular"/>
            </div>
        );
    }
}

export default Blank;
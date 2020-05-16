import React, { Component } from 'react';
import ImageUpload from '../ImageUpload';
import ImageGallery from '../ImageGallery';
import InfiniteScroll from 'react-infinite-scroll-component';
import { db } from '../Firebase/index';

class WeddingPhotos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      displayedImages: [],
      imgRef: db.ref('images')
    };

    this.state.imgRef.once('value').then(this.retrieveAllPhotos);
    this.state.imgRef.on('child_added', this.retrieveNewPhoto);
    this.state.imgRef.on('child_removed', this.removeDeletedPhoto);
  }

  retrieveAllPhotos = dataSnapshot => {
    let imgUrls = Object.entries(dataSnapshot.toJSON())
      .map(([key, val]) => Object.assign(val, { filename: key }))
      .reverse();

    this.setState({
      images: imgUrls.slice(5),
      displayedImages: imgUrls.slice(0, 5)
    });
  };

  retrieveNewPhoto = data => {
    let img = data.val();

    this.setState({
      displayedImages: [img, ...this.state.displayedImages]
    });
  };

  removeDeletedPhoto = deletedImg => {
    deletedImg = deletedImg.val()

    const displayedImages = this.state.displayedImages.filter(img => img.url !== deletedImg.url)
    this.setState({
      displayedImages
    });
  }

  displayMorePhotos = () => {
    let remainingImages = this.state.images;
    let displayedImages = this.state.displayedImages.concat(
      remainingImages.slice(0, 5)
    );

    this.setState({
      images: remainingImages.slice(5),
      displayedImages: displayedImages
    });
  };

  render() {
    return (
      <div className="center">
        <header className="App-header">
          <ImageUpload imgRef={this.state.imgRef}></ImageUpload>
        </header>

        <InfiniteScroll
          dataLength={this.state.displayedImages.length}
          next={this.displayMorePhotos}
          hasMore={true}
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>Yay! You have seen it all</b>
            </p>
          }>
          <ImageGallery
            photos={this.state.displayedImages}
            removeDeletedPhoto={this.removeDeletedPhoto}
            className="weddingGallery"></ImageGallery>
        </InfiniteScroll>
      </div>
    );
  }
}

export default WeddingPhotos;

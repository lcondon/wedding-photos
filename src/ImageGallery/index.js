import React, { Component } from 'react';
import Carousel, { Modal, ModalGateway } from 'react-images';
import './imageGallery.css';
import LazyLoad from 'react-lazyload';
import ExifOrientationImg from 'react-exif-orientation-img';
import { db } from '../Firebase';

class ImageGallery extends Component {
  state = {
    selectedIndex: 0,
    lightboxIsOpen: false
  };

  toggleLightbox = selectedIndex => {
    this.setState(state => ({
      lightboxIsOpen: !state.lightboxIsOpen,
      selectedIndex
    }));
  };

  deletePhoto(src) {
    db.ref(`images/${src.id}`).remove()
  }

  render() {
    const { photos } = this.props;
    const { selectedIndex, lightboxIsOpen } = this.state;
    return (
      <div className="imageGallery">
        {photos.map((src, j) => (
          <div className="imageContainer">
            <LazyLoad once offset={100} key={src.url}>
              <ExifOrientationImg
                src={src.url}
                onClick={() => this.toggleLightbox(j)}
                key={src}
                alt=""
              />
              <svg onClick={() => this.deletePhoto(src)} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="trash" className="svg-inline--fa fa-trash fa-w-14" role="img" viewBox="0 0 448 512"><path fill="currentColor" d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z" /></svg>
            </LazyLoad>
          </div>
        ))}
        <ModalGateway>
          {lightboxIsOpen ? (
            <Modal onClose={this.toggleLightbox}>
              <Carousel
                currentIndex={selectedIndex}
                views={photos.map(x => ({
                  source: x,
                  srcset: x.srcSet,
                  caption: x.title
                }))}
              />
            </Modal>
          ) : null}
        </ModalGateway>
      </div>
    );
  }
}

export default ImageGallery;

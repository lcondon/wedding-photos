import React from 'react';
import './imageUpload.css';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import { v4 as uuidv4 } from 'uuid';
import { storage, db } from '../Firebase/index';

// And import the necessary css
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

// register the filepond plugins for additional functionality
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

export default function ImageUpload(
  props,
  { defaultFiles = [] },
) {
  // use a useState hook to maintain our files collection
  const [files, setFiles] = React.useState(defaultFiles);
  const server = {
    // this uploads the image using firebase
    process: (fieldName, file, metadata, load, error, progress) => {
      const uploadTask = storage.ref(`images/${file.name}`).put(file);
      uploadTask.on(
        'state_changed',
        (snap) => {
          // provide progress updates
          progress(true, snap.bytesTransferred, snap.totalBytes);
        },
        (err) => {
          // provide errors
          error(err.message);
        },
        () => {
          storage
            .ref(`images/${file.name}`)
            .getDownloadURL()
            .then((url) => {
              const imgId = uuidv4();
              db.ref(`images/${imgId}`).set({
                url,
                name: file.name,
                id: imgId,
              });
              load(file.name);
            });
        },
      );
    },

    // this loads an already uploaded image to firebase
    load: (source, load, error, progress, abort) => {
      // reset our progress
      progress(true, 0, 1024);

      // fetch the download URL from firebase
      storage
        .child(`images/${source}`)
        .getDownloadURL()
        .then((url) => {
          // fetch the actual image using the download URL
          // and provide the blob to FilePond using the load callback
          const xhr = new XMLHttpRequest();
          xhr.responseType = 'blob';
          xhr.onload = () => {
            const blob = xhr.response;
            load(blob);
          };
          xhr.open('GET', url);
          xhr.send();
        })
        .catch((err) => {
          error(err.message);
          abort();
        });
    },
    revert: null,
  };

  return (
    <FilePond
      files={files}
      allowMultiple
      maxFiles={10}
      onupdatefiles={(fileItems) => setFiles(fileItems.map((fileItem) => fileItem.file))}
      server={server} // todo: add custom server functionality using firebase
    />
  );
}

// export default ImageUpload;

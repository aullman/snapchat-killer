/* global MediaRecorder */

require('./captureVideo.css');

module.exports = function captureVideo(canvasStream) {
  let mediaRecorder;
  let recordedBlobs;
  let capturePromise;

  return {
    start: () => {
      if (typeof MediaRecorder === 'undefined') {
        // We can't capture video we don't suppor the MediaRecorder API
        return false;
      }
      recordedBlobs = [];
      const options = { mimeType: 'video/webm;codecs=vp8' };
      mediaRecorder = new MediaRecorder(canvasStream, options);
      mediaRecorder.addEventListener('dataavailable', event => {
        if (event.data && event.data.size > 0) {
          recordedBlobs.push(event.data);
        }
        if (capturePromise) {
          // We have stopped and need to return all of the blobs
          if (
            // Firefox just has 1 really big blob
            (recordedBlobs.length === 1 && recordedBlobs[0].size > 300000) ||
            // Chrome has lots of little blobs
            recordedBlobs.length > 10
          ) {
            const recordedVideo = document.createElement('video');
            recordedVideo.className = 'captureVideo';
            recordedVideo.setAttribute('autoPlay', 'true');
            recordedVideo.setAttribute('loop', 'true');
            const superBuffer = new Blob(recordedBlobs, { type: 'video/webm' });
            recordedVideo.src = window.URL.createObjectURL(superBuffer);
            capturePromise.resolve(recordedVideo);
          } else {
            capturePromise.reject('video not long enough');
          }
          capturePromise = null;
        }
      });
      mediaRecorder.start(10); // collect 10ms of data at a time
    },
    stop: () => {
      if (mediaRecorder) {
        mediaRecorder.stop();
        return new Promise((resolve, reject) => {
          capturePromise = {
            resolve,
            reject
          };
        });
      } else {
        // We don't support MediaRecorder API just take a snapshot
        return Promise.reject('We do not support the MediaRecorder API');
      }
    },
  };
};

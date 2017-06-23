require('./captureContainer.css');
const captureImage = require('../captureImage');
const captureVideo = require('../captureVideo');

module.exports = function captureContainer(canvas, canvasStream, appendTo) {
  let captured;
  const capturingVideo = captureVideo(canvasStream);

  const container = document.createElement('div');
  container.className = 'container';

  const close = () => {
    appendTo.removeChild(container);
  };
  const closeButton = document.createElement('i');
  closeButton.className = 'closeButton ion-close-round';
  closeButton.addEventListener('click', close);
  container.appendChild(closeButton);

  const download = () => {
    if (captured) {
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = captured.getAttribute('src');
      a.download = `snap.${captured.tagName === 'IMG' ? 'png' : 'webm'}`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
      }, 100);
    }
  };
  const downloadButton = document.createElement('i');
  downloadButton.className = 'downloadButton ion-ios-download-outline';
  downloadButton.addEventListener('click', download);
  container.appendChild(downloadButton);

  return {
    startCapturing: () => {
      return capturingVideo.start();
    },
    stopCapturing: () => {
      if (captured && captured.parentNode === container) {
        container.removeChild(captured);
      }
      capturingVideo.stop().then(c => {
        captured = c;
      }).catch(() => {
        // No enough video was captured, just get an image
        captured = captureImage(canvas);
      }).then(() => {
        container.appendChild(captured);
        appendTo.appendChild(container);
      });
    },
  };
};

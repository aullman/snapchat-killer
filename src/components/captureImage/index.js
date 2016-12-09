require('./captureImage.css');

module.exports = function captureImage(canvas) {
  const image = document.createElement('img');
  image.setAttribute('src', canvas.toDataURL('image/png'));
  image.className = 'captureImage';
  return image;
};

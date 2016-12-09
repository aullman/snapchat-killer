require('./filterPicker.css');

let currentFilter;

module.exports = (videoElement, canvas, filters, appendTo) => {
  const changeFilter = f => {
    if (currentFilter) {
      currentFilter.stop();
    }
    currentFilter = filters[f](videoElement, canvas);
  };

  const selector = document.createElement('div');
  selector.className = 'filterPicker';
  let f;
  for (f of Object.keys(filters)) {
    const option = document.createElement('div');
    option.className = 'filterOption';
    const span = document.createElement('span');
    span.innerHTML = f;
    option.appendChild(span);
    option.addEventListener('click', changeFilter.bind(this, f));
    selector.appendChild(option);
  }
  appendTo.appendChild(selector);
  changeFilter('none');
};

import './css/styles.css';
import axios from 'axios';

const DEBOUNCE_DELAY = 300;
const url = 'https://pixabay.com/api/?key=29908422-6515e5e6655e3a8d0d58918bc';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
};

refs.form.addEventListener('submit', e => {
  e.preventDefault();
  const trg = e.currentTarget;
  const search = trg.elements.searchQuery;
  fetchRequest(search.value);
  trg.reset();
});

function fetchRequest(query) {
  axios
    .get(
      `${url}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=1&per_page=40`
    )
    .then(response => {
      let result = response.data.hits;
      // console.log(result.webformatURL);
      // console.log(result.largeImageURL);
      // console.log(result.tags);
      // console.log(result.likes);
      // console.log(result.views);
      // console.log(result.comments);
      // console.log(result.downloads);
      // console.log(response.data.hits);

      let render = result.map(item => {
        return `<div class="photo-card">
        <img
          src="${item.webformatURL}"
          width="150"
          alt="${item.tags}"
          loading="lazy"
        />
        <div class="info">
          <div class="info-item">
            <p class="item-name"><b>Likes</b></p>
            <p class="item-value">${item.likes}</p>
          </div>

          <div class="info-item">
            <p class="item-name"><b>Views</b></p>
            <p class="item-value">${item.views}</p>
          </div>

          <div class="info-item">
            <p class="item-name"><b>Comments</b></p>
            <p class="item-value">${item.comments}</p>
          </div>
         
          <div class="info-item">
            <p class="item-name"><b>Downloads</b></p>
            <p class="item-value">${item.downloads}</p>
          </div>
        </div>
      </div>`;
      }).join('');

      refs.gallery.innerHTML = render;
    })

    .catch(error => {
      console.log(error);
    });
}

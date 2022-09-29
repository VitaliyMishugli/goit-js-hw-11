import './css/styles.css';
import axios from 'axios';
import PhotosApiService from './photo-service';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const DEBOUNCE_DELAY = 300;
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});
const photoApiService = new PhotosApiService();
let page = 0;
let totalPages = 0;
const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);
refs.loadMoreBtn.classList.add('is-hidden');

function onSearch(e) {
  e.preventDefault();
  refs.gallery.innerHTML = '';
  const trg = e.currentTarget;
  let search = trg.elements.searchQuery;
  search = search.value.trim();
  
  if (search === '') {
    Notiflix.Notify.failure(
      `Sorry, there are no images matching your search query. Please try again.`
    );
    return;   
  }
   photoApiService.query = search;
   photoApiService.resetPage();
   photoRender();
   Notiflix.Notify.success(`✅ Hooray! We found totalHits images.`);
}

function onLoadMore() {
  page += 1;
  if (page === totalPages) {
    refs.loadMoreBtn.classList.add('is-hidden');
    Notiflix.Notify.failure(
      `We're sorry, but you've reached the end of search results.`
    );
     refs.loadMoreBtn.classList.add('is-hidden');
    return;
  }
  // refs.loadMoreBtn.classList.add('is-hidden');
  photoRender();
  refs.loadMoreBtn.classList.remove('is-hidden');
}

function photoRender() {
  photoApiService
    .fetchPhotos()
    .then(response => {
      page = photoApiService.page;
      const tHits = response.data.totalHits;
      let result = response.data.hits;
      totalPages = Math.ceil(tHits / result.length);
      console.log(totalPages);
      refs.loadMoreBtn.classList.remove('is-hidden');
      if (result.length === 0) {
        refs.loadMoreBtn.classList.add('is-hidden');
        Notiflix.Notify.failure(
          `Sorry, there are no images matching your search query. Please try again.`
        );
        return;
      }
      // console.log(page);
      else if (page === totalPages) {
        refs.loadMoreBtn.classList.add('is-hidden');
        Notiflix.Notify.failure(
          `We're sorry, but you've reached the end of search results.`
        );
        photoMarkup(result);  
      }
      photoMarkup(result);
      photoApiService.pageIncrement();
    })
    .catch(error => {
      console.log(error);
    });
}

function photoMarkup(result) {
  let render = result
    .map(item => {
      return `<div class="photo-card" class="gallery__item">
        <a href="${item.largeImageURL}"    class="gallery__item">
          <img
          src="${item.webformatURL}"           
          class="gallery__image"
          width="150"
          alt="${item.tags}"
          loading="lazy" />
        </a>

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
    })
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', render);
  lightbox.refresh();
}
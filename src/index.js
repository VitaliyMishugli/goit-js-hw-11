import './css/styles.css';
import axios from 'axios';
import PhotosApiService from './photo-service';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const DEBOUNCE_DELAY = 300;

const photoApiService = new PhotosApiService();

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);
// refs.loadMoreBtn.disabled = true;
refs.loadMoreBtn.classList.add('is-hidden');

function onSearch(e) {
  e.preventDefault();
  refs.gallery.innerHTML = '';
  // refs.loadMoreBtn.disabled = false;
  
  const trg = e.currentTarget;
  let search = trg.elements.searchQuery;
  search = search.value.trim();
  
  if (search !== '') {
    refs.loadMoreBtn.classList.remove('is-hidden');
    photoApiService.query = search;
    photoApiService.resetPage();
    photoRender();
    Notiflix.Notify.success(`✅ Hooray! We found totalHits images.`);
  } else {
    Notiflix.Notify.failure(
      `Sorry, there are no images matching your search query. Please try again.`
    );
  }
}

function onLoadMore() {
  // refs.loadMoreBtn.disabled = true;
  refs.loadMoreBtn.classList.add('is-hidden');
  photoApiService.fetchPhotos();
  photoRender();
  // refs.loadMoreBtn.disabled = false;
  refs.loadMoreBtn.classList.remove('is-hidden');
}

function photoRender() {
  photoApiService
    .fetchPhotos()
    .then(response => {
      photoApiService.pageIncrement();
      let result = response.data.hits;

      if (result.length === 0) {
        console.log(result.length);
        Notiflix.Notify.failure(
          `Sorry, there are no images matching your search query. Please try again.`
        );
      }

      // else if (result.length < 40) {
      //   console.log(result.length);
      //   refs.loadMoreBtn.classList.add('is-hidden');
      //   Notiflix.Notify.failure(
      //     `We're sorry, but you've reached the end of search results.`
      //   );

        // =====
      //   let render = result
      //     .map(item => {
      //       return `<div class="photo-card" class="gallery__item">

      //   <a href="${item.largeImageURL}"    class="gallery__item">
      //     <img
      //     src="${item.webformatURL}"           
      //     class="gallery__image"
      //     width="150"
      //     alt="${item.tags}"
      //     loading="lazy" />
      //   </a>

      //   <div class="info">
      //     <div class="info-item">
      //       <p class="item-name"><b>Likes</b></p>
      //       <p class="item-value">${item.likes}</p>
      //     </div>
      //     <div class="info-item">
      //       <p class="item-name"><b>Views</b></p>
      //       <p class="item-value">${item.views}</p>
      //     </div>
      //     <div class="info-item">
      //       <p class="item-name"><b>Comments</b></p>
      //       <p class="item-value">${item.comments}</p>
      //     </div>         
      //     <div class="info-item">
      //       <p class="item-name"><b>Downloads</b></p>
      //       <p class="item-value">${item.downloads}</p>
      //     </div>
      //   </div>
      // </div>`;
      //     })
      //     .join('');

      //   refs.gallery.innerHTML += render;
      //   const lightbox = new SimpleLightbox('.gallery a', {
      //     captionsData: 'alt',
      //     captionDelay: 250,
      //   });
        // =====
      // }

      // else if (result.length === 40) {
        console.log(result.length);
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

        refs.gallery.innerHTML += render;
        const lightbox = new SimpleLightbox('.gallery a', {
          captionsData: 'alt',
          captionDelay: 250,
        });
      // }
      
    })
    .catch(error => {
      console.log(error);
    });
}


import './css/styles.css';
import axios from 'axios';

const DEBOUNCE_DELAY = 300;

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
};

let sValue = '';

refs.form.addEventListener('submit', e => {
  e.preventDefault();
  const trg = e.currentTarget;
  const search = trg.elements.searchQuery;
  console.log(search.value);
  sValue = search.value;

  fetchRequest(sValue);

  trg.reset();

});

function fetchRequest(query) {
  axios
    .get(
      `https://pixabay.com/api/?key=29908422-6515e5e6655e3a8d0d58918bc&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=1&per_page=40`
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

      let render = '';
      render = result.map(item => {
        return `<div class="photo-card">
         <img src="${item.webformatURL}" alt="${item.tags}" width="200" loading="lazy" />
         <div class="info">
           <p class="info-item">
             <b>Likes: ${item.likes}</b>
          </p>
           <p class="info-item">
             <b>Views: ${item.views}</b>
           </p>
           <p class="info-item">
             <b>Comments: ${item.comments}</b>
           </p>
           <p class="info-item">
             <b>Downloads: ${item.downloads}</b>
           </p>
         </div>
       </div>`
      }).join('');

      refs.gallery.innerHTML = render;

      // refs.gallery.innerHTML = `<div class="photo-card">
      //   <img src="${result.webformatURL}" alt="${result.tags}" width="200" loading="lazy" />
      //   <div class="info">
      //     <p class="info-item">
      //       <b>Likes: ${result.likes}</b>
      //     </p>
      //     <p class="info-item">
      //       <b>Views: ${result.views}</b>
      //     </p>
      //     <p class="info-item">
      //       <b>Comments: ${result.comments}</b>
      //     </p>
      //     <p class="info-item">
      //       <b>Downloads: ${result.downloads}</b>
      //     </p>
      //   </div>
      // </div>`;
    })

    .catch(error => {
      console.log(error);
    });
}


 


// const URL = 'https://newsapi.org/v2/everything?q=cars';
// const options = {
//   headers: {
//     'X-Api-Key': 'b09d2e2ae5904451befc3a4a9b9eea63',
//   },
// };


// fetch(URL, options)
// .then(r => r.json())
// .then(console.log)



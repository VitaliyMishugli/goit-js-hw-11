import axios from 'axios';

export default class PhotoApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchPhotos() {
    // console.log(this);
    const url =
      'https://pixabay.com/api/?key=29908422-6515e5e6655e3a8d0d58918bc';
    
    return await axios.get(`${url}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`);
  }

  pageIncrement() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}

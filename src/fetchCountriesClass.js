export class FetchCountriesAPI {
  constructor() {
    this.searchQuary = '';
  }

  fetchCountries() {
    const BASE_URL = 'https://restcountries.com/v3.1/name/';
    const parameters = '?fields=name,capital,population,flags,languages';
    const options = {
      method: 'GET',
    };
    return fetch(`${BASE_URL}${this.searchQuary}${parameters}`, options).then(
      response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      }
    );
  }

  get quary() {
    return this.searchQuary;
  }

  set quary(newQuary) {
    this.searchQuary = newQuary;
  }
}

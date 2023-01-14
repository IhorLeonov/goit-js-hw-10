export function fetchCountries(name) {
  const BASE_URL = 'https://restcountries.com/v3.1/name/';
  const parameters = '?fields=name,capital,population,flags,languages';
  const options = {
    method: 'GET',
  };
  return fetch(`${BASE_URL}${name}${parameters}`, options).then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  });
}

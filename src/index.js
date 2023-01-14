// Создай фронтенд часть приложения поиска данных о стране по её частичному или полному имени.
// ✅ 1. Напиши функцию fetchCountries(name) которая делает HTTP-запрос на ресурс name и возвращает промис с массивом стран - результатом запроса.
// ✅ 2. Чтобы сократить объем передаваемых данных добавь строку параметров запроса.
// ✅ 3. HTTP-запросы выполняются при наборе имени страны, то есть по событию inut.
// ✅ 4. Необходимо применить приём Debounce на обработчике события и делать HTTP-запрос спустя 300мс после того, как пользователь перестал вводить текст.
// ✅ 5. Если пользователь полностью очищает поле поиска, то HTTP-запрос не выполняется, а разметка списка стран или информации о стране пропадает.
// ✅ 6. Выполни санитизацию введенной строки методом trim().
// ✅ 7. Если в ответе бэкенд вернул больше чем 10 стран, в интерфейсе пояляется уведомление "Too many matches found. Please enter a more specific name.".
// ✅ 8. Если бэкенд вернул от 2-х до 10-х стран, под тестовым полем отображается список найденных стран. Каждый элемент списка состоит из флага и имени страны.
// ✅ 9. Если результат запроса это массив с одной страной, в интерфейсе отображается разметка карточки с данными о стране: флаг, название, столица, население и языки.
// ✅ 10. Если пользователь ввёл имя страны которой не существует, бэкенд вернёт не пустой массив, а ошибку со статус кодом 404 - не найдено. Добавь уведомление "Oops, there is no country with that name" в случае ошибки.

import './css/styles.css';
import { debounce } from 'lodash';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const resetButton = document.querySelector('.reset-btn');
const DEBOUNCE_DELAY = 300;

searchBox.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));
resetButton.addEventListener('click', resetInput);

function onInput(e) {
  const country = e.target.value.trim();

  if (!country) {
    resetInput();
    return;
  }

  fetchCountries(country)
    .then(data => {
      if (data.length > 10) {
        ifFoundMoreThenTen();
      } else if (data.length === 1) {
        createCountryInfoMarkup(data);
      } else {
        createCountryListMarkup(data);
      }
    })
    .catch(err => createErrorMarkup());

  resetButton.disabled = false;
}

function createCountryListMarkup(arr) {
  countryInfo.innerHTML = '';
  const markup = arr
    .map(
      ({
        flags: { svg: flag },
        name: { official: country },
      }) => `<li class="list-item">
    <img
    style="margin-right:5px"
    width="22px"
    src="${flag}"
    alt=""><span>${country}</span>
  </li>`
    )
    .join('');

  countryList.innerHTML = markup;
}

function createCountryInfoMarkup(arr) {
  countryList.innerHTML = '';
  const markup = arr
    .map(
      ({
        capital,
        population,
        languages,
        flags: { svg: flag },
        name: { official: country },
      }) => `
      <h1><img style="margin-right:5px"
      height="23px" src="${flag}" alt="">${country}</h1>
      <ul style="list-style:none;padding:0px">
        <li><span><b>Capital:</b></span> ${capital}</li>
        <li><span><b>Population:</b></span> ${population}</li>
        <li><span><b>Languages:</b></span> ${Object.values(languages)}</li>
      </ul>`
    )
    .join('');

  countryInfo.innerHTML = markup;
}

function resetInput() {
  searchBox.value = '';
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';
  resetButton.disabled = true;
}

function createErrorMarkup() {
  Notiflix.Notify.failure(`Oops, there is no country with that name`);
}

function ifFoundMoreThenTen() {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name'
  );
}

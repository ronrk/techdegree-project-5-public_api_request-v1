///creating the employeees variable on global scope
let employees;

//helper function

////check status if response.ok return true return the PromiseResolve if false return new Error
function checkStatus(response) {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

//// function that recieve url and fetch the url and then check to see if status is ok then convert to json format
function fetchJsonData(url) {
  return fetch(url)
    .then(checkStatus)
    .then((res) => res.json());
}

////generate array of employes by using data.results and then forEach employee create a html card and then insert the card into the gallery div, return Promise.all
function generateRandomEmployees(data) {
  employees = data.results.map((person) => person);
  employees.forEach((person) => {
    const html = `<div class="card">
    <div class="card-img-container">
        <img class="card-img" src=${person.picture.thumbnail} alt="profile picture">
    </div>
    <div class="card-info-container">
        <h3 id="name" class="card-name cap">${person.name.first} ${person.name.last}</h3>
        <p class="card-text">${person.email}</p>
        <p class="capersonrd-text cap">${person.location.city}, ${person.location.state}</p>
    </div>
  </div>`;
    gallery.insertAdjacentHTML("beforeend", html);
  });
  createSearchForm();
  return Promise.all(employees);
}

//// recive a index from the eventListener and than create a modal card for the selected employee then insert the modal into the end of the body
function generateModalEmployee(index) {
  console.log(employees[index]);
  const div = document.createElement("div");
  div.classList.add("modal-container");
  document.body.append(div);
  const html = `
        <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container">
            <img class="modal-img" src=${
              employees[index].picture.medium
            } alt="profile picture">
            <h3 id="name" class="modal-name cap">${
              employees[index].name.title
            } ${employees[index].name.first} ${employees[index].name.last}</h3>
            <p class="modal-text">${employees[index].email}</p>
            <p class="modal-text cap">${employees[index].location.city}</p>
            <hr>
            <p class="modal-text">${employees[index].cell}</p>
            <p class="modal-text">${employees[index].location.street.number} ${
    employees[index].location.street.name
  }, ${employees[index].location.city}, ${employees[index].location.country} ${
    employees[index].location.postcode
  }</p>
            <p class="modal-text">Birthday: ${getEmployeeBirthday(
              employees[index].dob.date
            )}</p>
            <div class="modal-btn-container">
                    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                    <button type="button" id="modal-next" class="modal-next btn">Next</button>
                </div>
        </div>
      `;
  div.innerHTML = html;

  const modal = document.querySelector(".modal");
  const btnNext = document.getElementById("modal-next");
  const btnPrev = document.getElementById("modal-prev");

  btnNext.addEventListener("click", (e) => {
    if (index >= 0 && index < 11) {
      div.remove();
      generateModalEmployee(++index);
    } else if (index === 11) {
      div.remove();
      index = 0;
      generateModalEmployee(index);
    }
  });

  btnPrev.addEventListener("click", (e) => {
    if (index > 0 && index <= 12) {
      div.remove();
      generateModalEmployee(--index);
    } else if (index === 0) {
      div.remove();
      index = 11;
      generateModalEmployee(index);
    }
  });
  //in the function i select the btn close. and then listen for an event on the close button
  const btnClose = document.getElementById("modal-close-btn");
  btnClose.addEventListener("click", (e) => {
    div.remove();
  });
}

//change isoString date format to locale date string
function getEmployeeBirthday(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString();
}

//create search form function that creat html form and insert into the div container in the function we listen for an event on the input search to perfom search when there is a value or to clear the page when the search value empty

function createSearchForm() {
  const searchContainer = document.querySelector(".search-container");
  const html = `
    <form action="#" method="get">
      <input type="search" id="search-input" class="search-input" placeholder="Search...">
      <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>
    `;
  searchContainer.insertAdjacentHTML("afterbegin", html);
  const inputSearch = document.getElementById("search-input");
  inputSearch.addEventListener("keyup", () => {
    if (inputSearch.value.length > 0) {
      searchByName(inputSearch.value);
    } else {
      searchClear();
    }
  });
}

//search by name function

function searchByName(inputValue) {
  const cards = document.getElementsByClassName("card");
  console.log(inputValue);
  for (let i = 0; i < cards.length; i++) {
    let name = cards[i].querySelector("#name");
    if (name.textContent.toLowerCase().includes(inputValue.toLowerCase())) {
      cards[i].style.display = "";
    } else {
      cards[i].style.display = "none";
    }
  }
}

//when no input on search field clear the cards display style

function searchClear() {
  const cards = document.getElementsByClassName("card");
  for (let i = 0; i < cards.length; i++) {
    cards[i].style.display = "";
  }
}

//fetch data

fetchJsonData("https://randomuser.me/api/?results=12&nat=us")
  .then(generateRandomEmployees)
  .then((data) => {
    ///listen for an event to click on cards and then generate Modal Employee if clicked
    console.log(data);
    const cards = document.getElementsByClassName("card");
    for (let i = 0; i < cards.length; i++) {
      cards[i].addEventListener("click", () => generateModalEmployee(i));
    }
  });

// --------------------------------------------------------------------------
let basket = JSON.parse(localStorage.getItem("products"));
console.log("Panier : " + JSON.stringify(basket));
console.log(localStorage);

// Array with data and prices of products in basket :
let arrayOfDataAndPricesOfArticles = [];

// Declare variables we will be using to display total quantity and price :
const displayTotalQuantity = document.getElementById("totalQuantity");
const displayTotalPrice = document.getElementById("totalPrice");

// If basket is empty, modify h1 :
if (basket === null || basket.length <= 0 || localStorage.length < 1) {
  document.querySelector("h1").textContent = "Votre panier est vide";
}

//-------------------------------------------------------------------------------
/**
 * Send request to API to get products data :
 */
for (let item of basket) {
  fetch(`http://localhost:3000/api/products/${item.id}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      displayProductOfBasket(item, data);
    })
    .catch((error) => errorMessage(error));
}

// -----------------------------------------------------------------
/**
 * Create an error message :
 */
function errorMessage(errorMessage) {
  console.log(errorMessage);

  const errorRequestMsg = document.querySelector("h1");

  errorRequestMsg.textContent =
    "Oups ! Erreur lors de l'affichage des produits sélectionnés ...";

  errorRequestMsg.style.fontSize = `20px`;
  errorRequestMsg.style.fontWeight = `500`;
  errorRequestMsg.style.textAlign = `center`;
  errorRequestMsg.style.color = `red`;
  errorRequestMsg.style.backgroundColor = `white`;
  errorRequestMsg.style.borderRadius = `20px`;
  errorRequestMsg.style.padding = `5px`;
}

// ---------------------------------------------------------------
/**
 * Display product of basket :
 * @param {string} item
 * @param {*} data
 */
function displayProductOfBasket(item, data) {
  const article = document.createElement("article");
  article.className = "cart__item";
  article.dataset.id = item.id;
  article.dataset.color = item.color;
  document.getElementById("cart__items").appendChild(article);

  const cartItemImg = document.createElement("div");
  cartItemImg.className = "cart__item__img";
  article.appendChild(cartItemImg);

  const img = document.createElement("img");
  img.src = data.imageUrl;
  img.alt = data.altTxt;
  cartItemImg.appendChild(img);

  const cartItemContent = document.createElement("div");
  cartItemContent.className = "cart__item__content";
  article.appendChild(cartItemContent);

  const cartItemContentDescription = document.createElement("div");
  cartItemContentDescription.className = "cart__item__content__description";
  cartItemContent.appendChild(cartItemContentDescription);

  const h2Name = document.createElement("h2");
  h2Name.innerText = data.name;
  cartItemContentDescription.appendChild(h2Name);

  const color = document.createElement("p");
  color.innerText = "Couleur du produit : " + item.color;
  cartItemContentDescription.appendChild(color);

  const articlePrice = document.createElement("p");
  articlePrice.innerText = "Prix unitaire : " + data.price + "€";
  cartItemContentDescription.appendChild(articlePrice);

  const cartItemContentSettings = document.createElement("div");
  cartItemContentSettings.className = "cart__item__content__settings";
  cartItemContent.appendChild(cartItemContentSettings);

  const cartItemContentSettingsQuantity = document.createElement("div");
  cartItemContentSettingsQuantity.className =
    "cart__item__content__settings__quantity";
  cartItemContentSettings.appendChild(cartItemContentSettingsQuantity);

  const quantity = document.createElement("p");
  quantity.innerText = "Quantité :";
  cartItemContentSettingsQuantity.appendChild(quantity);

  const inputQuantity = document.createElement("input");
  inputQuantity.className = "itemQuantity";
  inputQuantity.setAttribute("type", "number");
  inputQuantity.setAttribute("name", "itemQuantity");
  inputQuantity.setAttribute("min", 1);
  inputQuantity.setAttribute("max", 100);
  inputQuantity.setAttribute("value", item.quantity);
  cartItemContentSettingsQuantity.appendChild(inputQuantity);

  dataOfArticle = {
    id: item.id,
    title: data.name,
    price: data.price,
    color: item.color,
    quantity: item.quantity,
    totalPricePerArticle: data.price * inputQuantity.value,
  };
  console.log(
    "Données du produit ajouté au panier :" + JSON.stringify(dataOfArticle)
  );

  arrayOfDataAndPricesOfArticles.push(dataOfArticle);
  console.log(
    "Tableau avec données et prix par article : " +
      JSON.stringify(arrayOfDataAndPricesOfArticles)
  );

  const pricePerArticle = document.createElement("div");
  pricePerArticle.className = "pricePerArticle";
  pricePerArticle.innerText =
    "Prix total pour cet article : " +
    dataOfArticle.totalPricePerArticle +
    " €";
  cartItemContentSettings.appendChild(pricePerArticle);

  const cartItemContentSettingsDelete = document.createElement("div");
  cartItemContentSettingsDelete.className =
    "cart__item__content__settings__delete";
  cartItemContentSettings.appendChild(cartItemContentSettingsDelete);

  const deleteItem = document.createElement("p");
  deleteItem.className = "deleteItem";
  deleteItem.innerText = "Supprimer";
  cartItemContentSettingsDelete.appendChild(deleteItem);

  // Listen to change event on inputQuantity :
  inputQuantity.addEventListener("change", changeQuantityProduct);

  // Listen to click event on <p> deleteItem :
  deleteItem.addEventListener("click", removeProduct);

  displayTotalQuantity.textContent = getTotalQuantity();

  displayTotalPrice.textContent = getTotalPrice(arrayOfDataAndPricesOfArticles);
}

// --------------------------------------------------------------------
/**
 *Get total quantity of products in basket :
 */
function getTotalQuantity() {
  let totalQuantity = 0;

  for (let product of basket) {
    totalQuantity += parseInt(product.quantity, 10);
  }

  console.log("Quantité totale d'articles : " + totalQuantity);

  displayTotalQuantity.textContent = totalQuantity;

  return totalQuantity;
}

// --------------------------------------------------------------------------
/**
 * Get total price of products in basket :
 */
function getTotalPrice(array) {
  sum = 0;

  for (let i = 0; i < array.length; i++) {
    sum += array[i].totalPricePerArticle;
  }

  console.log("Prix total du panier : " + sum);

  displayTotalPrice.textContent = sum;

  return sum;
}

// ------------------------------------------------------------------------------
// Create a message for each product removed from basket :
const removeMessage = document.createElement("div");

document.querySelector(".cart__price").appendChild(removeMessage);
document.querySelector(".cart__price").style.display = `flex`;
document.querySelector(".cart__price").style.flexDirection = `column`;

removeMessage.innerText = "Un produit a été supprimé";

removeMessage.id = "removeItem";

removeMessage.style.textAlign = `center`;
removeMessage.style.fontSize = `20px`;
removeMessage.style.fontWeight = `500`;
removeMessage.style.visibility = `hidden`;

/**
 * Remove product from local storage :
 */
function removeProduct(click) {
  let targetProduct = click.target.closest("article");

  //We keep in the basket all products but the target product :
  basket = basket.filter(
    (item) =>
      item._id !== targetProduct.dataset.id &&
      item.color !== targetProduct.dataset.color
  );
  localStorage.setItem("products", JSON.stringify(basket));
  console.log("Panier : " + JSON.stringify(basket));

  targetProduct.remove();

  removeMessage.style.visibility = "visible";

  setTimeout(function () {
    document.getElementById("removeItem").style.visibility = "hidden";
  }, 6000);

  // We keep in the array of data all data but thoses of target product :
  arrayOfDataAndPricesOfArticles = arrayOfDataAndPricesOfArticles.filter(
    (item) =>
      item._id !== targetProduct.dataset.id &&
      item.color !== targetProduct.dataset.color
  );
  console.log(
    "Tableau avec données et prix par article :" +
      JSON.stringify(arrayOfDataAndPricesOfArticles)
  );

  // Calculate new quantity of basket :
  getTotalQuantity();

  // Calculate new price of basket :
  getTotalPrice(arrayOfDataAndPricesOfArticles);

  // If basket is empty, modify h1 :
  if (basket.length <= 0 || basket === null || localStorage.length < 1) {
    document.querySelector("h1").textContent = "Votre panier est vide";
  }
}

// --------------------------------------------------------------------------
/**
 * Modify product quantity :
 */
function changeQuantityProduct(change) {
  let targetProduct = change.target.closest("article");
  let quantityProduct = change.target.closest(".itemQuantity");
  let pricePerArticle = targetProduct.querySelector(".pricePerArticle");

  console.log(targetProduct);
  console.log(quantityProduct);
  console.log(pricePerArticle);

  // We search product in local storage with same id and color...
  // ... and we modify the quantity :
  let foundProduct = basket.find(
    (product) =>
      product.id == targetProduct.dataset.id &&
      product.color == targetProduct.dataset.color
  );
  console.log(
    "Produit avec même id et même couleur trouvé dans le local storage : " +
      JSON.stringify(foundProduct)
  );

  foundProduct.quantity = parseInt(quantityProduct.value, 10);

  // Set 1 as minimum quantity, and 100 as maximun quantity :
  if (foundProduct.quantity < 1 && quantityProduct.value < 1) {
    foundProduct.quantity = 1;
    quantityProduct.value = 1;
  } else if (foundProduct.quantity > 100 && quantityProduct.value > 100) {
    foundProduct.quantity = 100;
    quantityProduct.value = 100;
  }

  console.log("Nouvelle quantité : " + foundProduct.quantity);

  // Get data of foundProduct in the array containing the data of products in basket,
  // and get the price of foundProduct :
  let foundProductData = arrayOfDataAndPricesOfArticles.find(
    (product) =>
      product.id == foundProduct.id && product.color == foundProduct.color
  );
  console.log(
    "Données du produit dont la quantité est modifiée : " +
      JSON.stringify(foundProductData)
  );

  let foundProductPrice = foundProductData.price;

  // Calculate new price per article :
  let pricePerFoundProduct = foundProductPrice * foundProduct.quantity;
  console.log(pricePerFoundProduct);

  pricePerArticle.textContent =
    "Prix total pour cet article : " + pricePerFoundProduct + " €";

  // Console.log :
  console.log(
    "Tableau avec prix des articles du panier : " +
      JSON.stringify(arrayOfDataAndPricesOfArticles)
  );
  console.log("Id du produit dont on change la quantité : " + foundProduct.id);
  console.log(
    "Couleur du produit dont on change la quantité : " + foundProduct.color
  );
  console.log(
    "Prix du produit dont on change la quantité : " +
      JSON.stringify(foundProductPrice)
  );
  console.log("Nouvelle quantité : " + foundProduct.quantity);
  console.log(
    "Nouveau prix par article pour le produit dont on change la quantité : " +
      JSON.stringify(pricePerFoundProduct)
  );

  // Change quantity and total price per article (for foundProduct) in the array of data :
  arrayOfDataAndPricesOfArticles.forEach((object) => {
    if (object.id == foundProduct.id && object.color == foundProduct.color) {
      (object.totalPricePerArticle = pricePerFoundProduct),
        (object.quantity = foundProduct.quantity);
    }
  });
  console.log(
    "Tableau avec prix des articles du panier : " +
      JSON.stringify(arrayOfDataAndPricesOfArticles)
  );

  // Calculate and display the new total quantity of articles :
  totalQuantity = getTotalQuantity();
  displayTotalQuantity.textContent = parseInt(totalQuantity, 10);

  // Update the local storage :
  localStorage.setItem("products", JSON.stringify(basket));
  console.log("Panier: " + JSON.stringify(basket));

  // Calculate and display the new price of basket :
  getTotalPrice(arrayOfDataAndPricesOfArticles);
}

// ****************************************************************************
// ******************************* FORM ***************************************
// ****************************************************************************

/**
 * Get form inputs elements :
 */
const firstNameInput = document.querySelector("#firstName");
console.log(firstNameInput);
const lastNameInput = document.querySelector("#lastName");
console.log(lastNameInput);
const addressInput = document.querySelector("#address");
console.log(addressInput);
const cityInput = document.querySelector("#city");
console.log(cityInput);
const emailInput = document.querySelector("#email");
console.log(emailInput);

const buttonOrder = document.querySelector("#order");
console.log(buttonOrder);

/**
 * Create variables for inputs values, and orderId :
 */
let firstName, lastName, address, city, email;

let orderId;

// ------------------------------ RegExp ------------------------------------------
/**
 * RegExp names and city.
 * Validate a name with :
 *   any letter, accented or not,
 *   apostrophes,
 *   spaces => "s",
 *   dashes (hyphens) => "-",
 *   a number of characters between 2 and 40.
 * This regExp is "case insensitive" (thanks to "i" at the end).
 */
let regExpNamesAndCity = /^[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ'\s-]{2,40}$/i;

/**
 * RegExp address.
 * Validate an address with :
 *   any letter, accented or not,
 *   any digit, any number,
 *   commas (,),
 *   apostrophes,
 *   slashes => "/,"
 *   spaces => "s",
 *   dashes (hyphens) => "-",
 *   a number of characters between 3 and 60.
 * This regExp is "case insensitive" (thanks to "i" at the end).
 */
let regExpAddress = /^[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ0-9,'\/\s-]{3,60}$/i;

/**
 * RegExp email :
 * https://askcodez.com/rails-regex-pour-la-validation-des-emails.html
 */
let regExpEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

// ------------------------------------------------------------------------
/**
 * Create error message if invalid form data :
 */
const errorForm = document.createElement("div");

document.querySelector(".cart__order__form").appendChild(errorForm);

errorForm.innerText = "Veuillez saisir des données valides";

errorForm.style.color = `red`;
errorForm.style.fontSize = `20px`;
errorForm.style.fontWeight = `500`;
errorForm.style.backgroundColor = `white`;
errorForm.style.borderRadius = `20px`;
errorForm.style.padding = `5px`;
errorForm.style.textAlign = `center`;
errorForm.style.marginTop = `15px`;
errorForm.style.visibility = `hidden`;

/**
 * Create message if empty basket :
 */
const emptyBasket = document.createElement("div");

document.querySelector(".cart__order__form").appendChild(emptyBasket);

emptyBasket.innerText = "Votre panier est vide";

emptyBasket.style.color = `red`;
emptyBasket.style.fontSize = `20px`;
emptyBasket.style.fontWeight = `500`;
emptyBasket.style.backgroundColor = `white`;
emptyBasket.style.borderRadius = `20px`;
emptyBasket.style.padding = `5px`;
emptyBasket.style.textAlign = `center`;
emptyBasket.style.marginTop = `10px`;
emptyBasket.style.visibility = `hidden`;

/**
 * Create message when order is being sent :
 */
const okForm = document.createElement("div");

document.querySelector(".cart__order__form").appendChild(okForm);

okForm.innerText = "Envoi de la commande en cours ...";

okForm.style.color = `white`;
okForm.style.textAlign = `center`;
okForm.style.fontSize = `20px`;
okForm.style.fontWeight = `500`;
okForm.style.marginTop = `-50px`;
okForm.style.visibility = `hidden`;

/**
 * Create an array with the ids of items in basket :
 */
let products = [];
for (item of basket) {
  products.push(item.id);
}
console.log(
  "Tableau d'Ids à envoyer au back-end : " + JSON.stringify(products)
);

//-----------------------------------------------------------------------
/**
 * Listen to events on first name, last name and city inputs :
 */
firstNameInput.addEventListener("input", (event) => {
  console.log(event);

  if (event.target.value.match(regExpNamesAndCity)) {
    firstName = event.target.value;
    firstNameInput.style.backgroundColor = "white";

    const firstNameErrorMsg = document.querySelector("#firstNameErrorMsg");

    firstNameErrorMsg.textContent = "";

    console.log("Prénom : " + firstName);
    return firstName;
  } else {
    firstName = null;
    firstNameInput.style.backgroundColor = "red";

    firstNameErrorMsg.style.width = `150px`;
    firstNameErrorMsg.style.color = `red`;
    firstNameErrorMsg.style.textAlign = `center`;
    firstNameErrorMsg.style.backgroundColor = `white`;
    firstNameErrorMsg.style.borderRadius = `20px`;

    firstNameErrorMsg.textContent = "Prénom invalide";

    console.log("Prénom :" + firstName);
    return false;
  }
});

lastNameInput.addEventListener("input", (event) => {
  console.log(event);

  if (event.target.value.match(regExpNamesAndCity)) {
    lastName = event.target.value;
    lastNameInput.style.backgroundColor = "white";

    const lastNameErrorMsg = document.querySelector("#lastNameErrorMsg");

    lastNameErrorMsg.textContent = "";

    console.log("Nom : " + lastName);
    return lastName;
  } else {
    lastName = null;
    lastNameInput.style.backgroundColor = "red";

    lastNameErrorMsg.style.width = `140px`;
    lastNameErrorMsg.style.color = `red`;
    lastNameErrorMsg.style.textAlign = `center`;
    lastNameErrorMsg.style.backgroundColor = `white`;
    lastNameErrorMsg.style.borderRadius = `20px`;

    lastNameErrorMsg.textContent = "Nom invalide";

    console.log("Nom :" + lastName);
    return false;
  }
});

cityInput.addEventListener("input", (event) => {
  console.log(event);

  if (event.target.value.match(regExpNamesAndCity)) {
    city = event.target.value;
    cityInput.style.backgroundColor = "white";

    const cityErrorMsg = document.querySelector("#cityErrorMsg");

    cityErrorMsg.textContent = "";

    console.log("Ville : " + city);
    return city;
  } else {
    city = null;
    cityInput.style.backgroundColor = "red";

    cityErrorMsg.style.width = `175px`;
    cityErrorMsg.style.color = `red`;
    cityErrorMsg.style.textAlign = `center`;
    cityErrorMsg.style.backgroundColor = `white`;
    cityErrorMsg.style.borderRadius = `20px`;

    cityErrorMsg.textContent = "Nom de ville invalide";

    console.log("Ville : " + city);
    return false;
  }
});

/**
 * Listen to event on address input :
 */
addressInput.addEventListener("input", (event) => {
  console.log(event);

  if (event.target.value.match(regExpAddress)) {
    address = event.target.value;
    addressInput.style.backgroundColor = "white";

    const addressErrorMsg = document.querySelector("#addressErrorMsg");

    addressErrorMsg.textContent = "";
    console.log("Adresse : " + address);
    return address;
  } else {
    address = null;
    addressInput.style.backgroundColor = "red";

    addressErrorMsg.style.width = `150px`;
    addressErrorMsg.style.color = `red`;
    addressErrorMsg.style.textAlign = `center`;
    addressErrorMsg.style.backgroundColor = `white`;
    addressErrorMsg.style.borderRadius = `20px`;

    addressErrorMsg.textContent = "Adresse invalide";

    console.log("Addresse : " + address);
    return false;
  }
});

/**
 * Listen to event on email input :
 */
emailInput.addEventListener("input", (event) => {
  console.log(event);

  if (event.target.value.match(regExpEmail)) {
    email = event.target.value;
    emailInput.style.backgroundColor = "white";

    const emailErrorMsg = document.querySelector("#emailErrorMsg");

    emailErrorMsg.textContent = "";

    console.log("Email : " + email);
    return email;
  } else {
    email = null;
    emailInput.style.backgroundColor = "red";

    emailErrorMsg.style.width = `140px`;
    emailErrorMsg.style.color = `red`;
    emailErrorMsg.style.textAlign = `center`;
    emailErrorMsg.style.backgroundColor = `white`;
    emailErrorMsg.style.borderRadius = `20px`;

    emailErrorMsg.textContent = "Email invalide";

    console.log("Email : " + email);
    return false;
  }
});

// --------------------------------------------------------------------------
/**
 * Listen to click event on buttonOrder :
 */
buttonOrder.addEventListener("click", (event) => {
  console.log(event);
  event.preventDefault();

  let contact = {
    firstName,
    lastName,
    address,
    city,
    email,
  };
  console.log(contact);

  if (basket.length > 0 && firstName && lastName && address && city && email) {
    localStorage.setItem("contact", JSON.stringify(contact));

    okForm.style.visibility = `visible`;
    errorForm.style.visibility = `hidden`;

    console.log(products);

    // Send object contact and array of products-id to server,
    // get orderId,
    // and redirect to confirmation page :
    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contact, products }),
    })
      .then((response) => response.json())
      .then((server) => {
        orderId = server.orderId;
        console.log(orderId);
        if (orderId != "") {
          location.href = "confirmation.html?id=" + orderId;
        }
      })
      .catch((error) => errorMessageFetchPost(error));
  } else if (
    (basket.length <= 0 || basket === null || localStorage.length < 1) &&
    firstName &&
    lastName &&
    address &&
    city &&
    email
  ) {
    event.preventDefault();
    console.log("Panier vide");
    errorForm.style.visibility = `hidden`;
    emptyBasket.style.visibility = `visible`;
  } else {
    console.log("Données formulaire invalides");
    okForm.style.visibility = `hidden`;
    errorForm.style.visibility = `visible`;
  }
});

// -----------------------------------------------------------------------------------
/**
 * Create an Error Message :
 */
function errorMessageFetchPost(errorMessage) {
  console.log(errorMessage);

  okForm.style.visibility = `hidden`;

  const errorFetchPostMsg = document.querySelector(
    ".cart__order__form__submit"
  );

  errorFetchPostMsg.innerText = "Oups ! Erreur lors de l'envoi des données ...";

  errorFetchPostMsg.style.fontSize = `20px`;
  errorFetchPostMsg.style.fontWeight = `500`;
  errorFetchPostMsg.style.color = `red`;
  errorFetchPostMsg.style.backgroundColor = `white`;
  errorFetchPostMsg.style.borderRadius = `20px`;
  errorFetchPostMsg.style.textAlign = `center`;
  errorFetchPostMsg.style.padding = `5px`;
}

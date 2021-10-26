const getCartItemsOL = document.querySelector('.cart__items');
const getItemsSection = document.querySelector('.items');
const getCartSection = document.querySelector('.cart');
const getButtonEmptyCart = document.querySelector('.empty-cart');
const getTotalPriceSpan = document.querySelector('.total-price');
const getSelectInput = document.getElementById('category-select');
const getBtnCart = document.getElementById('btn-cart');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ id, title, thumbnail, price }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('span', 'item__price', price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function addLoadingText() {
  const loading = createCustomElement('div', 'loading', 'Carregando...');
  getItemsSection.appendChild(loading);
}

function removeLoadingText() {
  const loading = document.querySelector('.loading');
  loading.parentNode.removeChild(loading);
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function sumPrices() {
  const priceElements = document.querySelectorAll('.prices');
  let sum = 0;

  priceElements.forEach((element) => {
    sum += parseFloat(element.innerText.split('.').join('').split(',').join('.'), 16);
  });
  
  getTotalPriceSpan.innerText = sum.toLocaleString('pt-br', {minimumFractionDigits: 2});
}

function cartItemClickListener(event) {
  if (event.target && event.target.classList.contains('cart__item')) {
    event.target.parentNode.removeChild(event.target);
    saveCartItems(getCartItemsOL.innerHTML);
    sumPrices();
  } else if (event.target.parentNode.classList.contains('cart__item')) {
    event.target.parentNode.parentNode.removeChild(event.target.parentNode);
    saveCartItems(getCartItemsOL.innerHTML);
    sumPrices();
  } else if (event.target.parentNode.parentNode.classList.contains('cart__item')) {
    event.target.parentNode.parentNode.parentNode.removeChild(event.target.parentNode.parentNode);
    saveCartItems(getCartItemsOL.innerHTML);
    sumPrices();
  }
}

function createCartItemElement({ thumbnail, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerHTML = `<img src="${thumbnail}" alt="imagem produto" class="cart-img"></img> <div><p class="cart-paragraph">${title}</p> <p>R$ <span class="prices">${price.toLocaleString('pt-br', {minimumFractionDigits: 2})}</span></p></div>`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function showProductItems(category) {
  getItemsSection.innerHTML = '';
  addLoadingText();
  const productsItems = await fetchProducts(category)
    .then((result) => result.results);

  productsItems.forEach((product) => {
    getItemsSection.appendChild(createProductItemElement(product));
  });
  removeLoadingText();
}

async function addCartItems(productID) {
  const product = await fetchItem(productID);

  getCartItemsOL.appendChild(createCartItemElement(product));
  sumPrices();
}

getItemsSection.addEventListener('click', async (e) => {
  if (e.target && e.target.classList.contains('item__add')) {
    const productClickedID = e.target.parentNode.firstChild.innerText;
    await addCartItems(productClickedID);
    saveCartItems(getCartItemsOL.innerHTML);
  }
});

getButtonEmptyCart.addEventListener('click', () => {
  getCartItemsOL.innerText = '';
  saveCartItems(getCartItemsOL.innerHTML);
  sumPrices();
});

function getSavedCart() {
  getCartItemsOL.innerHTML = getSavedCartItems();
  const getCartItems = document.querySelectorAll('.cart__item');
  
  getCartItems.forEach((item) => item.addEventListener('click', cartItemClickListener));
  sumPrices();
}

getSelectInput.addEventListener('change', () => {
  const getSelectValue = getSelectInput.options[getSelectInput.selectedIndex].value;
  if (getSelectValue !== '') {
    showProductItems(getSelectInput.options[getSelectInput.selectedIndex].value);
  }
})

getBtnCart.addEventListener('click', () => {
  if (getItemsSection.style.display === 'none') {
    getItemsSection.style.display = 'inherit';
    getCartSection.style.display = 'none';

  } else {
    getItemsSection.style.display = 'none';
    getCartSection.style.display = 'inherit';
  }

});

window.onload = () => {
  showProductItems('tudo')
  getSavedCart();
};

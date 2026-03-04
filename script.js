let cart = []; // 1. Vytvorenie priestoru pre vybrané produkty
const productsContainer = document.querySelector('.card__deserts'); // 2. Určenie priestoru v HTML kde sa budu zobrazovat produkty

// ==========================================
// 1. DEFINÍCIA FUNKCIÍ (Aby boli viditeľné pre listenery)
// ==========================================

function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    
    // Reset vizuálu produktu v zozname
    const productCard = document.querySelector(`.product__card[data-name="${productName}"]`);
    if (productCard) {
        productCard.classList.remove('is-selected');
        const btn = productCard.querySelector('.product__add--btn');
        if (btn) {
            btn.classList.remove('active');
            btn.innerHTML = `
                <span class="add-content">
                    <img src="./assets/images/icon-add-to-cart.svg" alt=" " aria-hidden="true">
                    <span class="add-cart">Add to Cart</span>
                </span>
            `;
        }
    }
    renderCart();
}

// Pridanie do košíka
function addToCart(name, price, thumbnail) {
    const existingProduct = cart.find(item => item.name === name);
    if (!existingProduct) {
        cart.push({ name, price, thumbnail, quantity: 1 });
    }
    renderCart();
}


// prikaz na nacitanie dat zo suboru .json
fetch('./data.json') 
    .then(response => response.json()) //prikaz, aby script vedel precitat data zo suboru .json

    // zadefinovanie nacitavania a urcenie struktury zobrazovania produktov
    .then(data => {
        let allProductsHTML = ''; // Priprava retazca, aby sme nerobili innerHTML += v cykle

        // zadefinovanie struktury
        data.forEach(product => {
            allProductsHTML += `
                <article class="product__card" data-name="${product.name}" data-thumbnail="${product.image.thumbnail}">
                    <div class="product__image--container">
                        <picture>
                        <source media="(min-width: 600px)" srcset="${product.image.desktop}">
                        <source media="(min-width: 400px)" srcset="${product.image.tablet}">
                        <img src="${product.image.mobile}" alt="" aria-hidden="true">
                        </picture>

                        <button type="button" class="product__add--btn">
                            <span class="add-content">
                            <img src="./assets/images/icon-add-to-cart.svg" alt=" " aria-hidden="true">
                            <span class="add-cart">Add to Cart</span>
                            </span>
                        </button>
                    </div>

                    <div class="product__info">
                        <p class="product__category">${product.category}</p>
                        <h2 class="product__name">${product.name}</h2>          
                        <strong class="product__price">${product.price.toFixed(2)}</strong>
                    </div>
                </article>
            `;    
            
            
        });

        // vlozenie vsetkych produktov
            productsContainer.innerHTML = allProductsHTML;

    })

    .catch(error => console.error("Chyba pri načítaní:", error)); //kontrola chyby

    // ==========================================
// EVENT LISTENER PRE PRIDANIE DO KOŠÍKA
// ==========================================

// Listener pre Add to Cart a +/- tlačidlá
productsContainer.addEventListener('click', (e) => {
    // Logika pre pridanie (Add to Cart)
    const addBtn = e.target.closest('.add-content');
    if (addBtn) {
        const productCard = addBtn.closest('.product__card');
        const parentBtn = addBtn.closest('.product__add--btn');
        const name = productCard.getAttribute('data-name');
        const price = parseFloat(productCard.querySelector('.product__price').innerText);
        const thumbnail = productCard.getAttribute('data-thumbnail');

        parentBtn.classList.add('active');
        productCard.classList.add('is-selected');
        parentBtn.innerHTML = `
            <span class="quantity-content">
                <span class="qty-btn-container" data-action="decrement" role="button">
                    <img src="./assets/images/icon-decrement-quantity.svg" alt="" aria-hidden="true">
                </span>
                <span class="qty-count">1</span>
                <span class="qty-btn-container" data-action="increment" role="button">
                    <img src="./assets/images/icon-increment-quantity.svg" alt="" aria-hidden="true">
                </span>
            </span>
        `;
        addToCart(name, price, thumbnail);
        return; // Ukončíme, aby sa nespustila logika nižšie
    }

    // Logika pre Increment / Decrement
    const plusBtn = e.target.closest('[data-action="increment"]');
    const minusBtn = e.target.closest('[data-action="decrement"]');

    if (plusBtn || minusBtn) {
        const productCard = (plusBtn || minusBtn).closest('.product__card');
        const name = productCard.getAttribute('data-name');
        const itemInCart = cart.find(item => item.name === name);

        if (itemInCart) {
            if (plusBtn) itemInCart.quantity += 1;
            else itemInCart.quantity -= 1;

            if (itemInCart.quantity <= 0) {
                removeFromCart(name);
            } else {
                renderCart();
                const qtyDisplay = productCard.querySelector('.qty-count');
                if (qtyDisplay) qtyDisplay.innerText = itemInCart.quantity;
            }
        }
    }
});

// Listener pre krížik v košíku (Delegácia udalostí)
document.querySelector('.cart__items-container').addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.cart__item-remove');
    if (removeBtn) {
        const name = removeBtn.getAttribute('data-product');
        removeFromCart(name);
    }
});

// ==========================================
// RENDEROVANIE KOŠÍKA
// ==========================================
function renderCart() {
    const emptyState = document.querySelector('.cart__state--empty');
    const selectedState = document.querySelector('.cart__state--selected');
    const cartItemsContainer = document.querySelector('.cart__items-container');
    const cartCountElement = document.getElementById('cart-count');
    const cartTotal = document.querySelector('.cart__total');
    const cartDelivery = document.querySelector('.cart__delivery-info');
    const cartBtnConfirm = document.querySelector('.cart__btn-confirm');
    
    let totalAmount = 0;
    let totalItemsCount = 0;

    if (cart.length > 0) {
        emptyState.style.display = 'none';
        emptyState.setAttribute('aria-hidden', 'true'); // Čítačka toto úplne ignoruje

        selectedState.style.display = 'block';
        selectedState.setAttribute('aria-hidden', 'false'); // Čítačka toto číta

        if (cartTotal) cartTotal.style.display = 'flex';
        if (cartDelivery) cartDelivery.style.display = 'flex';
        if (cartBtnConfirm) cartBtnConfirm.style.display = 'block';

        let cartHTML = ''; // Opäť výkon: skladáme string mimo DOMu
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            totalAmount += itemTotal;
            totalItemsCount += item.quantity;

            cartHTML += `
                <div class="cart__item">
                    <div class="cart__item-details">
                        <p class="cart__item-name">${item.name}</p>
                        <div class="cart__item-meta">
                            <span class="cart__item-count">${item.quantity}x</span>
                            <span class="cart__item-price">@ $${item.price.toFixed(2)}</span>
                            <span class="cart__item-subtotal">$${itemTotal.toFixed(2)}</span>
                        </div>
                    </div>
                    <button type="button" class="cart__item-remove" onclick="removeFromCart('${item.name}')" aria-label="Remove ${item.name} from cart">
                        <img src="./assets/images/icon-remove-item.svg" alt="" aria-hidden="true">
                    </button>
                    <div class="separator"></div>
                </div>
            `;
        });

        cartItemsContainer.innerHTML = cartHTML;
        
        // Aktualizácia sumy a počtu
        const totalPriceElement = document.querySelector('.cart__total-price');
        if (totalPriceElement) {
            totalPriceElement.innerText = `$${totalAmount.toFixed(2)}`;
        }
        cartCountElement.innerText = totalItemsCount;

    } else {
        // Ak je košík prázdny, všetko skryjeme
        emptyState.style.display = 'flex';
        emptyState.setAttribute('aria-hidden', 'false');

        selectedState.style.display = 'none';
        selectedState.setAttribute('aria-hidden', 'true');
        cartCountElement.innerText = '0';
        
        if (cartTotal) cartTotal.style.display = 'none';
        if (cartDelivery) cartDelivery.style.display = 'none';
        if (cartBtnConfirm) cartBtnConfirm.style.display = 'none';
    }
}

// ==========================================
// PLUS A MÍNUS LOGIKA
// ==========================================
productsContainer.addEventListener('click', (e) => {
    const plusBtn = e.target.closest('[data-action="increment"]');
    const minusBtn = e.target.closest('[data-action="decrement"]');

    if (plusBtn || minusBtn) {
        const productCard = (plusBtn || minusBtn).closest('.product__card');
        const name = productCard.getAttribute('data-name');
        const itemInCart = cart.find(item => item.name === name);

        if (itemInCart) {
            if (plusBtn) itemInCart.quantity += 1;
            else itemInCart.quantity -= 1;

            if (itemInCart.quantity <= 0) {
                removeFromCart(name);
            } else {
                renderCart();
                const qtyDisplay = productCard.querySelector('.qty-count');
                if (qtyDisplay) qtyDisplay.innerText = itemInCart.quantity;
            }
        }
    }
});

// ==========================================
// ODSTRÁNENIE Z KOŠÍKA (GLOBÁLNA FUNKCIA)
// ==========================================
window.removeFromCart = function(productName) {
    cart = cart.filter(item => item.name !== productName);
    renderCart();

    const productCard = document.querySelector(`.product__card[data-name="${productName}"]`);
    if (productCard) {
        productCard.classList.remove('is-selected');
        const btn = productCard.querySelector('.product__add--btn');
        if (btn) {
            btn.classList.remove('active');
            btn.innerHTML = `
                <span class="add-content">
                    <img src="./assets/images/icon-add-to-cart.svg" alt=" " aria-hidden="true">
                    <span class="add-cart">Add to Cart</span>
                </span>
            `;
        }
    }
};

// ==========================================
// MODAL A POTVRDENIE
// ==========================================
const confirmBtn = document.querySelector('.cart__btn-confirm');
const orderModal = document.querySelector('.order-modal');
const modalItemsContainer = document.querySelector('.order-modal__items-container');
const startNewOrderBtn = document.querySelector('.order-modal__btn-new');

if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
        let modalHTML = '';
        let orderTotal = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            orderTotal += itemTotal;

            modalHTML += `
                <div class="order-modal__item">
                    <img src="${item.thumbnail}" alt="" aria-hidden="true" class="order-modal__item-img">
                    <div class="order-modal__item-info">
                        <p class="order-modal__item-name">${item.name}</p>
                        <div class="order-modal__item-meta">
                            <span class="order__item-count">${item.quantity}x</span>
                            <span class="order__item-price">@ $${item.price.toFixed(2)}</span>
                        </div>
                    </div>
                    <strong class="order-modal__item-subtotal">$${itemTotal.toFixed(2)}</strong>
                    <div class="order-modal__separator"></div>
                </div>
            `;
        });

        modalItemsContainer.innerHTML = modalHTML;
        document.querySelector('.order-modal__total-price').innerText = `$${orderTotal.toFixed(2)}`;
        orderModal.style.display = 'flex';
        window.scrollTo(0, 0);
        document.body.style.overflow = 'hidden';
    });
}

if (startNewOrderBtn) {
    startNewOrderBtn.addEventListener('click', () => {
        cart = [];
        orderModal.style.display = 'none';
        document.body.style.overflow = 'auto';

        document.querySelectorAll('.product__card').forEach(card => {
            card.classList.remove('is-selected');
            const btn = card.querySelector('.product__add--btn');
            if (btn) {
                btn.classList.remove('active');
                btn.innerHTML = `
                    <span class="add-content">
                        <img src="./assets/images/icon-add-to-cart.svg" alt=" " aria-hidden="true">
                        <span class="add-cart">Add to Cart</span>
                    </span>
                `;
            }
        });
        renderCart();
    });
}
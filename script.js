// 1. vytvorenie priestoru, do ktoreho sa budu ukladat vybrane produkty
let cart = []; 

// 2. Urcenie miesta v HTML, pod ktorym sa budu produkty ukladat / zobrazovat
const productsContainer = document.querySelector('.card__deserts');

// 3. Načítanie dát zo suboru .json
fetch('./data.json')
  .then(response => response.json()) //zabezpeci, ze script bude vediet nacitat udaje z .json
  .then(data => {

// 4. Zabezpeci, za script prejde každý produkt v zozname z .json a pomenuje ho product
    data.forEach(product => {
      
// 5. Vytvorenie "šablóny" pre jeden produkt, presna struktura z html so zamenenim odkazov a nazvov za oznacenie v dokumente .json
      const productHTML = `
        <article class="product__card" data-name="${product.name}" data-thumbnail=${product.image.thumbnail}>

          <div class="product__image--container">
            <picture>
              <source media="(min-width: 600px)" srcset="${product.image.desktop}">
              <source media="(min-width: 400px)" srcset="${product.image.tablet}">
              <img src="${product.image.mobile}" alt="${product.name}">
            </picture>

            <button type="button" class="product__add--btn">
              <div class="add-content">
                <img src="./assets/images/icon-add-to-cart.svg" alt="add to cart"> 
                <span class="add-cart"> Add to Cart</span>
              </div>

              <div class="quantity-content">
                <div class="qty-btn-container">
                    <img src="./assets/images/icon-decrement-quantity.svg" alt="minus" class="qty-img">
                </div>
                <span>1</span>
                <div class="qty-btn-container">
                    <img src="./assets/images/icon-increment-quantity.svg" alt="plus" class="qty-img">
                </div>
              </div>
            </button>
          </div>

          <div class="product__info">
            <span class="product__category">${product.category}</span>
            <h2 class="product__name">${product.name}</h2>          
            <span class="product__price">${product.price}</span>
          </div>
          
        </article>
        `;
        
      productsContainer.innerHTML += productHTML;
    });
  })
  .catch(error => console.error("Chyba:", error));

// Prepnutie tlačidla na červené (stav Active)
// POSLUCHÁČ NA KLIKNUTIA (zatiaľ len pre pridanie do košíka)
productsContainer.addEventListener('click', (e) => {
    // 1. overenie, či používateľ klikol na biele tlačidlo "Add to Cart"
    const addBtn = e.target.closest('.add-content');

    if (addBtn) {
        // 2. zistenie nadradenej karty produktu a samotné tlačidlo
        const productCard = addBtn.closest('.product__card');
        const parentBtn = addBtn.closest('.product__add--btn');

        // ZÍSKANIE DÁT Z KARTY
        const name = productCard.getAttribute('data-name');
        //  vyber textu pre cenu a jeho zmena na číslo
        const price = parseFloat(productCard.querySelector('.product__price').innerText);
        const thumbnail = productCard.getAttribute('data-thumbnail');

        // 3. Prepnutie vizuálu (pridanie CSS tried)
        // skryt "Add to Cart" a zobrazit "Quantity" (plus/mínus)
        parentBtn.classList.add('active');
        
        // pridanie červeneho border obrázku 
        productCard.classList.add('is-selected');

        console.log("Tlačidlo prepnuté na červené pre:", productCard.getAttribute('data-name'));
        // VOLANIE FUNKCIE PRE PRIDANIE
        addToCart(name, price, thumbnail);
    }
});

//pridanie objektu do poľa cart.
function addToCart(name, price, thumbnail) {
    // kontrola, či tam už náhodou nie je (ochrana)
    const existingProduct = cart.find(item => item.name === name);

    if (!existingProduct) {
        cart.push({
            name: name,
            price: price,
            thumbnail: thumbnail,
            quantity: 1 // Začíname s jedným kusom
        });
    }

    // Vykreslenie košíka nanovo
    renderCart();
}

// Funkcia renderCart prepína stavy (prázdny/plný) a vypisuje produkty.
function renderCart() {
    const emptyState = document.querySelector('.cart__state--empty');
    const selectedState = document.querySelector('.cart__state--selected');
    const cartItemsContainer = document.querySelector('.cart__items-container');
    const cartCountElement = document.getElementById('cart-count');
    const cartTotal = document.querySelector('.cart__total');
    const cartDelivery = document.querySelector('.cart__delivery-info');
    const cartBtnConfirm = document.querySelector('.cart__btn-confirm');

    if (cart.length > 0) {
        // Ak niečo v košíku je
        emptyState.style.display = 'none';
        selectedState.style.display = 'block';

        if (cartTotal) cartTotal.style.display = 'flex';
        if (cartDelivery) cartDelivery.style.display = 'flex';
        if (cartBtnConfirm) cartBtnConfirm.style.display = 'block';

        cartItemsContainer.innerHTML = ''; // vycistenie stareho zoznam
        let totalAmount = 0;
        let totalItemsCount = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            totalAmount += itemTotal;
            totalItemsCount += item.quantity;

            cartItemsContainer.innerHTML += `
                <div class="cart__item">
                    <div class="cart__item-details">
                        <p class="cart__item-name">${item.name}</p>
                        <div class="cart__item-meta">
                            <span class="cart__item-count">${item.quantity}x</span>
                            <span class="cart__item-price">@ $${item.price.toFixed(2)}</span>
                            <span class="cart__item-subtotal">$${itemTotal.toFixed(2)}</span>
                        </div>
                    </div>
                    <button class="cart__item-remove" onclick="removeFromCart('${item.name}')">
                        <img src="./assets/images/icon-remove-item.svg" alt="remove">
                    </button>
                    <div class="separator"></div>
                </div>
            `;
        });

        // aktualizacia celkovej sumy a poctu v zatvorke
        document.querySelector('.cart__total-price').innerText = `$${totalAmount.toFixed(2)}`;
        cartCountElement.innerText = totalItemsCount;

    } else {
        // Ak je košík prázdny
        emptyState.style.display = 'flex';
        selectedState.style.display = 'none';
        cartCountElement.innerText = '0';
        if (cartTotal) cartTotal.style.display = 'none';
        if (cartDelivery) cartDelivery.style.display = 'none';
        if (cartBtnConfirm) cartBtnConfirm.style.display = 'none';
    }
}

// ==========================================
// 4. KROK: OŽIVENIE TLAČIDIEL PLUS A MÍNUS
// ==========================================
productsContainer.addEventListener('click', (e) => {
    // overenie, či používateľ klikol na kontajner s plusom alebo mínusom
    const plusContainer = e.target.closest('.qty-btn-container:has(img[alt="plus"])') || e.target.closest('img[alt="plus"]');
    const minusContainer = e.target.closest('.qty-btn-container:has(img[alt="minus"])') || e.target.closest('img[alt="minus"]');

    if (plusContainer || minusContainer) {
        // 1. zistenie karty produktu, aby sme vedeli, o ktorý dezert ide
        const productCard = (plusContainer || minusContainer).closest('.product__card');
        const name = productCard.getAttribute('data-name');

        // 2. najdenie tohto produktu v našom poli 'cart'
        const itemInCart = cart.find(item => item.name === name);

        if (itemInCart) {
            if (plusContainer) {
                itemInCart.quantity += 1; // Pripočítame
            } else {
                itemInCart.quantity -= 1; // Odpočítame
            }

            // 3. Ak množstvo klesne na 0, produkt z košíka bude odstraneny
            if (itemInCart.quantity <= 0) {
                cart = cart.filter(item => item.name !== name);
                
                // resetovanie vizuálu tlačidla späť na biele
                productCard.classList.remove('is-selected');
                productCard.querySelector('.product__add--btn').classList.remove('active');
            }

            // 4. AKTUALIZÁCIA: Prekreslenie kosika a prepisanie cisla na červenom tlačidle
            renderCart();
            
            // prepisanie cisla 1, 2, 3... priamo v tom červenom tlačidle
            const qtyDisplay = productCard.querySelector('.quantity-content span');
            if (qtyDisplay) {
                qtyDisplay.innerText = itemInCart ? itemInCart.quantity : 1;
            }
        }
    }
});

// ==========================================
// 5. KROK: POTVRDENIE OBJEDNÁVKY (MODAL)
// ==========================================

// najdenie potrebnych prvkov v HTML
const confirmBtn = document.querySelector('.cart__btn-confirm');
const orderModal = document.querySelector('.order-modal');
const modalItemsContainer = document.querySelector('.order-modal__items-container');
const startNewOrderBtn = document.querySelector('.order-modal__btn-new');

if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
        // 1. vycistenie stareho obsahu modálneho okna
        modalItemsContainer.innerHTML = '';
        let orderTotal = 0;

        // 2. overenie produktov v košíku a ich vykreslenie do modalu
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            orderTotal += itemTotal;

            modalItemsContainer.innerHTML += `
                <div class="order-modal__item">
                    <img src="${item.thumbnail}" alt="${item.name}" class="order-modal__item-img">

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

        // 3. doplnenie celkovej sumy do modalu
        document.querySelector('.order-modal__total-price').innerText = `$${orderTotal.toFixed(2)}`;

        // 4. zobrazenie modal 
        orderModal.style.display = 'flex';
        
        // zablokovanie scrollovania pozadia, kým je modal otvorený
        document.body.style.overflow = 'hidden';
    });
}

// 6. KROK: TLAČIDLO "START NEW ORDER" (RESET VŠETKÉHO)
if (startNewOrderBtn) {
    startNewOrderBtn.addEventListener('click', () => {
        // 1. vyprazdnenie kosika (pole)
        cart = [];

        // 2. skrytie modal
        orderModal.style.display = 'none';
        document.body.style.overflow = 'auto';

        // 3. resetovanie vizuálu všetkých produktov na stránke (všetky tlačidlá na biele)
        document.querySelectorAll('.product__card').forEach(card => {
            card.classList.remove('is-selected');
            const btn = card.querySelector('.product__add--btn');
            if (btn) btn.classList.remove('active');
            const qtySpan = card.querySelector('.quantity-content span');
            if (qtySpan) qtySpan.innerText = '1';
        });

        // 4. vyprazdnenie kosika
        
        renderCart();
    });
}
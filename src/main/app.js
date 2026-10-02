// Базовый рабочий код GlamourEssence

// Telegram WebApp
const tg = window.Telegram.WebApp;
if (tg) {
    tg.expand();
    tg.enableClosingConfirmation();
}

// Данные продуктов
const products = [
    {
        id: 1,
        name: "Молочко для рук и тела с мочевиной 10%",
        brand: "GlamourEssence",
        price: 500,
        discount: 0,
        image: "🥛",
        isNew: true
    },
    {
        id: 2,
        name: "Молочко для рук и тела с мочевиной 10%",
        brand: "GlamourEssence",
        price: 500,
        discount: 15,
        image: "🌸",
        isNew: true
    },
    {
        id: 3,
        name: "Talaris крем для стоп с мочевиной",
        brand: "Talaris",
        price: 320,
        discount: 10,
        image: "🦶",
        isNew: true
    },
    {
        id: 4,
        name: "Крем для рук смягчающий",
        brand: "GlamourEssence",
        price: 240,
        discount: 0,
        image: "🧴",
        isNew: false
    }
];

// Корзина
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Функция для показа уведомлений
function showAlert(message) {
    if (tg && tg.showAlert) {
        tg.showAlert(message);
    } else {
        alert(message);
    }
}

// Загрузка при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    console.log("Страница загружена!");

    // Показываем товары
    loadProducts();

    // Обновляем счетчик корзины
    updateCartCount();

    // Настраиваем кнопки
    setupButtons();
});

// Показываем товары
function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    productsGrid.innerHTML = '';

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';

        // Цена со скидкой
        const finalPrice = product.discount > 0
            ? Math.round(product.price * (100 - product.discount) / 100)
            : product.price;

        card.innerHTML = `
            <div class="product-image">
                ${product.isNew ? '<span class="product-badge">НОВИНКА</span>' : ''}
                ${product.discount > 0 ? `<span class="product-badge">-${product.discount}%</span>` : ''}
                <div style="font-size: 50px;">${product.image}</div>
            </div>
            <div class="product-info">
                <div style="font-size: 11px; color: #00ff88;">${product.brand}</div>
                <h4>${product.name}</h4>
                <div class="product-price">
                    ${product.discount > 0 ? `
                        <span style="font-size: 14px; color: #888; text-decoration: line-through;">
                            ${product.price} ₽
                        </span>
                    ` : ''}
                    <span>${finalPrice} ₽</span>
                </div>
                <button class="add-to-cart-btn" data-id="${product.id}">
                    <i class="fas fa-cart-plus"></i> В корзину
                </button>
            </div>
        `;

        productsGrid.appendChild(card);
    });
}

// Настраиваем все кнопки
function setupButtons() {
    // Кнопка корзины в шапке
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', showCart);
    }

    // Кнопка закрытия корзины
    const closeCartBtn = document.getElementById('closeCartBtn');
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', hideCart);
    }

    // Кнопка оформления заказа
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }

    // Кнопки "В корзину" на карточках товаров
    document.addEventListener('click', function (e) {
        if (e.target.closest('.add-to-cart-btn')) {
            const btn = e.target.closest('.add-to-cart-btn');
            const productId = parseInt(btn.dataset.id);
            addToCart(productId);
        }
    });
}

// Добавить в корзину
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Проверяем, есть ли уже в корзине
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    // Сохраняем в localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Обновляем счетчик
    updateCartCount();

    // Показываем корзину с добавленным товаром
    showCart();

    // Показываем уведомление
    showAlert(`${product.name} добавлен в корзину!`);
}

// Обновить счетчик корзины
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const total = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = total;
    }
}

// Показать корзину
function showCart() {
    const overlay = document.getElementById('cartOverlay');
    if (overlay) {
        overlay.style.display = 'block';
        renderCartItems();
    }
}

// Скрыть корзину
function hideCart() {
    const overlay = document.getElementById('cartOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

// Показать товары в корзине
function renderCartItems() {
    const container = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');

    if (!container) return;

    container.innerHTML = '';

    if (cart.length === 0) {
        container.appendChild(emptyCart);
        document.querySelector('.total-price').textContent = '0 ₽';
        emptyCart.style.display = 'block';
        return;
    }

    emptyCart.style.display = 'none';
    let totalPrice = 0;

    cart.forEach(item => {
        const finalPrice = item.discount > 0
            ? Math.round(item.price * (100 - item.discount) / 100)
            : item.price;
        const itemTotal = finalPrice * item.quantity;
        totalPrice += itemTotal;

        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <div style="display: flex; justify-content: space-between;">
                <div style="flex: 1;">
                    <h4>${item.name}</h4>
                    <div style="display: flex; align-items: center; gap: 10px; margin-top: 10px;">
                        <button onclick="changeQuantity(${item.id}, -1)" style="background:#333; color:#fff; border:none; width:30px; height:30px; border-radius:50%; cursor:pointer;">-</button>
                        <span>${item.quantity} шт.</span>
                        <button onclick="changeQuantity(${item.id}, 1)" style="background:#00ff88; color:#000; border:none; width:30px; height:30px; border-radius:50%; cursor:pointer;">+</button>
                        <span style="margin-left: auto; font-weight: bold;">${itemTotal} ₽</span>
                    </div>
                </div>
                <button onclick="removeItem(${item.id})" style="background:none; border:none; color:#ff6b93; margin-left:15px; cursor:pointer;">✕</button>
            </div>
        `;
        container.appendChild(itemEl);
    });

    document.querySelector('.total-price').textContent = `${totalPrice} ₽`;
}

// Изменить количество (глобальная функция для кнопок в корзине)
window.changeQuantity = function (productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== productId);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
};

// Удалить товар (глобальная функция для кнопок в корзине)
window.removeItem = function (productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
};

// Оформить заказ
function checkout() {
    if (cart.length === 0) {
        showAlert('Добавьте товары в корзину!');
        return;
    }

    const total = cart.reduce((sum, item) => {
        const price = item.discount > 0
            ? Math.round(item.price * (100 - item.discount) / 100)
            : item.price;
        return sum + (price * item.quantity);
    }, 0);

    showAlert(`Заказ на ${total}₽ оформлен! С вами свяжется менеджер.`);

    // Очищаем корзину
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    hideCart();
} 

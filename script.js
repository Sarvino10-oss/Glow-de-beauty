let products = [
    {
        id: 1,
        name: "Tirtir Mask Fit Red Cushion",
        category: "makeup",
        price: 185000,
        oldPrice: 220000,
        discount: 16,
        weight: 100,
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800",
        isNew: true
    },

    {
        id: 2,
        name: "Elegant Basic Dress",
        category: "clothes",
        price: 295000,
        oldPrice: 350000,
        discount: 16,
        weight: 500,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800",
        isNew: true
    },

    {
        id: 3,
        name: "Minimal Gold Necklace",
        category: "accessories",
        price: 95000,
        oldPrice: 120000,
        discount: 21,
        weight: 50,
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800",
        isNew: false
    },

    {
        id: 4,
        name: "Make Up Brush Set",
        category: "makeup",
        price: 125000,
        oldPrice: 160000,
        discount: 22,
        weight: 150,
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",
        isNew: true
    }
];

let cart = JSON.parse(localStorage.getItem("glowCart")) || [];

let currentLanguage = localStorage.getItem("glowLanguage") || "uz";

const translations = {

    uz: {
        heroTitle: "Go‘zallik va uslub bir joyda",
        heroText: "Kiyimlar, make up va aksessuarlar",
        shopping: "Xarid qilish",

        categories: "Kategoriyalar",
        choose: "O‘zingizga mosini tanlang",

        clothes: "Kiyimlar",
        makeup: "Make Up",
        accessories: "Aksessuarlar",

        sale: "MAXSUS TAKLIFLAR",
        saleTitle: "Skidkadagi mahsulotlar",
        newTitle: "Yangi mahsulotlar",

        all: "Barchasi",
        search: "Mahsulot qidirish",
        searchPlaceholder: "Mahsulot nomini yozing...",

        cart: "Savatcha",
        total: "Jami:",
        checkout: "Buyurtma berish",

        home: "Bosh sahifa"
    },

    ru: {
        heroTitle: "Красота и стиль в одном месте",
        heroText: "Одежда, макияж и аксессуары",
        shopping: "Покупать",

        categories: "Категории",
        choose: "Выберите то, что вам подходит",

        clothes: "Одежда",
        makeup: "Make Up",
        accessories: "Аксессуары",

        sale: "СПЕЦИАЛЬНЫЕ ПРЕДЛОЖЕНИЯ",
        saleTitle: "Товары со скидкой",
        newTitle: "Новые товары",

        all: "Все",
        search: "Поиск товара",
        searchPlaceholder: "Введите название товара...",

        cart: "Корзина",
        total: "Итого:",
        checkout: "Оформить заказ",

        home: "Главная"
    }
};


function formatPrice(price) {
    return price.toLocaleString("ru-RU") + " so‘m";
}


function productCard(product) {

    return `
        <div class="product-card">

            ${
                product.discount
                ? `<span class="discount">-${product.discount}%</span>`
                : ""
            }

            <img
                class="product-image"
                src="${product.image}"
                alt="${product.name}"
            >

            <div class="product-info">

                <div class="product-name">
                    ${product.name}
                </div>

                <div class="product-price">

                    ${formatPrice(product.price)}

                    ${
                        product.oldPrice
                        ? `
                        <span class="old-price">
                            ${formatPrice(product.oldPrice)}
                        </span>
                        `
                        : ""
                    }

                </div>

                <button
                    class="add-cart"
                    onclick="addToCart(${product.id})"
                >
                    Savatchaga qo‘shish
                </button>

            </div>

        </div>
    `;
}


function renderProducts() {

    const saleContainer = document.getElementById("saleProducts");
    const newContainer = document.getElementById("newProducts");

    const saleProducts = products.filter(
        product => product.discount
    );

    const newProducts = products.filter(
        product => product.isNew
    );

    saleContainer.innerHTML =
        saleProducts.map(productCard).join("");

    newContainer.innerHTML =
        newProducts.map(productCard).join("");
}


function addToCart(id) {

    const product = products.find(
        product => product.id === id
    );

    if (!product) return;

    const existing = cart.find(
        item => item.id === id
    );

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();

    openCart();
}


function saveCart() {

    localStorage.setItem(
        "glowCart",
        JSON.stringify(cart)
    );

    updateCartCount();
    renderCart();
}


function updateCartCount() {

    const count = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    document.getElementById("cartCount").textContent = count;
}


function renderCart() {

    const container =
        document.getElementById("cartItems");

    if (!cart.length) {

        container.innerHTML =
            "<p>Savatcha hozircha bo‘sh.</p>";

        document.getElementById("cartTotal").textContent =
            "0 so‘m";

        return;
    }

    container.innerHTML = cart.map(item => {

        return `
            <div class="cart-item">

                <img
                    src="${item.image}"
                    alt="${item.name}"
                >

                <div class="cart-item-info">

                    <strong>
                        ${item.name}
                    </strong>

                    <div class="product-price">
                        ${formatPrice(
                            item.price * item.quantity
                        )}
                    </div>

                    <div class="quantity-controls">

                        <button
                            onclick="changeQuantity(${item.id}, -1)"
                        >
                            −
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            onclick="changeQuantity(${item.id}, 1)"
                        >
                            +
                        </button>

                        <button
                            onclick="removeFromCart(${item.id})"
                        >
                            ×
                        </button>

                    </div>

                </div>

            </div>
        `;

    }).join("");

    const total = cart.reduce(
        (sum, item) =>
            sum + item.price * item.quantity,
        0
    );

    document.getElementById("cartTotal").textContent =
        formatPrice(total);
}


function changeQuantity(id, amount) {

    const item = cart.find(
        item => item.id === id
    );

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(
            item => item.id !== id
        );
    }

    saveCart();
}


function removeFromCart(id) {

    cart = cart.filter(
        item => item.id !== id
    );

    saveCart();
}


function openCart() {

    document.getElementById("cartPanel")
        .classList.add("active");

    document.getElementById("overlay")
        .classList.add("active");

    renderCart();
}


function closeCart() {

    document.getElementById("cartPanel")
        .classList.remove("active");

    document.getElementById("overlay")
        .classList.remove("active");
}


function closePanels() {
    closeCart();
}


function openSearch() {

    document.getElementById("searchModal")
        .classList.add("active");

    document.getElementById("searchInput")
        .focus();
}


function closeSearch() {

    document.getElementById("searchModal")
        .classList.remove("active");

}


function searchProducts() {

    const value =
        document.getElementById("searchInput")
        .value
        .toLowerCase()
        .trim();

    const results =
        products.filter(product =>
            product.name
            .toLowerCase()
            .includes(value)
        );

    document.getElementById("searchResults").innerHTML =
        results.map(productCard).join("");
}


function openCategory(category) {

    const filtered =
        products.filter(
            product => product.category === category
        );

    const title =
        category === "clothes"
            ? translations[currentLanguage].clothes
            : category === "makeup"
                ? translations[currentLanguage].makeup
                : translations[currentLanguage].accessories;

    document.getElementById("saleTitle")
        .textContent = title;

    document.getElementById("saleProducts")
        .innerHTML =
        filtered.map(productCard).join("");

    window.scrollTo({
        top: document.getElementById("categories").offsetTop,
        behavior: "smooth"
    });
}


function showAllProducts() {

    document.getElementById("saleTitle")
        .textContent =
        translations[currentLanguage].all;

    document.getElementById("saleProducts")
        .innerHTML =
        products.map(productCard).join("");
}


function scrollToCategories() {

    document.getElementById("categories")
        .scrollIntoView({
            behavior: "smooth"
        });
}


function goHome() {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    renderProducts();
}


function checkout() {

    if (!cart.length) {

        alert(
            currentLanguage === "uz"
            ? "Savatchangiz bo‘sh."
            : "Ваша корзина пуста."
        );

        return;
    }

    alert(
        currentLanguage === "uz"
        ? "Keyingi bosqichda buyurtma berish formasini qo‘shamiz."
        : "На следующем этапе добавим форму оформления заказа."
    );
}


function changeLanguage() {

    currentLanguage =
        currentLanguage === "uz"
        ? "ru"
        : "uz";

    localStorage.setItem(
        "glowLanguage",
        currentLanguage
    );

    applyLanguage();
}


function applyLanguage() {

    const t =
        translations[currentLanguage];

    document.getElementById("languageBtn")
        .textContent =
        currentLanguage === "uz"
        ? "RU"
        : "UZ";

    document.getElementById("heroTitle")
        .textContent = t.heroTitle;

    document.getElementById("heroText")
        .textContent = t.heroText;

    document.querySelector(".gold-btn")
        .textContent = t.shopping;

    document.getElementById("categoryLabel")
        .textContent = t.categories;

    document.getElementById("categoryTitle")
        .textContent = t.choose;

    document.getElementById("clothesText")
        .textContent = t.clothes;

    document.getElementById("makeupText")
        .textContent = t.makeup;

    document.getElementById("accessoriesText")
        .textContent = t.accessories;

    document.getElementById("saleSmall")
        .textContent = t.sale;

    document.getElementById("saleTitle")
        .textContent = t.saleTitle;

    document.getElementById("newTitle")
        .textContent = t.newTitle;

    document.getElementById("cartTitle")
        .textContent = t.cart;

    document.getElementById("totalText")
        .textContent = t.total;

    document.getElementById("checkoutText")
        .textContent = t.checkout;

    document.getElementById("homeNav")
        .textContent = t.home;

    document.getElementById("clothesNav")
        .textContent = t.clothes;

    document.getElementById("makeupNav")
        .textContent = t.makeup;

    document.getElementById("accessoriesNav")
        .textContent = t.accessories;

    document.getElementById("cartNav")
        .textContent = t.cart;

    document.getElementById("searchTitle")
        .textContent = t.search;

    document.getElementById("searchInput")
        .placeholder =
        t.searchPlaceholder;

    renderProducts();
    renderCart();
}


document
    .getElementById("languageBtn")
    .addEventListener(
        "click",
        changeLanguage
    );


renderProducts();
updateCartCount();
renderCart();
applyLanguage();
/* =========================
   CUSTOMER REGISTRATION
========================= */

const registerModal =
    document.getElementById("registerModal");

const registerForm =
    document.getElementById("registerForm");

const registerConsent =
    document.getElementById("registerConsent");

const registerBtn =
    document.getElementById("registerBtn");

const closeRegister =
    document.getElementById("closeRegister");


/* FORMANI TEKSHIRISH */

function checkRegisterForm() {

    const name =
        document.getElementById("registerName").value.trim();

    const phone =
        document.getElementById("registerPhone").value.trim();

    const region =
        document.getElementById("registerRegion").value;

    const city =
        document.getElementById("registerCity").value.trim();

    const address =
        document.getElementById("registerAddress").value.trim();

    const bts =
        document.getElementById("registerBts").value;


    const valid =
        name.length >= 2 &&
        phone.length >= 9 &&
        region !== "" &&
        city.length >= 2 &&
        address.length >= 5 &&
        bts !== "" &&
        registerConsent.checked;


    registerBtn.disabled = !valid;
}


/* INPUT O‘ZGARISHI */

registerForm?.addEventListener(
    "input",
    checkRegisterForm
);

registerForm?.addEventListener(
    "change",
    checkRegisterForm
);


/* RO‘YXATDAN O‘TISH */

registerForm?.addEventListener("submit", (e) => {

    e.preventDefault();

    if (registerBtn.disabled) return;


    const customer = {

        name:
            document.getElementById("registerName").value.trim(),

        phone:
            document.getElementById("registerPhone").value.trim(),

        region:
            document.getElementById("registerRegion").value,

        city:
            document.getElementById("registerCity").value.trim(),

        address:
            document.getElementById("registerAddress").value.trim(),

        bts:
            document.getElementById("registerBts").value,

        registeredAt:
            new Date().toISOString(),

        orders: 0,

        totalSpent: 0

    };


    localStorage.setItem(
        "glowBeautyCustomer",
        JSON.stringify(customer)
    );


    registerModal.classList.remove("active");


    alert(
        "Ro‘yxatdan o‘tish muvaffaqiyatli yakunlandi!"
    );

});


/* YOPISH */

closeRegister?.addEventListener("click", () => {

    registerModal.classList.remove("active");

});


/* SAHIFA OCHILGANDA */

document.addEventListener("DOMContentLoaded", () => {

    const customer =
        localStorage.getItem("glowBeautyCustomer");


    /*
       Agar mijoz hali ro‘yxatdan o‘tmagan bo‘lsa,
       oynani avtomatik ochamiz.
    */

    if (!customer) {

        setTimeout(() => {

            registerModal?.classList.add("active");

        }, 700);

    }

});
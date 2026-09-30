// ===============================
// GLOW DE BEAUTY — ADMIN JS
// ===============================

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "123456";

const PRODUCT_KEY = "glowBeautyProducts";
const ORDER_KEY = "glowBeautyOrders";
const CUSTOMER_KEY = "glowBeautyCustomer";
const SETTINGS_KEY = "glowBeautySettings";

const STATUSES = [
    "Qabul qilindi",
    "Tayyorlanmoqda",
    "Jo‘natildi",
    "BTS filialiga yetib keldi",
    "Yetkazildi"
];

const defaultProducts = [
    {
        id: "p1",
        name: "TIRTIR Mask Fit Red Cushion",
        category: "makeup",
        price: 180000,
        discountPrice: 159000,
        weight: 100,
        stock: 10,
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800",
        colors: "21N, 23N",
        sizes: "",
        isNew: true,
        isPopular: true,
        hidden: false
    },
    {
        id: "p2",
        name: "Elegant Dress",
        category: "clothes",
        price: 250000,
        discountPrice: 219000,
        weight: 500,
        stock: 5,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800",
        colors: "Black, Beige",
        sizes: "S, M, L, XL",
        isNew: true,
        isPopular: false,
        hidden: false
    },
    {
        id: "p3",
        name: "Gold Necklace",
        category: "accessories",
        price: 120000,
        discountPrice: 99000,
        weight: 50,
        stock: 8,
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800",
        colors: "Gold",
        sizes: "",
        isNew: false,
        isPopular: true,
        hidden: false
    }
];

// ===============================
// STORAGE
// ===============================

function getProducts() {
    let data = localStorage.getItem(PRODUCT_KEY);

    if (!data) {
        localStorage.setItem(PRODUCT_KEY, JSON.stringify(defaultProducts));
        return defaultProducts;
    }

    try {
        return JSON.parse(data);
    } catch {
        return [];
    }
}

function saveProducts(products) {
    localStorage.setItem(PRODUCT_KEY, JSON.stringify(products));
}

function getOrders() {
    try {
        return JSON.parse(localStorage.getItem(ORDER_KEY)) || [];
    } catch {
        return [];
    }
}

function saveOrders(orders) {
    localStorage.setItem(ORDER_KEY, JSON.stringify(orders));
}

function getCustomer() {
    try {
        return JSON.parse(localStorage.getItem(CUSTOMER_KEY)) || null;
    } catch {
        return null;
    }
}

function getSettings() {
    try {
        return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {
            fast: 11500,
            slow: 7700
        };
    } catch {
        return {
            fast: 11500,
            slow: 7700
        };
    }
}

function saveSettings(settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// ===============================
// LOGIN
// ===============================

const loginScreen = document.getElementById("loginScreen");
const adminPanel = document.getElementById("adminPanel");

function showAdmin() {
    if (loginScreen) loginScreen.style.display = "none";
    if (adminPanel) adminPanel.style.display = "flex";
}

function showLogin() {
    if (loginScreen) loginScreen.style.display = "flex";
    if (adminPanel) adminPanel.style.display = "none";
}

if (localStorage.getItem("glowBeautyAdminLoggedIn") === "true") {
    showAdmin();
}

const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {
    loginBtn.addEventListener("click", () => {
        const username = document.getElementById("adminUsername")?.value.trim();
        const password = document.getElementById("adminPassword")?.value;

        const error = document.getElementById("loginError");

        if (
            username === ADMIN_USERNAME &&
            password === ADMIN_PASSWORD
        ) {
            localStorage.setItem("glowBeautyAdminLoggedIn", "true");

            if (error) error.textContent = "";

            showAdmin();
            renderEverything();
        } else {
            if (error) {
                error.textContent = "Login yoki parol noto‘g‘ri.";
            }
        }
    });
}

// Enter bilan login
document.getElementById("adminPassword")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        loginBtn?.click();
    }
});

// ===============================
// LOGOUT
// ===============================

document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("glowBeautyAdminLoggedIn");
    showLogin();
});

// ===============================
// NAVIGATION
// ===============================

document.querySelectorAll(".admin-nav").forEach((button) => {
    button.addEventListener("click", () => {
        const pageName = button.dataset.page;

        document.querySelectorAll(".admin-nav").forEach((btn) => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        document.querySelectorAll(".admin-page").forEach((page) => {
            page.classList.remove("active");
        });

        const target = document.getElementById(pageName);

        if (target) {
            target.classList.add("active");
        }
    });
});

// Open page buttons
document.querySelectorAll(".open-page").forEach((button) => {
    button.addEventListener("click", () => {
        const pageName = button.dataset.page;

        document.querySelectorAll(".admin-nav").forEach((btn) => {
            btn.classList.remove("active");
        });

        document.querySelectorAll(".admin-page").forEach((page) => {
            page.classList.remove("active");
        });

        const nav = document.querySelector(
            `.admin-nav[data-page="${pageName}"]`
        );

        nav?.classList.add("active");

        document.getElementById(pageName)?.classList.add("active");
    });
});

// ===============================
// DASHBOARD
// ===============================

function renderDashboard() {
    const products = getProducts();
    const orders = getOrders();
    const customer = getCustomer();

    const productCount = document.getElementById("productCount");
    const orderCount = document.getElementById("orderCount");
    const customerCount = document.getElementById("customerCount");
    const salesTotal = document.getElementById("salesTotal");

    if (productCount) {
        productCount.textContent = products.filter(p => !p.hidden).length;
    }

    if (orderCount) {
        orderCount.textContent = orders.length;
    }

    if (customerCount) {
        customerCount.textContent = customer ? "1" : "0";
    }

    const totalSales = orders.reduce(
        (sum, order) => sum + Number(order.total || 0),
        0
    );

    if (salesTotal) {
        salesTotal.textContent = formatMoney(totalSales);
    }

    renderRecentOrders();
}

function formatMoney(number) {
    return Number(number || 0).toLocaleString("uz-UZ") + " so‘m";
}

// ===============================
// RECENT ORDERS
// ===============================

function renderRecentOrders() {
    const container = document.getElementById("recentOrders");

    if (!container) return;

    const orders = getOrders()
        .sort((a, b) => {
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        })
        .slice(0, 5);

    if (!orders.length) {
        container.innerHTML = `
            <div class="empty-state">
                Hozircha buyurtmalar yo‘q.
            </div>
        `;
        return;
    }

    container.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-top">
                <strong>${escapeHTML(order.id || "Buyurtma")}</strong>
                <span class="status-badge">
                    ${escapeHTML(order.status || "Qabul qilindi")}
                </span>
            </div>

            <p>
                <strong>${escapeHTML(order.name || order.customer?.name || "Mijoz")}</strong>
            </p>

            <p>${escapeHTML(order.phone || order.customer?.phone || "")}</p>

            <p>
                ${formatMoney(order.total || 0)}
            </p>
        </div>
    `).join("");
}

// ===============================
// PRODUCTS
// ===============================

function renderProducts() {
    const container = document.getElementById("adminProducts");

    if (!container) return;

    const products = getProducts();

    if (!products.length) {
        container.innerHTML = `
            <div class="empty-state">
                Mahsulotlar mavjud emas.
            </div>
        `;
        return;
    }

    container.innerHTML = products.map(product => {
        const finalPrice = product.discountPrice || product.price;

        return `
            <div class="admin-product-card ${product.hidden ? "hidden-product" : ""}">
                
                <img 
                    src="${escapeAttribute(product.image || "")}"
                    alt="${escapeAttribute(product.name)}"
                    class="admin-product-image"
                    onerror="this.src='https://via.placeholder.com/500x500?text=Glow+de+Beauty'"
                >

                <div class="admin-product-info">

                    <h3>${escapeHTML(product.name)}</h3>

                    <p class="admin-product-category">
                        ${getCategoryName(product.category)}
                    </p>

                    <p class="admin-product-price">
                        ${formatMoney(finalPrice)}
                    </p>

                    ${
                        product.discountPrice
                        ? `<p class="old-price">${formatMoney(product.price)}</p>`
                        : ""
                    }

                    <p>
                        Og‘irligi: ${product.weight || 0} g
                    </p>

                    <p>
                        Omborda: ${product.stock ?? 0} dona
                    </p>

                    <div class="product-admin-actions">

                        <button 
                            class="admin-small-btn"
                            onclick="editProduct('${product.id}')"
                        >
                            Tahrirlash
                        </button>

                        <button 
                            class="admin-small-btn"
                            onclick="toggleProduct('${product.id}')"
                        >
                            ${product.hidden ? "Ko‘rsatish" : "Yashirish"}
                        </button>

                        <button 
                            class="admin-delete-btn"
                            onclick="deleteProduct('${product.id}')"
                        >
                            O‘chirish
                        </button>

                    </div>

                </div>
            </div>
        `;
    }).join("");
}

function getCategoryName(category) {
    const categories = {
        clothes: "Kiyimlar",
        makeup: "Make Up",
        accessories: "Aksessuarlar"
    };

    return categories[category] || category || "Boshqa";
}

// ===============================
// PRODUCT MODAL
// ===============================

const productModal = document.getElementById("productModal");
const addProductBtn = document.getElementById("addProductBtn");
const closeProductModal = document.getElementById("closeProductModal");
const productForm = document.getElementById("productForm");

function openProductModal() {
    productModal?.classList.add("show");
}

function closeProductForm() {
    productModal?.classList.remove("show");
}

addProductBtn?.addEventListener("click", () => {
    productForm?.reset();

    const productId = document.getElementById("productId");
    if (productId) productId.value = "";

    openProductModal();
});

closeProductModal?.addEventListener("click", closeProductForm);

productModal?.addEventListener("click", (e) => {
    if (e.target === productModal) {
        closeProductForm();
    }
});

// ===============================
// ADD / EDIT PRODUCT
// ===============================

productForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    const products = getProducts();

    const id =
        document.getElementById("productId")?.value ||
        "p-" + Date.now();

    const product = {
        id,
        name: document.getElementById("productName")?.value.trim(),
        category: document.getElementById("productCategory")?.value,
        price: Number
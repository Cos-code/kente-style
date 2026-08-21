// =========================================
// KENTESTYLE
// COMPLETE PRODUCT + CART + ADMIN SYSTEM
// SUPABASE VERSION
// =========================================


// =========================================
// SUPABASE
// =========================================

const SUPABASE_URL =
    "https://ncfgkefcxfrvzceuwroe.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_Ju29d9xQXQedFqJxcgzLpQ_oKYRaL2x";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// =========================================
// CART DATA
// =========================================

let cart =
    JSON.parse(
        localStorage.getItem("kenteCart")
    ) || [];


// =========================================
// PRODUCTS
// =========================================

let adminProducts = [];


// =========================================
// HTML ELEMENTS
// =========================================

const cartButton =
    document.getElementById("cart-button");

const cartPanel =
    document.getElementById("cart-panel");

const closeCartButton =
    document.getElementById("close-cart");

const cartOverlay =
    document.getElementById("cart-overlay");

const cartItems =
    document.getElementById("cart-items");

const cartCount =
    document.getElementById("cart-count");

const cartTotal =
    document.getElementById("cart-total");

const cartNotification =
    document.getElementById("cart-notification");


// =========================================
// PRODUCT ELEMENTS
// =========================================

const productGrid =
    document.querySelector(".product-grid");

const categoryButtons =
    document.querySelectorAll(
        ".category-button"
    );

const productSearchInput =
    document.getElementById(
        "product-search-input"
    );

const clearProductSearch =
    document.getElementById(
        "clear-product-search"
    );

const searchResultsText =
    document.getElementById(
        "search-results-text"
    );

let currentCategory = "all";


// =========================================
// PRODUCT IMAGES
// =========================================

const productImages = {};


// =========================================
// PRODUCT MODAL
// =========================================

const productModal =
    document.getElementById(
        "product-modal"
    );

const closeProductModal =
    document.getElementById(
        "close-product-modal"
    );

const modalProductImage =
    document.getElementById(
        "modal-product-image"
    );

const modalProductName =
    document.getElementById(
        "modal-product-name"
    );

const modalProductPrice =
    document.getElementById(
        "modal-product-price"
    );

const modalProductDescription =
    document.getElementById(
        "modal-product-description"
    );

const modalMinus =
    document.getElementById(
        "modal-minus"
    );

const modalPlus =
    document.getElementById(
        "modal-plus"
    );

const modalQuantity =
    document.getElementById(
        "modal-quantity"
    );

const modalAddToCart =
    document.getElementById(
        "modal-add-to-cart"
    );


let selectedProduct = null;

let selectedQuantity = 1;


// =========================================
// ADMIN ELEMENTS
// =========================================

const adminButton =
    document.getElementById(
        "admin-button"
    );

const adminModal =
    document.getElementById(
        "admin-modal"
    );

const adminClose =
    document.getElementById(
        "admin-close"
    );

const adminLogin =
    document.getElementById(
        "admin-login"
    );

const adminDashboard =
    document.getElementById(
        "admin-dashboard"
    );

const adminPassword =
    document.getElementById(
        "admin-password"
    );

const adminLoginButton =
    document.getElementById(
        "admin-login-button"
    );

const adminLoginError =
    document.getElementById(
        "admin-login-error"
    );

const adminProductList =
    document.getElementById(
        "admin-product-list"
    );

const adminAddProduct =
    document.getElementById(
        "admin-add-product"
    );

const adminProductForm =
    document.getElementById(
        "admin-product-form"
    );

const adminFormTitle =
    document.getElementById(
        "admin-form-title"
    );

const adminFormBack =
    document.getElementById(
        "admin-form-back"
    );

const adminSaveProduct =
    document.getElementById(
        "admin-save-product"
    );

const adminProductName =
    document.getElementById(
        "admin-product-name"
    );

const adminProductPrice =
    document.getElementById(
        "admin-product-price"
    );

const adminProductCategory =
    document.getElementById(
        "admin-product-category"
    );

const adminProductImage =
    document.getElementById(
        "admin-product-image"
    );

const adminProductDescription =
    document.getElementById(
        "admin-product-description"
    );


const ADMIN_PASSWORD =
    "KenteStyleAdmin";


let editingProductId = null;


// =========================================
// CHECKOUT ELEMENTS
// =========================================

const checkoutButton =
    document.querySelector(
        ".checkout-button"
    );

const checkoutModal =
    document.getElementById(
        "checkout-modal"
    );

const checkoutClose =
    document.getElementById(
        "checkout-close"
    );

const checkoutItems =
    document.getElementById(
        "checkout-items"
    );

const checkoutTotal =
    document.getElementById(
        "checkout-total"
    );

const checkoutForm =
    document.getElementById(
        "checkout-form"
    );


// =========================================
// SUCCESS
// =========================================

const orderSuccess =
    document.getElementById(
        "order-success"
    );

const successClose =
    document.getElementById(
        "success-close"
    );


// =========================================
// MOBILE MONEY
// =========================================

const momoModal =
    document.getElementById(
        "momo-modal"
    );

const momoClose =
    document.getElementById(
        "momo-close"
    );

const momoForm =
    document.getElementById(
        "momo-form"
    );

const momoTotal =
    document.getElementById(
        "momo-total"
    );


// =========================================
// MOBILE MENU
// =========================================

const mobileMenuButton =
    document.getElementById(
        "mobile-menu-button"
    );

const mobileMenu =
    document.getElementById(
        "mobile-menu"
    );

const mobileMenuClose =
    document.getElementById(
        "mobile-menu-close"
    );

const mobileMenuLinks =
    document.querySelectorAll(
        ".mobile-nav a"
    );


// =========================================
// LOAD PRODUCTS FROM SUPABASE
// =========================================

async function loadProductsFromSupabase() {

    try {

        console.log(
            "Loading products from Supabase..."
        );


        const {
            data,
            error
        } = await supabaseClient
            .from("products")
            .select("*")
            .order(
                "id",
                {
                    ascending: true
                }
            );


        if (error) {

            console.error(
                "Supabase product loading error:",
                error
            );

            adminProducts = [];

            renderStoreProducts();

            return;

        }


        adminProducts =
            Array.isArray(data)
                ? data
                : [];


        console.log(
            "Products loaded:",
            adminProducts
        );


        rebuildProductImages();


        renderStoreProducts();


        renderAdminProducts();


        updateCart();


    } catch (error) {

        console.error(
            "Unexpected product loading error:",
            error
        );

        adminProducts = [];

        renderStoreProducts();

    }

}


// =========================================
// REBUILD PRODUCT IMAGE MAP
// =========================================

function rebuildProductImages() {

    Object.keys(productImages)
        .forEach(function (key) {

            delete productImages[key];

        });


    adminProducts.forEach(
        function (product) {

            productImages[
                product.name
            ] = product.image || "";

        }
    );

}


// =========================================
// SAVE PRODUCT TO SUPABASE
// =========================================

async function saveProductToSupabase(
    product
) {

    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("Products")
            .insert([
                {
                    name:
                        product.name,

                    price:
                        product.price,

                    category:
                        product.category,

                    image:
                        product.image,

                    description:
                        product.description || ""
                }
            ])
            .select()
            .single();


        if (error) {

            console.error(
                "Supabase insert error:",
                error
            );

            alert(
                "Could not save the product to Supabase.\n\n" +
                error.message
            );

            return null;

        }


        return data;


    } catch (error) {

        console.error(
            "Product insert failed:",
            error
        );

        alert(
            "Something went wrong while saving the product."
        );

        return null;

    }

}


// =========================================
// UPDATE PRODUCT IN SUPABASE
// =========================================

async function updateProductInSupabase(
    id,
    product
) {

    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("Products")
            .update({
                name:
                    product.name,

                price:
                    product.price,

                category:
                    product.category,

                image:
                    product.image,

                description:
                    product.description || ""
            })
            .eq(
                "id",
                id
            )
            .select()
            .single();


        if (error) {

            console.error(
                "Supabase update error:",
                error
            );

            alert(
                "Could not update the product.\n\n" +
                error.message
            );

            return null;

        }


        return data;


    } catch (error) {

        console.error(
            "Product update failed:",
            error
        );

        alert(
            "Something went wrong while updating the product."
        );

        return null;

    }

}


// =========================================
// DELETE PRODUCT FROM SUPABASE
// =========================================

async function deleteProductFromSupabase(
    id
) {

    try {

        const {
            error
        } = await supabaseClient
            .from("Products")
            .delete()
            .eq(
                "id",
                id
            );


        if (error) {

            console.error(
                "Supabase delete error:",
                error
            );

            alert(
                "Could not delete the product.\n\n" +
                error.message
            );

            return false;

        }


        return true;


    } catch (error) {

        console.error(
            "Product delete failed:",
            error
        );

        alert(
            "Something went wrong while deleting the product."
        );

        return false;

    }

}


// =========================================
// RENDER STORE PRODUCTS
// =========================================

function renderStoreProducts() {

    if (!productGrid) {

        console.warn(
            "Product grid was not found."
        );

        return;

    }


    productGrid.innerHTML = "";


    if (
        !Array.isArray(adminProducts) ||
        adminProducts.length === 0
    ) {

        productGrid.innerHTML = `

            <div class="no-products">

                <strong>
                    No products available
                </strong>

                <span>
                    Please check back soon.
                </span>

            </div>

        `;

        return;

    }


    adminProducts.forEach(
        function (product) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "product-card";


            card.dataset.category =
                product.category || "";


            card.dataset.productId =
                product.id;


            card.innerHTML = `

                <div class="product-image-container">

                    <img
                        src="${escapeAttribute(product.image || "")}"
                        alt="${escapeAttribute(product.name || "Product")}"
                        loading="lazy"
                        onerror="this.style.display='none';"
                    >

                </div>

                <div class="product-info">

                    <h3>
                        ${escapeHTML(product.name || "Unnamed Product")}
                    </h3>

                    <p class="product-price">
                        GH₵${Number(product.price || 0).toFixed(2)}
                    </p>

                    <button
                        class="add-to-cart"
                        data-id="${product.id}"
                        type="button">

                        Add to Cart

                    </button>

                </div>

            `;


            productGrid.appendChild(card);


            productImages[
                product.name
            ] = product.image || "";

        }
    );


    attachProductEvents();

    filterProducts();

}


// =========================================
// ESCAPE HTML
// =========================================

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


// =========================================
// ESCAPE ATTRIBUTE
// =========================================

function escapeAttribute(value) {

    return escapeHTML(value);

}


// =========================================
// ATTACH PRODUCT EVENTS
// =========================================

function attachProductEvents() {

    const productCards =
        document.querySelectorAll(
            ".product-card"
        );


    const addToCartButtons =
        document.querySelectorAll(
            ".add-to-cart"
        );


    // =====================================
    // ADD TO CART BUTTONS
    // =====================================

    addToCartButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    event.stopPropagation();


                    const productId =
                        Number(
                            button.dataset.id
                        );


                    const product =
                        adminProducts.find(
                            function (item) {

                                return Number(
                                    item.id
                                ) === productId;

                            }
                        );


                    if (!product) {

                        console.error(
                            "Product not found:",
                            productId
                        );

                        return;

                    }


                    addProductToCart(
                        product.name,
                        product.price,
                        1
                    );

                }
            );

        }
    );


    // =====================================
    // PRODUCT CARDS
    // =====================================

    productCards.forEach(
        function (card) {

            card.addEventListener(
                "click",
                function () {

                    const productId =
                        Number(
                            card.dataset.productId
                        );


                    openProductModal(
                        productId
                    );

                }
            );

        }
    );

}


// =========================================
// OPEN PRODUCT MODAL
// =========================================

function openProductModal(
    productId
) {

    const product =
        adminProducts.find(
            function (item) {

                return Number(
                    item.id
                ) === Number(productId);

            }
        );


    if (!product) {

        console.error(
            "Could not find product:",
            productId
        );

        return;

    }


    selectedProduct =
        product;


    selectedQuantity =
        1;


    if (modalQuantity) {

        modalQuantity.textContent =
            selectedQuantity;

    }


    if (modalProductImage) {

        modalProductImage.src =
            product.image || "";

        modalProductImage.alt =
            product.name || "Product";

    }


    if (modalProductName) {

        modalProductName.textContent =
            product.name || "";

    }


    if (modalProductPrice) {

        modalProductPrice.textContent =
            `GH₵${Number(
                product.price || 0
            ).toFixed(2)}`;

    }


    if (modalProductDescription) {

        modalProductDescription.textContent =
            product.description ||
            "A beautiful African fashion piece from the KenteStyle collection.";

    }


    if (productModal) {

        productModal.classList.add(
            "show"
        );

    }

}


// =========================================
// CLOSE PRODUCT MODAL
// =========================================

if (closeProductModal) {

    closeProductModal.addEventListener(
        "click",
        function () {

            if (productModal) {

                productModal.classList.remove(
                    "show"
                );

            }

        }
    );

}


if (productModal) {

    productModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                productModal
            ) {

                productModal.classList.remove(
                    "show"
                );

            }

        }
    );

}


// =========================================
// MODAL MINUS
// =========================================

if (modalMinus) {

    modalMinus.addEventListener(
        "click",
        function () {

            if (
                selectedQuantity > 1
            ) {

                selectedQuantity--;

                if (modalQuantity) {

                    modalQuantity.textContent =
                        selectedQuantity;

                }

            }

        }
    );

}


// =========================================
// MODAL PLUS
// =========================================

if (modalPlus) {

    modalPlus.addEventListener(
        "click",
        function () {

            selectedQuantity++;


            if (modalQuantity) {

                modalQuantity.textContent =
                    selectedQuantity;

            }

        }
    );

}


// =========================================
// MODAL ADD TO CART
// =========================================

if (modalAddToCart) {

    modalAddToCart.addEventListener(
        "click",
        function () {

            if (!selectedProduct) {

                return;

            }


            addProductToCart(
                selectedProduct.name,
                selectedProduct.price,
                selectedQuantity
            );


            if (productModal) {

                productModal.classList.remove(
                    "show"
                );

            }

        }
    );

}


// =========================================
// OPEN CART
// =========================================

function openCart() {

    if (cartPanel) {

        cartPanel.classList.add(
            "open"
        );

    }


    if (cartOverlay) {

        cartOverlay.classList.add(
            "show"
        );

    }

}


if (cartButton) {

    cartButton.addEventListener(
        "click",
        openCart
    );

}


if (closeCartButton) {

    closeCartButton.addEventListener(
        "click",
        closeCart
    );

}


if (cartOverlay) {

    cartOverlay.addEventListener(
        "click",
        closeCart
    );

}


// =========================================
// CLOSE CART
// =========================================

function closeCart() {

    if (cartPanel) {

        cartPanel.classList.remove(
            "open"
        );

    }


    if (cartOverlay) {

        cartOverlay.classList.remove(
            "show"
        );

    }

}


// =========================================
// CART NOTIFICATION
// =========================================

function showCartNotification() {

    if (!cartNotification) {

        return;

    }


    cartNotification.classList.remove(
        "show"
    );


    setTimeout(
        function () {

            cartNotification.classList.add(
                "show"
            );

        },
        10
    );


    setTimeout(
        function () {

            cartNotification.classList.remove(
                "show"
            );

        },
        2500
    );

}


// =========================================
// ADD PRODUCT TO CART
// =========================================

function addProductToCart(
    productName,
    productPrice,
    quantity = 1
) {

    const price =
        Number(productPrice);

    const amount =
        Number(quantity);


    if (
        !productName ||
        !Number.isFinite(price) ||
        price <= 0 ||
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        console.error(
            "Invalid cart product:",
            productName,
            productPrice,
            quantity
        );

        return;

    }


    const existingProduct =
        cart.find(
            function (product) {

                return (
                    product.name ===
                    productName
                );

            }
        );


    if (existingProduct) {

        existingProduct.quantity +=
            amount;

    } else {

        cart.push({

            name:
                productName,

            price:
                price,

            quantity:
                amount

        });

    }


    updateCart();

    showCartNotification();

}


// =========================================
// UPDATE CART
// =========================================

function updateCart() {

    localStorage.setItem(
        "kenteCart",
        JSON.stringify(cart)
    );


    if (!cartItems) {

        return;

    }


    cartItems.innerHTML = "";


    let totalQuantity = 0;

    let totalPrice = 0;


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <p>
                    Your cart is empty.
                </p>

            </div>

        `;


        if (cartCount) {

            cartCount.textContent =
                "0";

        }


        if (cartTotal) {

            cartTotal.textContent =
                "GH₵0.00";

        }


        return;

    }


    cart.forEach(
        function (product) {

            product.price =
                Number(product.price);

            product.quantity =
                Number(product.quantity);


            totalQuantity +=
                product.quantity;


            totalPrice +=
                product.price *
                product.quantity;


            const cartItem =
                document.createElement(
                    "div"
                );


            cartItem.classList.add(
                "cart-item"
            );


            const image =
                getProductImage(
                    product.name
                );


            cartItem.innerHTML = `

                <div class="cart-item-image">

                    <img
                        src="${escapeAttribute(image)}"
                        alt="${escapeAttribute(product.name)}"
                    >

                </div>

                <div class="cart-item-info">

                    <h3>
                        ${escapeHTML(product.name)}
                    </h3>

                    <p>
                        GH₵${product.price.toFixed(2)}
                    </p>

                    <div class="quantity-controls">

                        <button
                            class="quantity-minus"
                            type="button">

                            −

                        </button>

                        <span>
                            ${product.quantity}
                        </span>

                        <button
                            class="quantity-plus"
                            type="button">

                            +

                        </button>

                    </div>

                    <button
                        class="remove-item"
                        type="button">

                        Remove

                    </button>

                </div>

            `;


            cartItems.appendChild(
                cartItem
            );


            const minusButton =
                cartItem.querySelector(
                    ".quantity-minus"
                );


            const plusButton =
                cartItem.querySelector(
                    ".quantity-plus"
                );


            const removeButton =
                cartItem.querySelector(
                    ".remove-item"
                );


            minusButton.addEventListener(
                "click",
                function () {

                    product.quantity--;


                    if (
                        product.quantity <= 0
                    ) {

                        cart =
                            cart.filter(
                                function (item) {

                                    return (
                                        item.name !==
                                        product.name
                                    );

                                }
                            );

                    }


                    updateCart();

                }
            );


            plusButton.addEventListener(
                "click",
                function () {

                    product.quantity++;

                    updateCart();

                }
            );


            removeButton.addEventListener(
                "click",
                function () {

                    cart =
                        cart.filter(
                            function (item) {

                                return (
                                    item.name !==
                                    product.name
                                );

                            }
                        );


                    updateCart();

                }
            );

        }
    );


    if (cartCount) {

        cartCount.textContent =
            totalQuantity;

    }


    if (cartTotal) {

        cartTotal.textContent =
            `GH₵${totalPrice.toFixed(2)}`;

    }

}


// =========================================
// GET PRODUCT IMAGE
// =========================================

function getProductImage(
    name
) {

    const product =
        adminProducts.find(
            function (item) {

                return (
                    item.name === name
                );

            }
        );


    if (product) {

        return product.image || "";

    }


    return (
        productImages[name] || ""
    );

}


// =========================================
// SEARCH + CATEGORY FILTER
// =========================================

function filterProducts() {

    if (!productGrid) {

        return;

    }


    const searchTerm =
        productSearchInput
            ? productSearchInput.value
                .trim()
                .toLowerCase()
            : "";


    const productCards =
        productGrid.querySelectorAll(
            ".product-card"
        );


    let visibleProducts = 0;


    productCards.forEach(
        function (product) {

            const heading =
                product.querySelector(
                    "h3"
                );


            const name =
                heading
                    ? heading.textContent
                        .trim()
                        .toLowerCase()
                    : "";


            const category =
                (
                    product.dataset.category ||
                    ""
                ).toLowerCase();


            const matchesSearch =
                name.includes(
                    searchTerm
                );


            const matchesCategory =
                currentCategory === "all" ||
                category ===
                    currentCategory;


            if (
                matchesSearch &&
                matchesCategory
            ) {

                product.style.display =
                    "";

                visibleProducts++;

            } else {

                product.style.display =
                    "none";

            }

        }
    );


    if (clearProductSearch) {

        if (searchTerm) {

            clearProductSearch.classList.add(
                "show"
            );

        } else {

            clearProductSearch.classList.remove(
                "show"
            );

        }

    }


    if (searchResultsText) {

        if (searchTerm) {

            searchResultsText.textContent =
                visibleProducts === 0
                    ? `No products found for "${productSearchInput.value.trim()}".`
                    : `${visibleProducts} product${
                        visibleProducts === 1
                            ? ""
                            : "s"
                    } found`;

        } else {

            searchResultsText.textContent =
                "";

        }

    }


    const oldMessage =
        productGrid.querySelector(
            ".no-search-results"
        );


    if (oldMessage) {

        oldMessage.remove();

    }


    if (
        visibleProducts === 0 &&
        productCards.length > 0
    ) {

        const message =
            document.createElement(
                "div"
            );


        message.className =
            "no-search-results";


        message.innerHTML = `

            <strong>
                No products found
            </strong>

            <span>
                Try another product name or category.
            </span>

        `;


        productGrid.appendChild(
            message
        );

    }

}


// =========================================
// SEARCH INPUT
// =========================================

if (productSearchInput) {

    productSearchInput.addEventListener(
        "input",
        filterProducts
    );

}


if (clearProductSearch) {

    clearProductSearch.addEventListener(
        "click",
        function () {

            if (productSearchInput) {

                productSearchInput.value =
                    "";

                filterProducts();

                productSearchInput.focus();

            }

        }
    );

}


// =========================================
// CATEGORY BUTTONS
// =========================================

categoryButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                categoryButtons.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                currentCategory =
                    button.dataset.category ||
                    "all";


                filterProducts();

            }
        );

    }
);


// =========================================
// CALCULATE CART TOTAL
// =========================================

function calculateCartTotal() {

    return cart.reduce(
        function (
            total,
            product
        ) {

            return (
                total +
                Number(product.price) *
                Number(product.quantity)
            );

        },
        0
    );

}


// =========================================
// CHECKOUT SUMMARY
// =========================================

function displayCheckoutSummary() {

    if (!checkoutItems) {

        return;

    }


    checkoutItems.innerHTML = "";


    let total = 0;


    cart.forEach(
        function (product) {

            const quantity =
                Number(
                    product.quantity
                );


            const price =
                Number(
                    product.price
                );


            const itemTotal =
                price * quantity;


            total +=
                itemTotal;


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "checkout-item";


            item.innerHTML = `

                <span class="checkout-item-name">
                    ${escapeHTML(product.name)} × ${quantity}
                </span>

                <span class="checkout-item-price">
                    GH₵${itemTotal.toFixed(2)}
                </span>

            `;


            checkoutItems.appendChild(
                item
            );

        }
    );


    if (checkoutTotal) {

        checkoutTotal.textContent =
            `GH₵${total.toFixed(2)}`;

    }

}


// =========================================
// CHECKOUT OPEN
// =========================================

if (checkoutButton) {

    checkoutButton.addEventListener(
        "click",
        function () {

            if (cart.length === 0) {

                alert(
                    "Your cart is empty. Please add a product first."
                );

                return;

            }


            displayCheckoutSummary();


            if (checkoutModal) {

                checkoutModal.classList.add(
                    "show"
                );

            }


            closeCart();

        }
    );

}


// =========================================
// CHECKOUT CLOSE
// =========================================

if (checkoutClose) {

    checkoutClose.addEventListener(
        "click",
        function () {

            if (checkoutModal) {

                checkoutModal.classList.remove(
                    "show"
                );

            }

        }
    );

}


if (checkoutModal) {

    checkoutModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                checkoutModal
            ) {

                checkoutModal.classList.remove(
                    "show"
                );

            }

        }
    );

}


// =========================================
// WHATSAPP ORDER
// =========================================

function sendOrderToWhatsApp(
    customerName,
    customerPhone,
    customerRegion,
    deliveryLocation,
    paymentMethod,
    extraPaymentInfo = ""
) {

    const orderTotal =
        calculateCartTotal();


    let orderMessage =
        "🛍️ *NEW KENTESTYLE ORDER*";


    orderMessage +=
        "\n\n*CUSTOMER DETAILS*";


    orderMessage +=
        `\nName: ${customerName}`;


    orderMessage +=
        `\nPhone: ${customerPhone}`;


    orderMessage +=
        `\nRegion: ${customerRegion}`;


    orderMessage +=
        `\nDelivery Location: ${deliveryLocation}`;


    orderMessage +=
        `\nPayment Method: ${paymentMethod}`;


    if (extraPaymentInfo) {

        orderMessage +=
            `\n${extraPaymentInfo}`;

    }


    orderMessage +=
        "\n\n*ORDER ITEMS*";


    cart.forEach(
        function (product) {

            const itemTotal =
                Number(product.price) *
                Number(product.quantity);


            orderMessage +=
                `\n${product.name} × ${product.quantity} - GH₵${itemTotal.toFixed(2)}`;

        }
    );


    orderMessage +=
        `\n\n*TOTAL: GH₵${orderTotal.toFixed(2)}*`;


    const whatsappNumber =
        "233555535235";


    const whatsappURL =
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
            orderMessage
        )}`;


    window.open(
        whatsappURL,
        "_blank"
    );

}


// =========================================
// CHECKOUT FORM
// =========================================

if (checkoutForm) {

    checkoutForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const customerName =
                document.getElementById(
                    "customer-name"
                ).value.trim();


            const customerPhone =
                document.getElementById(
                    "customer-phone"
                ).value.trim();


            const customerRegion =
                document.getElementById(
                    "customer-region"
                ).value;


            const deliveryLocation =
                document.getElementById(
                    "delivery-location"
                ).value.trim();


            const paymentMethod =
                document.getElementById(
                    "payment-method"
                ).value;


            if (
                !customerName ||
                !customerPhone ||
                !customerRegion ||
                !deliveryLocation ||
                !paymentMethod
            ) {

                alert(
                    "Please complete all delivery information."
                );

                return;

            }


            if (cart.length === 0) {

                alert(
                    "Your cart is empty."
                );

                if (checkoutModal) {

                    checkoutModal.classList.remove(
                        "show"
                    );

                }

                return;

            }


            if (
                paymentMethod ===
                "Mobile Money"
            ) {

                if (momoTotal) {

                    momoTotal.textContent =
                        `GH₵${calculateCartTotal().toFixed(2)}`;

                }


                sessionStorage.setItem(
                    "kenteCheckoutCustomer",
                    JSON.stringify({

                        name:
                            customerName,

                        phone:
                            customerPhone,

                        region:
                            customerRegion,

                        deliveryLocation:
                            deliveryLocation,

                        paymentMethod:
                            paymentMethod

                    })
                );


                if (momoModal) {

                    momoModal.classList.add(
                        "show"
                    );

                }


                if (checkoutModal) {

                    checkoutModal.classList.remove(
                        "show"
                    );

                }


                return;

            }


            if (
                paymentMethod ===
                "Cash on Delivery"
            ) {

                sendOrderToWhatsApp(
                    customerName,
                    customerPhone,
                    customerRegion,
                    deliveryLocation,
                    "Cash on Delivery"
                );


                cart = [];


                localStorage.removeItem(
                    "kenteCart"
                );


                updateCart();


                if (checkoutModal) {

                    checkoutModal.classList.remove(
                        "show"
                    );

                }


                checkoutForm.reset();


                if (orderSuccess) {

                    orderSuccess.classList.add(
                        "show"
                    );

                }

            }

        }
    );

}


// =========================================
// MOMO CLOSE
// =========================================

if (momoClose) {

    momoClose.addEventListener(
        "click",
        function () {

            if (momoModal) {

                momoModal.classList.remove(
                    "show"
                );

            }

        }
    );

}


if (momoModal) {

    momoModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                momoModal
            ) {

                momoModal.classList.remove(
                    "show"
                );

            }

        }
    );

}


// =========================================
// MOMO FORM
// =========================================

if (momoForm) {

    momoForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const momoNetwork =
                document.getElementById(
                    "momo-network"
                ).value;


            const momoPhone =
                document.getElementById(
                    "momo-phone"
                ).value.trim();


            if (
                !momoNetwork ||
                !momoPhone
            ) {

                alert(
                    "Please select your Mobile Money network and enter your phone number."
                );

                return;

            }


            const savedCustomer =
                sessionStorage.getItem(
                    "kenteCheckoutCustomer"
                );


            if (!savedCustomer) {

                alert(
                    "Your checkout session has expired. Please start checkout again."
                );


                if (momoModal) {

                    momoModal.classList.remove(
                        "show"
                    );

                }


                return;

            }


            const customer =
                JSON.parse(
                    savedCustomer
                );


            sendOrderToWhatsApp(

                customer.name,

                customer.phone,

                customer.region,

                customer.deliveryLocation,

                "Mobile Money",

                `MoMo Network: ${momoNetwork}\nMoMo Number: ${momoPhone}\nPayment Status: Awaiting Payment`

            );


            cart = [];


            localStorage.removeItem(
                "kenteCart"
            );


            sessionStorage.removeItem(
                "kenteCheckoutCustomer"
            );


            updateCart();


            momoForm.reset();


            if (checkoutForm) {

                checkoutForm.reset();

            }


            if (momoModal) {

                momoModal.classList.remove(
                    "show"
                );

            }


            if (orderSuccess) {

                orderSuccess.classList.add(
                    "show"
                );

            }

        }
    );

}


// =========================================
// SUCCESS CLOSE
// =========================================

if (successClose) {

    successClose.addEventListener(
        "click",
        function () {

            if (orderSuccess) {

                orderSuccess.classList.remove(
                    "show"
                );

            }

        }
    );

}


// =========================================
// ADMIN OPEN
// =========================================

if (adminButton) {

    adminButton.addEventListener(
        "click",
        function () {

            if (adminModal) {

                adminModal.classList.add(
                    "show"
                );

            }


            if (adminLogin) {

                adminLogin.style.display =
                    "block";

            }


            if (adminDashboard) {

                adminDashboard.classList.remove(
                    "show"
                );

            }


            if (adminProductForm) {

                adminProductForm.classList.remove(
                    "show"
                );

            }


            if (adminPassword) {

                adminPassword.value =
                    "";

            }


            if (adminLoginError) {

                adminLoginError.textContent =
                    "";

            }

        }
    );

}


// =========================================
// ADMIN CLOSE
// =========================================

if (adminClose) {

    adminClose.addEventListener(
        "click",
        function () {

            if (adminModal) {

                adminModal.classList.remove(
                    "show"
                );

            }

        }
    );

}


if (adminModal) {

    adminModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                adminModal
            ) {

                adminModal.classList.remove(
                    "show"
                );

            }

        }
    );

}


// =========================================
// ADMIN LOGIN
// =========================================

if (adminLoginButton) {

    adminLoginButton.addEventListener(
        "click",
        function () {

            if (
                adminPassword &&
                adminPassword.value ===
                ADMIN_PASSWORD
            ) {

                if (adminLogin) {

                    adminLogin.style.display =
                        "none";

                }


                if (adminDashboard) {

                    adminDashboard.classList.add(
                        "show"
                    );

                }


                if (adminProductForm) {

                    adminProductForm.classList.remove(
                        "show"
                    );

                }


                renderAdminProducts();


            } else {

                if (adminLoginError) {

                    adminLoginError.textContent =
                        "Incorrect admin password.";

                }

            }

        }
    );

}


if (adminPassword) {

    adminPassword.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key ===
                "Enter"
            ) {

                if (adminLoginButton) {

                    adminLoginButton.click();

                }

            }

        }
    );

}


// =========================================
// ADMIN PRODUCT LIST
// =========================================

function renderAdminProducts() {

    if (!adminProductList) {

        return;

    }


    adminProductList.innerHTML =
        "";


    if (
        !Array.isArray(adminProducts) ||
        adminProducts.length === 0
    ) {

        adminProductList.innerHTML = `

            <div class="empty-cart">

                <p>
                    No products available.
                </p>

            </div>

        `;

        return;

    }


    adminProducts.forEach(
        function (product) {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "admin-product-row";


            row.innerHTML = `

                <div class="admin-product-row-image">

                    <img
                        src="${escapeAttribute(product.image || "")}"
                        alt="${escapeAttribute(product.name || "Product")}"
                    >

                </div>

                <div class="admin-product-row-info">

                    <h4>
                        ${escapeHTML(product.name || "")}
                    </h4>

                    <p>
                        ${escapeHTML(product.category || "")}
                    </p>

                    <p class="admin-product-row-price">
                        GH₵${Number(product.price || 0).toFixed(2)}
                    </p>

                </div>

                <div class="admin-product-actions">

                    <button
                        type="button"
                        class="admin-edit-button"
                        data-id="${product.id}">

                        Edit

                    </button>

                    <button
                        type="button"
                        class="admin-delete-button"
                        data-id="${product.id}">

                        Delete

                    </button>

                </div>

            `;


            adminProductList.appendChild(
                row
            );

        }
    );


    document
        .querySelectorAll(
            ".admin-edit-button"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        editAdminProduct(
                            Number(
                                button.dataset.id
                            )
                        );

                    }
                );

            }
        );


    document
        .querySelectorAll(
            ".admin-delete-button"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        deleteAdminProduct(
                            Number(
                                button.dataset.id
                            )
                        );

                    }
                );

            }
        );

}


// =========================================
// ADD PRODUCT FORM
// =========================================

if (adminAddProduct) {

    adminAddProduct.addEventListener(
        "click",
        function () {

            editingProductId =
                null;


            if (adminFormTitle) {

                adminFormTitle.textContent =
                    "Add Product";

            }


            if (adminProductName) {

                adminProductName.value =
                    "";

            }


            if (adminProductPrice) {

                adminProductPrice.value =
                    "";

            }


            if (adminProductCategory) {

                adminProductCategory.value =
                    "men";

            }


            if (adminProductImage) {

                adminProductImage.value =
                    "";

            }


            if (adminProductDescription) {

                adminProductDescription.value =
                    "";

            }


            if (adminDashboard) {

                adminDashboard.classList.remove(
                    "show"
                );

            }


            if (adminProductForm) {

                adminProductForm.classList.add(
                    "show"
                );

            }

        }
    );

}


// =========================================
// EDIT PRODUCT
// =========================================

function editAdminProduct(
    id
) {

    const product =
        adminProducts.find(
            function (item) {

                return Number(
                    item.id
                ) === Number(id);

            }
        );


    if (!product) {

        return;

    }


    editingProductId =
        Number(product.id);


    if (adminFormTitle) {

        adminFormTitle.textContent =
            "Edit Product";

    }


    if (adminProductName) {

        adminProductName.value =
            product.name || "";

    }


    if (adminProductPrice) {

        adminProductPrice.value =
            product.price || "";

    }


    if (adminProductCategory) {

        adminProductCategory.value =
            product.category || "men";

    }


    if (adminProductImage) {

        adminProductImage.value =
            product.image || "";

    }


    if (adminProductDescription) {

        adminProductDescription.value =
            product.description || "";

    }


    if (adminDashboard) {

        adminDashboard.classList.remove(
            "show"
        );

    }


    if (adminProductForm) {

        adminProductForm.classList.add(
            "show"
        );

    }

}


// =========================================
// SAVE PRODUCT
// =========================================

if (adminSaveProduct) {

    adminSaveProduct.addEventListener(
        "click",
        async function () {

            const name =
                adminProductName
                    ? adminProductName.value.trim()
                    : "";


            const price =
                adminProductPrice
                    ? Number(
                        adminProductPrice.value
                    )
                    : 0;


            const category =
                adminProductCategory
                    ? adminProductCategory.value
                    : "";


            const image =
                adminProductImage
                    ? adminProductImage.value.trim()
                    : "";


            const description =
                adminProductDescription
                    ? adminProductDescription.value.trim()
                    : "";


            if (!name) {

                alert(
                    "Please enter a product name."
                );

                return;

            }


            if (
                !Number.isFinite(price) ||
                price <= 0
            ) {

                alert(
                    "Please enter a valid product price."
                );

                return;

            }


            if (!category) {

                alert(
                    "Please select a product category."
                );

                return;

            }


            if (!image) {

                alert(
                    "Please enter the product image URL."
                );

                return;

            }


            const productData = {

                name:
                    name,

                price:
                    price,

                category:
                    category,

                image:
                    image,

                description:
                    description

            };


            // =================================
            // EDIT EXISTING PRODUCT
            // =================================

            if (
                editingProductId !==
                null
            ) {

                adminSaveProduct.disabled =
                    true;


                adminSaveProduct.textContent =
                    "Saving...";


                const updatedProduct =
                    await updateProductInSupabase(
                        editingProductId,
                        productData
                    );


                adminSaveProduct.disabled =
                    false;


                adminSaveProduct.textContent =
                    "Save Product";


                if (!updatedProduct) {

                    return;

                }


                const index =
                    adminProducts.findIndex(
                        function (item) {

                            return Number(
                                item.id
                            ) ===
                            Number(
                                editingProductId
                            );

                        }
                    );


                if (index !== -1) {

                    adminProducts[index] =
                        updatedProduct;

                }


                editingProductId =
                    null;


                rebuildProductImages();


                renderAdminProducts();

                renderStoreProducts();


                if (adminProductForm) {

                    adminProductForm.classList.remove(
                        "show"
                    );

                }


                if (adminDashboard) {

                    adminDashboard.classList.add(
                        "show"
                    );

                }


                alert(
                    "Product updated successfully."
                );


                return;

            }


            // =================================
            // ADD NEW PRODUCT
            // =================================

            adminSaveProduct.disabled =
                true;


            adminSaveProduct.textContent =
                "Saving...";


            const newProduct =
                await saveProductToSupabase(
                    productData
                );


            adminSaveProduct.disabled =
                false;


            adminSaveProduct.textContent =
                "Save Product";


            if (!newProduct) {

                return;

            }


            adminProducts.push(
                newProduct
            );


            rebuildProductImages();


            renderAdminProducts();

            renderStoreProducts();


            if (adminProductForm) {

                adminProductForm.classList.remove(
                    "show"
                );

            }


            if (adminDashboard) {

                adminDashboard.classList.add(
                    "show"
                );

            }


            alert(
                "Product added successfully."
            );

        }
    );

}


// =========================================
// BACK TO ADMIN PRODUCTS
// =========================================

if (adminFormBack) {

    adminFormBack.addEventListener(
        "click",
        function () {

            editingProductId =
                null;


            if (adminProductForm) {

                adminProductForm.classList.remove(
                    "show"
                );

            }


            if (adminDashboard) {

                adminDashboard.classList.add(
                    "show"
                );

            }


            renderAdminProducts();

        }
    );

}


// =========================================
// DELETE PRODUCT
// =========================================

async function deleteAdminProduct(
    id
) {

    const product =
        adminProducts.find(
            function (item) {

                return Number(
                    item.id
                ) === Number(id);

            }
        );


    if (!product) {

        return;

    }


    const confirmed =
        confirm(
            `Delete "${product.name}"?`
        );


    if (!confirmed) {

        return;

    }


    const deleted =
        await deleteProductFromSupabase(
            id
        );


    if (!deleted) {

        return;

    }


    adminProducts =
        adminProducts.filter(
            function (item) {

                return Number(
                    item.id
                ) !== Number(id);

            }
        );


    rebuildProductImages();


    renderAdminProducts();

    renderStoreProducts();


    cart =
        cart.filter(
            function (item) {

                return adminProducts.some(
                    function (product) {

                        return (
                            product.name ===
                            item.name
                        );

                    }
                );

            }
        );


    updateCart();


    alert(
        "Product deleted successfully."
    );

}


// =========================================
// MOBILE MENU
// =========================================

function openMobileMenu() {

    if (mobileMenu) {

        mobileMenu.classList.add(
            "show"
        );

    }


    if (mobileMenuButton) {

        mobileMenuButton.classList.add(
            "active"
        );


        mobileMenuButton.setAttribute(
            "aria-label",
            "Close menu"
        );

    }

}


function closeMobileMenu() {

    if (mobileMenu) {

        mobileMenu.classList.remove(
            "show"
        );

    }


    if (mobileMenuButton) {

        mobileMenuButton.classList.remove(
            "active"
        );


        mobileMenuButton.setAttribute(
            "aria-label",
            "Open menu"
        );

    }

}


if (mobileMenuButton) {

    mobileMenuButton.addEventListener(
        "click",
        function () {

            if (
                mobileMenu &&
                mobileMenu.classList.contains(
                    "show"
                )
            ) {

                closeMobileMenu();

            } else {

                openMobileMenu();

            }

        }
    );

}


if (mobileMenuClose) {

    mobileMenuClose.addEventListener(
        "click",
        closeMobileMenu
    );

}


mobileMenuLinks.forEach(
    function (link) {

        link.addEventListener(
            "click",
            closeMobileMenu
        );

    }
);


window.addEventListener(
    "resize",
    function () {

        if (
            window.innerWidth > 760
        ) {

            closeMobileMenu();

        }

    }
);


// =========================================
// INITIALIZE WEBSITE
// =========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateCart();

        loadProductsFromSupabase();

    }
);

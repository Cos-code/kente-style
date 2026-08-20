// =========================================
// KENTESTYLE SHOPPING CART
// =========================================


// =========================================
// CART DATA
// =========================================

let cart = JSON.parse(
    localStorage.getItem("kenteCart")
) || [];


// =========================================
// HTML ELEMENTS
// =========================================

const cartButton = document.getElementById("cart-button");
const cartPanel = document.getElementById("cart-panel");
const closeCartButton = document.getElementById("close-cart");
const cartOverlay = document.getElementById("cart-overlay");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const cartNotification = document.getElementById("cart-notification");

const addToCartButtons = document.querySelectorAll(".add-to-cart");
const productCards = document.querySelectorAll(".product-card");
const categoryButtons = document.querySelectorAll(".category-button");


// =========================================
// PRODUCT IMAGES
// =========================================

const productImages = {};

productCards.forEach(function (card) {

    const button = card.querySelector(".add-to-cart");
    const image = card.querySelector("img");

    if (button && image) {

        productImages[button.dataset.name] = image.src;

    }

});


// =========================================
// PRODUCT MODAL
// =========================================

const productModal =
    document.getElementById("product-modal");

const closeProductModal =
    document.getElementById("close-product-modal");

const modalProductImage =
    document.getElementById("modal-product-image");

const modalProductName =
    document.getElementById("modal-product-name");

const modalProductPrice =
    document.getElementById("modal-product-price");

const modalProductDescription =
    document.getElementById("modal-product-description");

const modalMinus =
    document.getElementById("modal-minus");

const modalPlus =
    document.getElementById("modal-plus");

const modalQuantity =
    document.getElementById("modal-quantity");

const modalAddToCart =
    document.getElementById("modal-add-to-cart");


let selectedProduct = null;
let selectedQuantity = 1;


// =========================================
// OPEN CART
// =========================================

function openCart() {

    cartPanel.classList.add("open");

    cartOverlay.classList.add("show");

}


// =========================================
// CLOSE CART
// =========================================

function closeCart() {

    cartPanel.classList.remove("open");

    cartOverlay.classList.remove("show");

}


cartButton.addEventListener("click", openCart);

closeCartButton.addEventListener("click", closeCart);

cartOverlay.addEventListener("click", closeCart);


// =========================================
// CART NOTIFICATION
// =========================================

function showCartNotification() {

    cartNotification.classList.remove("show");

    setTimeout(function () {

        cartNotification.classList.add("show");

    }, 10);

    setTimeout(function () {

        cartNotification.classList.remove("show");

    }, 2500);

}


// =========================================
// ADD PRODUCT TO CART
// =========================================

function addProductToCart(
    productName,
    productPrice,
    quantity = 1
) {

    const price = Number(productPrice);
    const amount = Number(quantity);

    if (
        !productName ||
        !Number.isFinite(price) ||
        price <= 0 ||
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        return;

    }


    const existingProduct = cart.find(
        function (product) {

            return product.name === productName;

        }
    );


    if (existingProduct) {

        existingProduct.quantity += amount;

    } else {

        cart.push({

            name: productName,

            price: price,

            quantity: amount

        });

    }


    updateCart();

    showCartNotification();

}


// =========================================
// PRODUCT ADD TO CART BUTTONS
// =========================================

addToCartButtons.forEach(function (button) {

    button.addEventListener("click", function (event) {

        event.stopPropagation();

        const name = button.dataset.name;

        const price = button.dataset.price;

        addProductToCart(
            name,
            price,
            1
        );

    });

});


// =========================================
// UPDATE CART
// =========================================

function updateCart() {

    localStorage.setItem(
        "kenteCart",
        JSON.stringify(cart)
    );


    cartItems.innerHTML = "";


    let totalQuantity = 0;

    let totalPrice = 0;


    // =====================================
    // EMPTY CART
    // =====================================

    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <p>
                    Your cart is empty.
                </p>

            </div>

        `;


        cartCount.textContent = "0";

        cartTotal.textContent = "GH₵0.00";

        return;

    }


    // =====================================
    // CART PRODUCTS
    // =====================================

    cart.forEach(function (product) {

        product.price = Number(product.price);

        product.quantity = Number(product.quantity);


        totalQuantity += product.quantity;

        totalPrice +=
            product.price *
            product.quantity;


        const cartItem =
            document.createElement("div");

        cartItem.classList.add("cart-item");


        cartItem.innerHTML = `

            <div class="cart-item-image">

                <img
                    src="${productImages[product.name] || ""}"
                    alt="${product.name}"
                >

            </div>


            <div class="cart-item-info">

                <h3>
                    ${product.name}
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


        cartItems.appendChild(cartItem);


        // =================================
        // MINUS
        // =================================

        const minusButton =
            cartItem.querySelector(
                ".quantity-minus"
            );


        minusButton.addEventListener(
            "click",
            function () {

                product.quantity--;


                if (product.quantity <= 0) {

                    cart = cart.filter(
                        function (item) {

                            return item.name !==
                                product.name;

                        }
                    );

                }


                updateCart();

            }
        );


        // =================================
        // PLUS
        // =================================

        const plusButton =
            cartItem.querySelector(
                ".quantity-plus"
            );


        plusButton.addEventListener(
            "click",
            function () {

                product.quantity++;

                updateCart();

            }
        );


        // =================================
        // REMOVE
        // =================================

        const removeButton =
            cartItem.querySelector(
                ".remove-item"
            );


        removeButton.addEventListener(
            "click",
            function () {

                cart = cart.filter(
                    function (item) {

                        return item.name !==
                            product.name;

                    }
                );


                updateCart();

            }
        );

    });


    // =====================================
    // UPDATE TOTALS
    // =====================================

    cartCount.textContent =
        totalQuantity;


    cartTotal.textContent =
        `GH₵${totalPrice.toFixed(2)}`;

}


// =========================================
// PRODUCT DETAILS MODAL
// =========================================

productCards.forEach(function (productCard) {

    productCard.addEventListener(
        "click",
        function () {

            const name =
                productCard
                    .querySelector("h3")
                    .textContent
                    .trim();


            const priceText =
                productCard
                    .querySelector(".product-price")
                    .textContent
                    .replace("GH₵", "")
                    .trim();


            const price =
                Number(priceText);


            const image =
                productCard
                    .querySelector("img")
                    .src;


            selectedProduct = {

                name: name,

                price: price,

                image: image,

                description:
                    "A beautiful African fashion piece from the KenteStyle collection. Designed to celebrate African culture, confidence and modern style."

            };


            selectedQuantity = 1;


            modalQuantity.textContent =
                selectedQuantity;


            modalProductImage.src =
                selectedProduct.image;


            modalProductName.textContent =
                selectedProduct.name;


            modalProductPrice.textContent =
                `GH₵${selectedProduct.price.toFixed(2)}`;


            modalProductDescription.textContent =
                selectedProduct.description;


            productModal.classList.add("show");

        }
    );

});


// =========================================
// CLOSE PRODUCT MODAL
// =========================================

closeProductModal.addEventListener(
    "click",
    function () {

        productModal.classList.remove("show");

    }
);


productModal.addEventListener(
    "click",
    function (event) {

        if (event.target === productModal) {

            productModal.classList.remove("show");

        }

    }
);


// =========================================
// MODAL MINUS
// =========================================

modalMinus.addEventListener(
    "click",
    function () {

        if (selectedQuantity > 1) {

            selectedQuantity--;

            modalQuantity.textContent =
                selectedQuantity;

        }

    }
);


// =========================================
// MODAL PLUS
// =========================================

modalPlus.addEventListener(
    "click",
    function () {

        selectedQuantity++;

        modalQuantity.textContent =
            selectedQuantity;

    }
);


// =========================================
// MODAL ADD TO CART
// =========================================

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


        productModal.classList.remove("show");

    }
);


// =========================================
// CATEGORY FILTER
// =========================================

categoryButtons.forEach(function (button) {

    button.addEventListener(
        "click",
        function () {

            categoryButtons.forEach(
                function (item) {

                    item.classList.remove("active");

                }
            );


            button.classList.add("active");


            const category =
                button.dataset.category;


            productCards.forEach(
                function (product) {

                    const productCategory =
                        product.dataset.category;


                    if (
                        category === "all" ||
                        productCategory === category
                    ) {

                        product.style.display =
                            "";

                    } else {

                        product.style.display =
                            "none";

                    }

                }
            );

        }
    );

});


// =========================================
// CHECKOUT ELEMENTS
// =========================================

const checkoutButton =
    document.querySelector(".checkout-button");

const checkoutModal =
    document.getElementById("checkout-modal");

const checkoutClose =
    document.getElementById("checkout-close");

const checkoutItems =
    document.getElementById("checkout-items");

const checkoutTotal =
    document.getElementById("checkout-total");

const checkoutForm =
    document.getElementById("checkout-form");


// =========================================
// SUCCESS MODAL
// =========================================

const orderSuccess =
    document.getElementById("order-success");

const successClose =
    document.getElementById("success-close");


// =========================================
// MOBILE MONEY
// =========================================

const momoModal =
    document.getElementById("momo-modal");

const momoClose =
    document.getElementById("momo-close");

const momoForm =
    document.getElementById("momo-form");

const momoTotal =
    document.getElementById("momo-total");


// =========================================
// CALCULATE CART TOTAL
// =========================================

function calculateCartTotal() {

    let total = 0;


    cart.forEach(function (product) {

        total +=
            Number(product.price) *
            Number(product.quantity);

    });


    return total;

}


// =========================================
// OPEN CHECKOUT
// =========================================

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


        checkoutModal.classList.add("show");


        closeCart();

    }
);


// =========================================
// CLOSE CHECKOUT
// =========================================

checkoutClose.addEventListener(
    "click",
    function () {

        checkoutModal.classList.remove("show");

    }
);


// =========================================
// CLICK OUTSIDE CHECKOUT
// =========================================

checkoutModal.addEventListener(
    "click",
    function (event) {

        if (event.target === checkoutModal) {

            checkoutModal.classList.remove("show");

        }

    }
);


// =========================================
// CHECKOUT SUMMARY
// =========================================

function displayCheckoutSummary() {

    checkoutItems.innerHTML = "";


    let total = 0;


    cart.forEach(function (product) {

        const quantity =
            Number(product.quantity);

        const price =
            Number(product.price);


        const itemTotal =
            price * quantity;


        total += itemTotal;


        const checkoutItem =
            document.createElement("div");


        checkoutItem.classList.add(
            "checkout-item"
        );


        checkoutItem.innerHTML = `

            <span class="checkout-item-name">

                ${product.name} × ${quantity}

            </span>


            <span class="checkout-item-price">

                GH₵${itemTotal.toFixed(2)}

            </span>

        `;


        checkoutItems.appendChild(
            checkoutItem
        );

    });


    checkoutTotal.textContent =
        `GH₵${total.toFixed(2)}`;

}


// =========================================
// CREATE WHATSAPP ORDER
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


    cart.forEach(function (product) {

        const quantity =
            Number(product.quantity);


        const price =
            Number(product.price);


        const itemTotal =
            price * quantity;


        orderMessage +=
            `\n${product.name} × ${quantity} - GH₵${itemTotal.toFixed(2)}`;

    });


    orderMessage +=
        `\n\n*TOTAL: GH₵${orderTotal.toFixed(2)}*`;


    // =====================================
    // YOUR WHATSAPP NUMBER
    // =====================================

    const whatsappNumber =
        "233555535235";


    const whatsappURL =
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(orderMessage)}`;


    window.open(
        whatsappURL,
        "_blank"
    );

}


// =========================================
// CHECKOUT FORM SUBMIT
// =========================================

checkoutForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        // =====================================
        // GET CUSTOMER INFORMATION
        // =====================================

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


        // =====================================
        // VALIDATION
        // =====================================

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

            checkoutModal.classList.remove("show");

            return;

        }


        // =====================================
        // MOBILE MONEY
        // =====================================

        if (
            paymentMethod === "Mobile Money"
        ) {

            const orderTotal =
                calculateCartTotal();


            momoTotal.textContent =
                `GH₵${orderTotal.toFixed(2)}`;


            // Save checkout customer information
            // temporarily for the Mobile Money step

            sessionStorage.setItem(
                "kenteCheckoutCustomer",
                JSON.stringify({

                    name: customerName,

                    phone: customerPhone,

                    region: customerRegion,

                    deliveryLocation:
                        deliveryLocation,

                    paymentMethod:
                        paymentMethod

                })
            );


            momoModal.classList.add("show");

            checkoutModal.classList.remove("show");


            return;

        }


        // =====================================
        // CASH ON DELIVERY
        // =====================================

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


            // Clear cart correctly

            cart = [];


            localStorage.removeItem(
                "kenteCart"
            );


            updateCart();


            // Close checkout

            checkoutModal.classList.remove(
                "show"
            );


            // Reset form

            checkoutForm.reset();


            // Show success

            orderSuccess.classList.add(
                "show"
            );

        }

    }
);


// =========================================
// CLOSE MOBILE MONEY
// =========================================

momoClose.addEventListener(
    "click",
    function () {

        momoModal.classList.remove("show");

    }
);


// =========================================
// CLICK OUTSIDE MOBILE MONEY
// =========================================

momoModal.addEventListener(
    "click",
    function (event) {

        if (event.target === momoModal) {

            momoModal.classList.remove("show");

        }

    }
);


// =========================================
// MOBILE MONEY FORM
// =========================================

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


        // =====================================
        // GET CUSTOMER INFORMATION
        // =====================================

        const savedCustomer =
            sessionStorage.getItem(
                "kenteCheckoutCustomer"
            );


        if (!savedCustomer) {

            alert(
                "Your checkout session has expired. Please start checkout again."
            );

            momoModal.classList.remove(
                "show"
            );

            return;

        }


        const customer =
            JSON.parse(savedCustomer);


        // =====================================
        // IMPORTANT
        // =====================================
        //
        // This does NOT actually charge the
        // customer's Mobile Money account.
        //
        // A real payment gateway such as
        // Paystack or Hubtel must be connected
        // for actual payment processing.
        //


        sendOrderToWhatsApp(

            customer.name,

            customer.phone,

            customer.region,

            customer.deliveryLocation,

            "Mobile Money",

            `MoMo Network: ${momoNetwork}\nMoMo Number: ${momoPhone}\nPayment Status: Awaiting Payment`

        );


        // =====================================
        // CLEAR CART
        // =====================================

        cart = [];


        localStorage.removeItem(
            "kenteCart"
        );


        sessionStorage.removeItem(
            "kenteCheckoutCustomer"
        );


        updateCart();


        // =====================================
        // RESET FORMS
        // =====================================

        momoForm.reset();

        checkoutForm.reset();


        // =====================================
        // CLOSE MOBILE MONEY
        // =====================================

        momoModal.classList.remove(
            "show"
        );


        // =====================================
        // SHOW SUCCESS
        // =====================================

        orderSuccess.classList.add(
            "show"
        );

    }
);


// =========================================
// CLOSE SUCCESS MESSAGE
// =========================================

successClose.addEventListener(
    "click",
    function () {

        orderSuccess.classList.remove(
            "show"
        );

    }
);


// =========================================
// KENTESTYLE ADMIN PRODUCT MANAGEMENT
// =========================================


// =========================================
// ADMIN ELEMENTS
// =========================================

const adminButton =
    document.getElementById("admin-button");

const adminModal =
    document.getElementById("admin-modal");

const adminClose =
    document.getElementById("admin-close");

const adminLogin =
    document.getElementById("admin-login");

const adminDashboard =
    document.getElementById("admin-dashboard");

const adminPassword =
    document.getElementById("admin-password");

const adminLoginButton =
    document.getElementById("admin-login-button");

const adminLoginError =
    document.getElementById("admin-login-error");

const adminProductList =
    document.getElementById("admin-product-list");

const adminAddProduct =
    document.getElementById("admin-add-product");

const adminProductForm =
    document.getElementById("admin-product-form");

const adminFormTitle =
    document.getElementById("admin-form-title");

const adminFormBack =
    document.getElementById("admin-form-back");

const adminSaveProduct =
    document.getElementById("admin-save-product");


// =========================================
// PRODUCT FORM ELEMENTS
// =========================================

const adminProductName =
    document.getElementById("admin-product-name");

const adminProductPrice =
    document.getElementById("admin-product-price");

const adminProductCategory =
    document.getElementById("admin-product-category");

const adminProductImage =
    document.getElementById("admin-product-image");

const adminProductDescription =
    document.getElementById(
        "admin-product-description"
    );


// =========================================
// ADMIN SETTINGS
// =========================================
//
// IMPORTANT:
// This is only a temporary front-end password.
// We will replace this with proper authentication
// when we connect a real backend.
//

const ADMIN_PASSWORD =
    "KenteStyleAdmin";


// =========================================
// ADMIN PRODUCTS
// =========================================

let adminProducts =
    JSON.parse(
        localStorage.getItem(
            "kenteAdminProducts"
        )
    );


// =========================================
// CREATE PRODUCTS FROM EXISTING HTML
// =========================================

if (
    !adminProducts ||
    !Array.isArray(adminProducts) ||
    adminProducts.length === 0
) {

    adminProducts = [];


    productCards.forEach(
        function (card, index) {

            const button =
                card.querySelector(
                    ".add-to-cart"
                );

            const image =
                card.querySelector("img");

            const name =
                card.querySelector("h3");


            const price =
                card.querySelector(
                    ".product-price"
                );


            if (
                button &&
                image &&
                name &&
                price
            ) {

                adminProducts.push({

                    id:
                        Date.now() + index,

                    name:
                        name.textContent.trim(),

                    price:
                        Number(
                            button.dataset.price
                        ),

                    category:
                        card.dataset.category,

                    image:
                        image.getAttribute("src"),

                    description:
                        "A beautiful African fashion piece from the KenteStyle collection. Designed to celebrate African culture, confidence and modern style."

                });

            }

        }
    );


    saveAdminProducts();

}


// =========================================
// SAVE PRODUCTS
// =========================================

function saveAdminProducts() {

    localStorage.setItem(
        "kenteAdminProducts",
        JSON.stringify(
            adminProducts
        )
    );

}


// =========================================
// OPEN ADMIN
// =========================================

adminButton.addEventListener(
    "click",
    function () {

        adminModal.classList.add(
            "show"
        );

        adminLogin.style.display =
            "block";

        adminDashboard.classList.remove(
            "show"
        );

        adminProductForm.classList.remove(
            "show"
        );

        adminPassword.value = "";

        adminLoginError.textContent = "";

    }
);


// =========================================
// CLOSE ADMIN
// =========================================

adminClose.addEventListener(
    "click",
    function () {

        adminModal.classList.remove(
            "show"
        );

    }
);


adminModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === adminModal
        ) {

            adminModal.classList.remove(
                "show"
            );

        }

    }
);


// =========================================
// ADMIN LOGIN
// =========================================

adminLoginButton.addEventListener(
    "click",
    function () {

        if (
            adminPassword.value ===
            ADMIN_PASSWORD
        ) {

            adminLogin.style.display =
                "none";

            adminDashboard.classList.add(
                "show"
            );

            adminProductForm.classList.remove(
                "show"
            );

            renderAdminProducts();

        } else {

            adminLoginError.textContent =
                "Incorrect admin password.";

        }

    }
);


// =========================================
// ENTER KEY LOGIN
// =========================================

adminPassword.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter"
        ) {

            adminLoginButton.click();

        }

    }
);


// =========================================
// RENDER ADMIN PRODUCTS
// =========================================

function renderAdminProducts() {

    adminProductList.innerHTML = "";


    if (
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
                        src="${product.image}"
                        alt="${product.name}"
                    >

                </div>


                <div class="admin-product-row-info">

                    <h4>
                        ${product.name}
                    </h4>

                    <p>
                        ${product.category}
                    </p>

                    <p class="admin-product-row-price">
                        GH₵${Number(
                            product.price
                        ).toFixed(2)}
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


    // =====================================
    // EDIT BUTTONS
    // =====================================

    document
        .querySelectorAll(
            ".admin-edit-button"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const id =
                            Number(
                                button.dataset.id
                            );

                        editAdminProduct(id);

                    }
                );

            }
        );


    // =====================================
    // DELETE BUTTONS
    // =====================================

    document
        .querySelectorAll(
            ".admin-delete-button"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const id =
                            Number(
                                button.dataset.id
                            );

                        deleteAdminProduct(id);

                    }
                );

            }
        );

}


// =========================================
// ADD PRODUCT
// =========================================

adminAddProduct.addEventListener(
    "click",
    function () {

        editingProductId = null;


        adminFormTitle.textContent =
            "Add Product";


        adminProductName.value = "";

        adminProductPrice.value = "";

        adminProductCategory.value =
            "men";

        adminProductImage.value = "";

        adminProductDescription.value =
            "";


        adminDashboard.classList.remove(
            "show"
        );

        adminProductForm.classList.add(
            "show"
        );

    }
);


// =========================================
// EDIT PRODUCT
// =========================================

let editingProductId = null;


function editAdminProduct(id) {

    const product =
        adminProducts.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!product) {

        return;

    }


    editingProductId = id;


    adminFormTitle.textContent =
        "Edit Product";


    adminProductName.value =
        product.name;

    adminProductPrice.value =
        product.price;

    adminProductCategory.value =
        product.category;

    adminProductImage.value =
        product.image;

    adminProductDescription.value =
        product.description || "";


    adminDashboard.classList.remove(
        "show"
    );

    adminProductForm.classList.add(
        "show"
    );

}


// =========================================
// SAVE PRODUCT
// =========================================

adminSaveProduct.addEventListener(
    "click",
    function () {

        const name =
            adminProductName.value.trim();


        const price =
            Number(
                adminProductPrice.value
            );


        const category =
            adminProductCategory.value;


        const image =
            adminProductImage.value.trim();


        const description =
            adminProductDescription.value.trim();


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


        if (!image) {

            alert(
                "Please enter the product image path."
            );

            return;

        }


        // =====================================
        // EDIT EXISTING PRODUCT
        // =====================================

        if (
            editingProductId !== null
        ) {

            const product =
                adminProducts.find(
                    function (item) {

                        return item.id ===
                            editingProductId;

                    }
                );


            if (product) {

                product.name =
                    name;

                product.price =
                    price;

                product.category =
                    category;

                product.image =
                    image;

                product.description =
                    description;

            }

        }


        // =====================================
        // ADD NEW PRODUCT
        // =====================================

        else {

            adminProducts.push({

                id:
                    Date.now(),

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

            });

        }


        saveAdminProducts();


        alert(
            "Product saved successfully."
        );


        editingProductId = null;


        adminProductForm.classList.remove(
            "show"
        );

        adminDashboard.classList.add(
            "show"
        );


        renderAdminProducts();

    }
);


// =========================================
// BACK TO PRODUCT LIST
// =========================================

adminFormBack.addEventListener(
    "click",
    function () {

        editingProductId = null;


        adminProductForm.classList.remove(
            "show"
        );

        adminDashboard.classList.add(
            "show"
        );


        renderAdminProducts();

    }
);


// =========================================
// DELETE PRODUCT
// =========================================

function deleteAdminProduct(id) {

    const product =
        adminProducts.find(
            function (item) {

                return item.id === id;

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


    adminProducts =
        adminProducts.filter(
            function (item) {

                return item.id !== id;

            }
        );


    saveAdminProducts();


    renderAdminProducts();

}


// =========================================
// ADMIN PRODUCT MANAGEMENT READY
// =========================================


// =========================================
// PRODUCT SEARCH
// =========================================

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


// =========================================
// CURRENT CATEGORY
// =========================================

let currentCategory = "all";


// =========================================
// FILTER PRODUCTS
// =========================================

function filterProducts() {

    const searchTerm =
        productSearchInput.value
            .trim()
            .toLowerCase();


    let visibleProducts = 0;


    productCards.forEach(
        function (product) {

            const productName =
                product.querySelector("h3")
                    .textContent
                    .trim()
                    .toLowerCase();


            const productCategory =
                product.dataset.category
                    .toLowerCase();


            const matchesSearch =
                productName.includes(
                    searchTerm
                );


            const matchesCategory =
                currentCategory === "all" ||
                productCategory ===
                    currentCategory;


            if (
                matchesSearch &&
                matchesCategory
            ) {

                product.style.display = "";

                visibleProducts++;

            } else {

                product.style.display =
                    "none";

            }

        }
    );


    // =====================================
    // SEARCH BUTTON
    // =====================================

    if (searchTerm.length > 0) {

        clearProductSearch.classList.add(
            "show"
        );

    } else {

        clearProductSearch.classList.remove(
            "show"
        );

    }


    // =====================================
    // RESULT MESSAGE
    // =====================================

    if (searchTerm.length > 0) {

        if (visibleProducts === 0) {

            searchResultsText.textContent =
                `No products found for "${productSearchInput.value.trim()}".`;

        } else {

            searchResultsText.textContent =
                `${visibleProducts} product${
                    visibleProducts === 1
                        ? ""
                        : "s"
                } found`;

        }

    } else {

        searchResultsText.textContent = "";

    }


    // =====================================
    // NO RESULTS MESSAGE
    // =====================================

    const existingMessage =
        document.querySelector(
            ".no-search-results"
        );


    if (existingMessage) {

        existingMessage.remove();

    }


    if (visibleProducts === 0) {

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


        const productGrid =
            document.querySelector(
                ".product-grid"
            );


        productGrid.appendChild(
            message
        );

    }

}


// =========================================
// SEARCH WHILE TYPING
// =========================================

productSearchInput.addEventListener(
    "input",
    function () {

        filterProducts();

    }
);


// =========================================
// CLEAR SEARCH
// =========================================

clearProductSearch.addEventListener(
    "click",
    function () {

        productSearchInput.value = "";

        filterProducts();

        productSearchInput.focus();

    }
);


// =========================================
// UPDATE CATEGORY FILTER
// =========================================
//
// This replaces the category filtering
// behavior so search + category work together.
//

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
                    button.dataset.category;


                filterProducts();

            }
        );

    }
);

// Your existing code
// ...
// ...
// ...

updateCart();


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
// OPEN MOBILE MENU
// =========================================

function openMobileMenu() {

    mobileMenu.classList.add("show");

    mobileMenuButton.classList.add("active");

    mobileMenuButton.setAttribute(
        "aria-label",
        "Close menu"
    );

}


// =========================================
// CLOSE MOBILE MENU
// =========================================

function closeMobileMenu() {

    mobileMenu.classList.remove("show");

    mobileMenuButton.classList.remove("active");

    mobileMenuButton.setAttribute(
        "aria-label",
        "Open menu"
    );

}


// =========================================
// MENU BUTTON
// =========================================

mobileMenuButton.addEventListener(
    "click",
    function () {

        if (
            mobileMenu.classList.contains("show")
        ) {

            closeMobileMenu();

        } else {

            openMobileMenu();

        }

    }
);


// =========================================
// CLOSE BUTTON
// =========================================

mobileMenuClose.addEventListener(
    "click",
    closeMobileMenu
);


// =========================================
// CLOSE AFTER CLICKING LINK
// =========================================

mobileMenuLinks.forEach(
    function (link) {

        link.addEventListener(
            "click",
            function () {

                closeMobileMenu();

            }
        );

    }
);


// =========================================
// CLOSE ON DESKTOP RESIZE
// =========================================

window.addEventListener(
    "resize",
    function () {

        if (window.innerWidth > 760) {

            closeMobileMenu();

        }

    }
);

// =========================================
// INITIALIZE
// =========================================

updateCart();
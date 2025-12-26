document.addEventListener('DOMContentLoaded', () => {
    loadCartItems();
});

// Định dạng tiền tệ
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// === HÀM CHÍNH: TẢI VÀ HIỂN THỊ SẢN PHẨM ===
function loadCartItems() {
    const cartData = JSON.parse(localStorage.getItem('cart_data')) || [];
    const cartItemsContainer = document.querySelector('.cart-items');
    
    // Xóa nội dung mẫu (nếu có)
    cartItemsContainer.innerHTML = '';

    if (cartData.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align:center; margin-top:20px;">Giỏ hàng của bạn đang trống.</p>';
        updateTotal(0);
        return;
    }

    // Duyệt qua từng sản phẩm và tạo HTML
    cartData.forEach((item, index) => {
        const itemHTML = `
            <div class="item-card" data-index="${index}">
                <div class="item-image">
                    <img src="${item.img}" alt="${item.name}">
                </div>
                <div class="item-info">
                    <h3 class="item-name">${item.name}</h3>
                    <p class="item-desc">${item.desc}</p>
                    <div class="item-price">${formatCurrency(item.price)}</div>
                </div>
                <div class="item-actions">
                    <div class="quantity-control">
                        <button class="btn-qty minus"><i class="fas fa-minus"></i></button>
                        <input type="text" value="${item.quantity}" readonly>
                        <button class="btn-qty plus"><i class="fas fa-plus"></i></button>
                    </div>
                    <button class="btn-remove"><i class="far fa-trash-alt"></i></button>
                </div>
            </div>
        `;
        cartItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
    });

    // Sau khi vẽ xong HTML, gắn sự kiện cho các nút
    attachEventHandlers();
    updateTotalCalculator();
}

// === GẮN SỰ KIỆN CHO NÚT (TĂNG/GIẢM/XÓA) ===
function attachEventHandlers() {
    // 1. Nút Xóa
    document.querySelectorAll('.btn-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if(confirm("Xóa sản phẩm này?")) {
                const index = e.target.closest('.item-card').dataset.index;
                removeFromCart(index);
            }
        });
    });

    // 2. Nút Tăng/Giảm
    document.querySelectorAll('.btn-qty').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.item-card');
            const index = card.dataset.index;
            const isPlus = btn.classList.contains('plus');
            
            updateQuantity(index, isPlus);
        });
    });
}

// === LOGIC XỬ LÝ DỮ LIỆU ===

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart_data')) || [];
    cart.splice(index, 1); // Xóa phần tử tại vị trí index
    localStorage.setItem('cart_data', JSON.stringify(cart));
    loadCartItems(); // Vẽ lại giao diện
}

function updateQuantity(index, isIncrease) {
    let cart = JSON.parse(localStorage.getItem('cart_data')) || [];
    
    if (isIncrease) {
        cart[index].quantity++;
    } else {
        if (cart[index].quantity > 1) {
            cart[index].quantity--;
        }
    }
    
    localStorage.setItem('cart_data', JSON.stringify(cart));
    loadCartItems(); // Vẽ lại giao diện để cập nhật số và tổng tiền
}

function updateTotalCalculator() {
    let cart = JSON.parse(localStorage.getItem('cart_data')) || [];
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
    });

    document.getElementById('subtotal').innerText = formatCurrency(total);
    document.getElementById('total-price').innerText = formatCurrency(total);
}
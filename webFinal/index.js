document.addEventListener("DOMContentLoaded", function () {
  // --- HÀM DÙNG CHUNG: THÊM VÀO LOCALSTORAGE ---
  function addToLocalStorage(item) {
    // 1. Lấy dữ liệu cũ từ kho
    let cart = JSON.parse(localStorage.getItem("cart_data")) || [];

    // 2. Kiểm tra xem sản phẩm đã có chưa để cộng dồn số lượng
    // (So sánh dựa trên ID và các tùy chọn nếu có)
    const existingItemIndex = cart.findIndex(
      (i) =>
        i.id === item.id &&
        JSON.stringify(i.options) === JSON.stringify(item.options)
    );

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += item.quantity;
    } else {
      cart.push(item);
    }

    // 3. Lưu ngược lại vào kho
    localStorage.setItem("cart_data", JSON.stringify(cart));

    // 4. Thông báo
    alert(`Đã thêm "${item.name}" vào giỏ hàng!`);

    // (Tùy chọn) Cập nhật số lượng trên icon giỏ hàng nếu muốn
    updateCartBadge();
  }

  function updateCartBadge() {
    let cart = JSON.parse(localStorage.getItem("cart_data")) || [];
    // Bạn có thể thêm logic hiển thị số lượng lên icon giỏ hàng ở đây nếu muốn
    console.log("Tổng sp trong giỏ:", cart.length);
  }

  /* ===============================
           1. CUSTOM MATCHA (TÙY CHỈNH)
           =============================== */
  const userOrder = {
    matcha: null, // Lưu cả object {id, name, img}
    milk: null,
    size: { id: "size_l", name: "Size L (350ml)" }, // Mặc định
  };

  // Xử lý click chọn Matcha & Sữa
  document.querySelectorAll(".option-item").forEach((item) => {
    item.addEventListener("click", function () {
      const frame = this.closest(".selection-frame");
      const category = frame.dataset.category;

      // UI: Active class
      frame
        .querySelectorAll(".option-item")
        .forEach((el) => el.classList.remove("active"));
      this.classList.add("active");

      // DATA: Lấy thông tin chi tiết
      const data = {
        id: this.dataset.value,
        name: this.querySelector("h4").innerText,
        img: this.querySelector("img").src, // Lấy link ảnh
      };

      if (category === "matcha") userOrder.matcha = data;
      if (category === "milk") userOrder.milk = data;
    });
  });

  // Xử lý click chọn Size
  document.querySelectorAll(".size-item").forEach((item) => {
    item.addEventListener("click", function () {
      const frame = this.closest(".selection-frame");
      frame
        .querySelectorAll(".size-item")
        .forEach((el) => el.classList.remove("active"));
      this.classList.add("active");

      userOrder.size = {
        id: this.dataset.value,
        name: this.querySelector("span").innerText,
      };
    });
  });

  // Nút Thêm Custom vào giỏ
  document
    .getElementById("confirm-custom")
    .addEventListener("click", function () {
      if (!userOrder.matcha || !userOrder.milk) {
        alert("Vui lòng chọn loại Matcha và loại Sữa!");
        return;
      }

      // Tạo item Custom
      const customItem = {
        id: `custom_${userOrder.matcha.id}_${userOrder.milk.id}`,
        name: `Custom: ${userOrder.matcha.name}`,
        desc: `${userOrder.milk.name} • ${userOrder.size.name}`,
        price: 75000, // Giá cố định cho custom (hoặc bạn tự tính toán)
        img: userOrder.matcha.img, // Lấy ảnh của bột matcha làm đại diện
        quantity: 1,
        options: { size: userOrder.size.id, milk: userOrder.milk.id },
      };

      addToLocalStorage(customItem);
    });

  /* ===============================
           2. NGUYÊN LIỆU LẺ
           =============================== */
  document.querySelectorAll(".ingredient-card").forEach((card) => {
    const input = card.querySelector('input[type="number"]');
    const pricePerUnit = parseInt(card.dataset.pricePerGram);
    const totalPriceEl = card.querySelector(".total-price");
    const addBtn = card.querySelector(".add-btn");

    // Cập nhật giá khi đổi số lượng
    input.addEventListener("input", () => {
      const qty = parseInt(input.value) || 0;
      totalPriceEl.textContent =
        "Tổng: " + (qty * pricePerUnit).toLocaleString() + "đ";
    });

    addBtn.addEventListener("click", () => {
      const qty = parseInt(input.value);
      if (qty <= 0) return;

      const item = {
        id: card.dataset.productId,
        name: card.querySelector("h4").innerText,
        desc: `Nguyên liệu: ${qty}g/ml`,
        price: pricePerUnit * qty, // Giá này là giá tổng của gói nguyên liệu đó
        // Lưu ý: Trong giỏ hàng, ta coi đây là 1 gói giá (price), số lượng (quantity) là 1
        // Hoặc bạn có thể để đơn giá lẻ và quantity là số gram.
        // Ở đây tôi chọn cách: Coi gói này là 1 sản phẩm có giá trị = Tổng tiền.
        real_price: pricePerUnit * qty,
        img: card.querySelector("img").src,
        quantity: 1,
        options: { weight: qty },
      };

      addToLocalStorage(item);
    });
  });

  /* ===============================
           3. SẢN PHẨM NỔI BẬT
           =============================== */
  document.querySelectorAll(".product-card .add-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const card = this.closest(".product-card");

      const item = {
        id: card.dataset.productId,
        name: card.querySelector("h3").innerText,
        desc: "Sản phẩm pha sẵn",
        price: parseInt(card.dataset.price),
        img: card.querySelector("img").src,
        quantity: 1,
        options: {},
      };

      addToLocalStorage(item);
    });
  });
});

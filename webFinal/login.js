const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');
const signUpForm = document.getElementById('signUpForm');
const signInForm = document.getElementById('signInForm');

// --- HÀM KHÔI PHỤC TRẠNG THÁI FORM (FIX LỖI) ---
function resetFormUI(form) {
    const formContent = form.querySelector('.form-content');
    const successMsg = form.querySelector('.success-message');

    // 1. Xóa dữ liệu cũ
    form.reset();

    // 2. Hiện lại form nhập liệu (QUAN TRỌNG: Thêm flex-direction: column)
    if (formContent) {
        formContent.style.display = 'flex'; 
        formContent.style.flexDirection = 'column'; // <--- Dòng này sửa lỗi vỡ giao diện
    }

    // 3. Ẩn thông báo thành công
    if (successMsg) {
        successMsg.style.display = 'none';
    }
}

// --- XỬ LÝ SỰ KIỆN CHUYỂN ĐỔI TAB ---

// Khi bấm nút "Đăng ký" (ở panel Overlay)
signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
    // FIX: Reset lại form đăng ký ngay lập tức để tránh bị vỡ giao diện
    resetFormUI(signUpForm);
});

// Khi bấm nút "Đăng nhập" (ở panel Overlay)
signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
    // FIX: Reset lại form đăng nhập luôn cho đồng bộ
    resetFormUI(signInForm);
});

// --- XỬ LÝ SUBMIT FORM (LOGIC GIẢ LẬP) ---

// 1. Xử lý ĐĂNG KÝ
const btnSwitchToSignIn = document.getElementById('btnSwitchToSignIn');

signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formContent = signUpForm.querySelector('.form-content');
    const successMsg = signUpForm.querySelector('.success-message');

    // Ẩn form nhập, hiện thông báo
    formContent.style.display = 'none';
    successMsg.style.display = 'flex';
});

// Nút "Đăng nhập ngay" trong thông báo thành công
if (btnSwitchToSignIn) {
    btnSwitchToSignIn.addEventListener('click', () => {
        // Trượt sang màn hình đăng nhập
        container.classList.remove("right-panel-active");
        
        // Reset lại form đăng ký sau khi hiệu ứng trượt xong (600ms)
        setTimeout(() => {
            resetFormUI(signUpForm);
        }, 600);
    });
}

// 2. Xử lý ĐĂNG NHẬP
signInForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formContent = signInForm.querySelector('.form-content');
    const successMsg = signInForm.querySelector('.success-message');
    const btnLogin = formContent.querySelector('button');
    const originalText = btnLogin.innerText;

    // Giả lập loading
    btnLogin.innerText = "Đang xử lý...";
    
    setTimeout(() => {
        formContent.style.display = 'none';
        successMsg.style.display = 'flex';
        btnLogin.innerText = originalText;
    }, 800);
});
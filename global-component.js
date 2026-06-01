// 1. ĐỊNH NGHĨA KHUNG HEADER CHUNG
class GlobalHeader extends HTMLElement {
    connectedCallback() {
        // Kiểm tra xem trang hiện tại có nằm trong folder con (case-studies) không để tự động sửa đường dẫn link
        const isSubPage = window.location.pathname.includes('/case-studies/');
        const basePath = isSubPage ? '../' : './';
        const folderPath = isSubPage ? '' : 'case-studies/';

        this.innerHTML = `
        <header class="header">
            <div class="header__overlay js-menu-overlay"></div>
            <div class="grid wide">
                <div class="row header__wrapper">
                    <div class="header__logo-col">
                        <!-- SAU NÀY MUỐN THAY LOGO CHỈ CẦN SỬA DUY NHẤT CHỮ "LOGO" Ở ĐÂY -->
                        <a href="${basePath}index.html" class="header__logo">D.T</a>
                    </div>
                    <nav class="header__nav-col">
                        <div class="header__close-btn js-menu-close"><i class="fas fa-times"></i></div>
                        <ul class="header__menu">
                            <li><a href="${basePath}index.html" class="header__link">Home</a></li>
                            <li><a href="${basePath}index.html#about" class="header__link">About me</a></li>
                            <li><a href="${basePath}index.html#experiences" class="header__link">Experience</a></li>
                            <li><a href="${basePath}index.html#portfolio" class="header__link">Portfolio</a></li>
                        </ul>
                    </nav>
                    <div class="header__actions-col">
                        <a href="${basePath}index.html#contact" class="btn header__btn-contact">Contact Me</a>
                        <div class="header__toggle-btn js-menu-open"><i class="fas fa-bars"></i></div>
                    </div>
                </div>
            </div>
        </header>
        `;
        
        // Kích hoạt tính năng đóng mở menu mobile
        this.initMobileMenu();
    }

    initMobileMenu() {
        const menuOpenBtn = this.querySelector('.js-menu-open');
        const menuCloseBtn = this.querySelector('.js-menu-close');
        const menuOverlay = this.querySelector('.js-menu-overlay');
        const navbarMenu = this.querySelector('.header__nav-col');

        function closeMobileMenu() {
            if (navbarMenu && menuOverlay) {
                navbarMenu.classList.remove('open'); menuOverlay.classList.remove('open');
            }
        }
        if (menuOpenBtn && navbarMenu && menuOverlay) {
            menuOpenBtn.addEventListener('click', () => { navbarMenu.classList.add('open'); menuOverlay.classList.add('open'); });
        }
        if (menuCloseBtn) menuCloseBtn.addEventListener('click', closeMobileMenu);
        if (menuOverlay) menuOverlay.addEventListener('click', closeMobileMenu);
    }
}

// 2. ĐỊNH NGHĨA KHUNG FOOTER CHUNG
class GlobalFooter extends HTMLElement {
    connectedCallback() {
        const isSubPage = window.location.pathname.includes('/case-studies/');
        const basePath = isSubPage ? '../' : './';

        this.innerHTML = `
        <footer class="footer">
            <div class="grid wide">
                <div class="footer__wrapper">
                    <div class="footer__logo">
                        <a href="${basePath}index.html" class="footer__logo-link">D.T</a>
                    </div>
                    <nav class="footer__nav">
                        <ul class="footer__menu">
                            <li><a href="${basePath}index.html" class="footer__link">Home</a></li>
                            <li><a href="${basePath}index.html#about" class="footer__link">About me</a></li>
                            <li><a href="${basePath}index.html#experiences" class="footer__link">Experiences</a></li>
                            <li><a href="${basePath}index.html#portfolio" class="footer__link">Portfolio</a></li>
                        </ul>
                    </nav>
                    <div class="footer__copyright">
                        <p>Designed by @duytrung Graphic Designer</p>
                    </div>
                </div>
            </div>
        </footer>
        `;
    }
}

// Đăng ký thẻ tag tùy chỉnh với trình duyệt
customElements.define('global-header', GlobalHeader);
customElements.define('global-footer', GlobalFooter);
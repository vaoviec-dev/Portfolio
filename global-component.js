// 1. HEADER CHUNG
class GlobalHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <header class="header">
            <div class="header__overlay js-menu-overlay"></div>
            <div class="grid wide">
                <div class="row header__wrapper">
                    <div class="header__logo-col"><a href="/" class="header__logo">D</a></div>
                    <nav class="header__nav-col">
                        <div class="header__close-btn js-menu-close"><i class="fas fa-times"></i></div>
                        <ul class="header__menu">
                            <li><a href="/" class="header__link">Home</a></li>
                            <li><a href="/#about" class="header__link">About me</a></li>
                            <li><a href="/#experiences" class="header__link">Experience</a></li>
                            <li><a href="/#portfolio" class="header__link">Portfolio</a></li>
                        </ul>
                    </nav>
                    <div class="header__actions-col">
                        <a href="/#contact" class="btn header__btn-contact">Contact Me</a>
                        <div class="header__toggle-btn js-menu-open"><i class="fas fa-bars"></i></div>
                    </div>
                </div>
            </div>
        </header>`;
        this.initMobileMenu();
    }

    initMobileMenu() {
        const menuOpenBtn = this.querySelector('.js-menu-open');
        const menuCloseBtn = this.querySelector('.js-menu-close');
        const menuOverlay = this.querySelector('.js-menu-overlay');
        const navbarMenu = this.querySelector('.header__nav-col');
        const closeMobileMenu = () => {
            navbarMenu?.classList.remove('open');
            menuOverlay?.classList.remove('open');
        };
        menuOpenBtn?.addEventListener('click', () => { navbarMenu?.classList.add('open'); menuOverlay?.classList.add('open'); });
        menuCloseBtn?.addEventListener('click', closeMobileMenu);
        menuOverlay?.addEventListener('click', closeMobileMenu);
    }
}

// 2. FOOTER CHUNG
class GlobalFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <footer class="footer">
            <div class="grid wide">
                <div class="footer__content">
                    <a href="/" class="footer__logo">D</a>
                    <nav class="footer__nav">
                        <ul class="footer__menu">
                            <li><a href="/">Home</a></li>
                            <li><a href="/#about">About me</a></li>
                            <li><a href="/#experiences">Experience</a></li>
                            <li><a href="/#portfolio">Portfolio</a></li>
                            <li><a href="/#contact">Contact me</a></li>
                        </ul>
                    </nav>
                    <div class="footer__bottom">
                        <p>Designed by @duytrung Graphic Designer</p>
                    </div>
                </div>
            </div>
        </footer>`;
    }
}

customElements.define('global-header', GlobalHeader);
customElements.define('global-footer', GlobalFooter);
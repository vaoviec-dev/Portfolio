// ==========================================================================
// CATEGORY-SCRIPT.JS - SCRIPT ĐIỀU KHIỂN CHUNG CHO TOÀN BỘ TRANG DANH MỤC CON
// ==========================================================================
window.addEventListener('DOMContentLoaded', () => {
    // 1. SỬA LỖI ĐÓNG / MỞ MENU NGĂN KÉO MOBILE
    setTimeout(() => {
        const toggleBtn = document.querySelector('.header__toggle-btn');
        const closeBtn = document.querySelector('.header__close-btn');
        const navbarMenu = document.querySelector('.header__nav-col');
        const menuOverlay = document.querySelector('.header__overlay');

        if (toggleBtn && navbarMenu && menuOverlay) {
            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault(); navbarMenu.classList.add('open'); menuOverlay.classList.add('open');
            });
        }
        if (closeBtn && navbarMenu && menuOverlay) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault(); navbarMenu.classList.remove('open'); menuOverlay.classList.remove('open');
            });
        }
        if (menuOverlay && navbarMenu) {
            menuOverlay.addEventListener('click', () => {
                navbarMenu.classList.remove('open'); menuOverlay.classList.remove('open');
            });
        }
    }, 200);

    // 2. LOGIC TRƯỢT HÀNG NGANG NGOÀI DANH MỤC (PC & MOBILE)
    const slider = document.querySelector('.js-slider');
    const prevBtn = document.querySelector('.slider-ctrl--prev');
    const nextBtn = document.querySelector('.slider-ctrl--next');
    let isDown = false, startX, startY, scrollLeft, isDragging = false; 

    if (slider && prevBtn && nextBtn) {
        function updateArrowStatus() {
            const currentScroll = Math.ceil(slider.scrollLeft);
            const maxScrollableWidth = slider.scrollWidth - slider.clientWidth;
            prevBtn.classList.toggle('disabled', currentScroll <= 0);
            nextBtn.classList.toggle('disabled', currentScroll >= maxScrollableWidth - 2);
        }
        function getScrollAmount() {
            const firstItem = slider.querySelector('.slider-item');
            return firstItem ? firstItem.clientWidth + 40 : 320; 
        }
        nextBtn.addEventListener('click', () => {
            slider.style.scrollBehavior = 'smooth'; slider.scrollLeft += getScrollAmount(); setTimeout(updateArrowStatus, 350);
        });
        prevBtn.addEventListener('click', () => {
            slider.style.scrollBehavior = 'smooth'; slider.scrollLeft -= getScrollAmount(); setTimeout(updateArrowStatus, 350);
        });

        const getPageX = (e) => e.type.startsWith('touch') ? e.touches[0].pageX : e.pageX;
        const getPageY = (e) => e.type.startsWith('touch') ? e.touches[0].pageY : e.pageY;

        const handleStart = (e) => {
            isDown = true; isDragging = false; slider.style.scrollBehavior = 'auto'; 
            if (e.type === 'mousedown') slider.style.cursor = 'grabbing';
            startX = getPageX(e) - slider.offsetLeft; startY = getPageY(e) - slider.offsetTop; scrollLeft = slider.scrollLeft;
        };
        const handleMove = (e) => {
            if (!isDown) return;
            const x = getPageX(e) - slider.offsetLeft; const y = getPageY(e) - slider.offsetTop;
            const distanceX = Math.abs(x - startX); const distanceY = Math.abs(y - startY);
            if (distanceX > 5 && distanceX > distanceY) {
                isDragging = true; if (e.cancelable) e.preventDefault();
                const walk = (x - startX) * 1.5; slider.scrollLeft = scrollLeft - walk;
            }
        };
        const handleEnd = () => { if (!isDown) return; isDown = false; slider.style.cursor = 'grab'; slider.style.scrollBehavior = 'smooth'; };

        slider.addEventListener('mousedown', handleStart);
        slider.addEventListener('mousemove', handleMove);
        slider.addEventListener('mouseup', handleEnd);
        slider.addEventListener('mouseleave', handleEnd);
        slider.addEventListener('touchstart', handleStart, { passive: true });
        slider.addEventListener('touchmove', handleMove, { passive: false });
        slider.addEventListener('touchend', handleEnd);
        slider.addEventListener('scroll', updateArrowStatus);
        window.addEventListener('resize', updateArrowStatus);
    }

    // 3. LOGIC POPUP LIGHTBOX PHÓNG TO & ĐÈ CHUỘT VUỐT ẢNH TRONG POPUP
    const modal = document.querySelector('.js-lightbox-modal');
    const modalImg = document.querySelector('.js-lightbox-img');
    const modalCaption = document.querySelector('.js-lightbox-caption');
    const modalCounter = document.querySelector('.js-lightbox-counter');
    const modalClose = document.querySelector('.js-lightbox-close');
    const modalPrev = document.querySelector('.js-lightbox-prev');
    const modalNext = document.querySelector('.js-lightbox-next');
    const dragZone = document.querySelector('.js-lightbox-drag-zone');
    const triggers = document.querySelectorAll('.js-lightbox-trigger');
    
    let currentAlbum = [], currentIndex = 0, albumTitle = "";   
    let popupIsDown = false, popupStartX = 0; 

    function updateLightboxImage() {
        modalImg.src = currentAlbum[currentIndex].trim();
        modalCaption.textContent = albumTitle;
        modalCounter.textContent = `${currentIndex + 1} / ${currentAlbum.length}`;
        const isSingleImg = currentAlbum.length <= 1;
        modalPrev.classList.toggle('hidden', isSingleImg);
        modalNext.classList.toggle('hidden', isSingleImg);
    }

    triggers.forEach(trigger => {
        const triggerOpen = (e) => {
            if (isDragging) return; 
            albumTitle = trigger.getAttribute('data-title');
            const imagesAttr = trigger.getAttribute('data-images');
            if (imagesAttr) {
                currentAlbum = imagesAttr.split(','); currentIndex = 0; updateLightboxImage();
                modal.classList.add('open'); document.body.style.overflow = 'hidden'; 
            }
        };
        trigger.addEventListener('mouseup', (e) => { if (e.button === 0) triggerOpen(e); });
        trigger.addEventListener('touchend', triggerOpen);
    });

    if (dragZone) {
        const getPopupX = (e) => e.type.startsWith('touch') ? e.changedTouches[0].pageX : e.pageX;
        const popupDragStart = (e) => { popupIsDown = true; popupStartX = getPopupX(e); };
        const popupDragEnd = (e) => {
            if (!popupIsDown) return; popupIsDown = false;
            const popupEndX = getPopupX(e); const differenceX = popupEndX - popupStartX;
            if (differenceX > 40 && currentAlbum.length > 1) {
                currentIndex = (currentIndex - 1 + currentAlbum.length) % currentAlbum.length; updateLightboxImage();
            } else if (differenceX < -40 && currentAlbum.length > 1) {
                currentIndex = (currentIndex + 1) % currentAlbum.length; updateLightboxImage();
            }
        };
        dragZone.addEventListener('mousedown', popupDragStart);
        dragZone.addEventListener('mouseup', popupDragEnd);
        dragZone.addEventListener('touchstart', popupDragStart, { passive: true });
        dragZone.addEventListener('touchend', popupDragEnd);
    }

    if (modalClose) modalClose.addEventListener('click', closeLightbox);
    if (modalNext) modalNext.addEventListener('click', () => { currentIndex = (currentIndex + 1) % currentAlbum.length; updateLightboxImage(); });
    if (modalPrev) modalPrev.addEventListener('click', () => { currentIndex = (currentIndex - 1 + currentAlbum.length) % currentAlbum.length; updateLightboxImage(); });
    
    // 🚀 CHUẨN FIX: BẮT SỰ KIỆN CLICK ĐÓNG POPUP THÔNG MINH KHI ẤN RA NGOÀI VÙNG TRỐNG
    if (modal) {
        modal.addEventListener('click', (e) => {
            // Kiểm tra xem vị trí click có thuộc vùng ảnh kéo, vùng caption chữ hay thanh nút đáy không
            const isInsideDragZone = e.target.closest('.js-lightbox-drag-zone');
            const isInsideControls = e.target.closest('.lightbox-controls-bar');
            const isCaption = e.target.closest('.js-lightbox-caption');
            
            // Nếu click ra ngoài hoàn toàn các khối trên, thực hiện đóng popup
            if (!isInsideDragZone && !isInsideControls && !isCaption) {
                closeLightbox();
            }
        });
    }

    function closeLightbox() { modal.classList.remove('open'); document.body.style.overflow = ''; }

    document.addEventListener('keydown', (e) => {
        if (!modal || !modal.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight' && currentAlbum.length > 1) modalNext.click();
        if (e.key === 'ArrowLeft' && currentAlbum.length > 1) modalPrev.click();
    });
});
// ==========================================================================
        // CẬP NHẬT SỬA LỖI XUNG ĐỘT: DRAG TO SCROLL VS CLICK MODAL
        // ==========================================================================
        const slider = document.querySelector('.js-slider');
        const prevBtn = document.querySelector('.slider-ctrl--prev');
        const nextBtn = document.querySelector('.slider-ctrl--next');

        if (slider && prevBtn && nextBtn) {
            
            function updateArrowStatus() {
                const scrollLeft = Math.ceil(slider.scrollLeft);
                const maxScrollableWidth = slider.scrollWidth - slider.clientWidth;
                prevBtn.classList.toggle('disabled', scrollLeft <= 0);
                nextBtn.classList.toggle('disabled', scrollLeft >= maxScrollableWidth - 2);
            }

            function getScrollAmount() {
                const firstItem = slider.querySelector('.slider-item');
                return firstItem ? firstItem.clientWidth + 20 : 320; 
            }

            nextBtn.addEventListener('click', () => {
                slider.style.scrollBehavior = 'smooth';
                slider.scrollLeft += getScrollAmount();
                setTimeout(updateArrowStatus, 350);
            });

            prevBtn.addEventListener('click', () => {
                slider.style.scrollBehavior = 'smooth';
                slider.scrollLeft -= getScrollAmount();
                setTimeout(updateArrowStatus, 350);
            });

            // LOGIC KÉO CHUỘT SỬA LỖI NUỐT SỰ KIỆN CLICK
            let isDown = false;
            let startX, startY; // Lấy cả tọa độ Y để tính toán chính xác
            let scrollLeft;
            let isDragging = false; 

            slider.addEventListener('mousedown', (e) => {
                isDown = true;
                isDragging = false;
                slider.style.cursor = 'grabbing';
                slider.style.scrollBehavior = 'auto'; 
                startX = e.pageX - slider.offsetLeft;
                startY = e.pageY - slider.offsetTop;
                scrollLeft = slider.scrollLeft;
            });

            slider.addEventListener('mouseleave', () => {
                if (!isDown) return;
                isDown = false;
                slider.style.cursor = 'pointer';
                slider.style.scrollBehavior = 'smooth';
            });

            slider.addEventListener('mouseup', (e) => {
                isDown = false;
                slider.style.cursor = 'pointer';
                slider.style.scrollBehavior = 'smooth';
            });

            slider.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                
                const x = e.pageX - slider.offsetLeft;
                const y = e.pageY - slider.offsetTop;
                
                // Tính toán khoảng cách chuột dịch chuyển thực tế
                const distanceX = Math.abs(x - startX);
                const distanceY = Math.abs(y - startY);
                
                // 🚀 CHỈ COI LÀ ĐANG KÉO DỰ ÁN NẾU TAY DI CHUYỂN HƠN 8 PIXEL
                if (distanceX > 8 || distanceY > 8) {
                    isDragging = true;
                    e.preventDefault();
                    const walk = (x - startX) * 1.5; 
                    slider.scrollLeft = scrollLeft - walk;
                }
            });

            slider.addEventListener('scroll', updateArrowStatus);
            window.addEventListener('resize', updateArrowStatus);
        }

        // --- 2. SỬA ĐỔI SỰ KIỆN KÍCH HOẠT LIGHTBOX MODAL ---
        const modal = document.querySelector('.js-lightbox-modal');
        const modalImg = document.querySelector('.js-lightbox-img');
        const modalCaption = document.querySelector('.js-lightbox-caption');
        const modalCounter = document.querySelector('.js-lightbox-counter');
        const modalClose = document.querySelector('.js-lightbox-close');
        const modalPrev = document.querySelector('.js-lightbox-prev');
        const modalNext = document.querySelector('.js-lightbox-next');
        const triggers = document.querySelectorAll('.js-lightbox-trigger');

        let currentAlbum = []; 
        let currentIndex = 0;  
        let albumTitle = "";   

        function updateLightboxImage() {
            modalImg.src = currentAlbum[currentIndex].trim();
            modalCaption.textContent = albumTitle;
            modalCounter.textContent = `${currentIndex + 1} / ${currentAlbum.length}`;
            const isSingleImg = currentAlbum.length <= 1;
            modalPrev.classList.toggle('hidden', isSingleImg);
            modalNext.classList.toggle('hidden', isSingleImg);
        }

        // 🚀 THAY ĐỔI QUAN TRỌNG: Lắng nghe sự kiện 'mouseup' thay vì 'click' để đồng bộ với bộ kéo
        triggers.forEach(trigger => {
            trigger.addEventListener('mouseup', (e) => {
                // Nếu chuột di chuyển quá nhiều (đang kéo slide) -> Thoát, không mở modal
                if (slider.style.cursor === 'grabbing' && Math.abs(e.pageX - (startX + slider.offsetLeft)) > 8) {
                    return;
                }
                
                // Bấm chuột trái chuẩn chỉnh (không kéo) -> Kích hoạt bung lụa modal ngay!
                if (e.button === 0) { 
                    albumTitle = trigger.getAttribute('data-title');
                    const imagesAttr = trigger.getAttribute('data-images');
                    
                    if (imagesAttr) {
                        currentAlbum = imagesAttr.split(','); 
                        currentIndex = 0; 
                        updateLightboxImage();
                        modal.classList.add('open');
                        document.body.style.overflow = 'hidden'; 
                    }
                }
            });
        });

        // Hàng loạt logic Đóng/Next/Prev ở dưới giữ nguyên...
        function closeLightbox() {
            modal.classList.remove('open');
            document.body.style.overflow = ''; 
        }
        modalClose.addEventListener('click', closeLightbox);
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target === document.querySelector('.lightbox-content')) {
                closeLightbox();
            }
        });
        modalNext.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % currentAlbum.length;
            updateLightboxImage();
        });
        modalPrev.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + currentAlbum.length) % currentAlbum.length;
            updateLightboxImage();
        });
        document.addEventListener('keydown', (e) => {
            if (!modal.classList.contains('open')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight' && currentAlbum.length > 1) modalNext.click();
            if (e.key === 'ArrowLeft' && currentAlbum.length > 1) modalPrev.click();
        });
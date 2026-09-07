document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle & Auto-Close
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Close mobile menu when clicking any nav link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = menuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // 2. Scrollspy - Auto switch active navbar item on scroll
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

    function highlightNavOnScroll() {
        const scrollPosition = window.scrollY + 140;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavOnScroll);
    highlightNavOnScroll();

    // 3. Smooth Scroll to Anchors with Header Offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 90;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Live Category Filtering in "Daftar Semua Buku"
    const filterButtons = document.querySelectorAll('#category-filter-bar .filter-btn');
    const bookCards = document.querySelectorAll('#all-books-grid .book-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            bookCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.style.display = 'flex';
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 5. Quick Search Bar in Hero & Catalog Filter
    const heroSearchInput = document.getElementById('hero-search-input');
    if (heroSearchInput) {
        heroSearchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();

            // Auto scroll to catalog if user starts typing
            if (query.length === 1) {
                const catalogSection = document.querySelector('#daftar-buku');
                if (catalogSection) {
                    catalogSection.scrollIntoView({ behavior: 'smooth' });
                }
            }

            bookCards.forEach(card => {
                const title = (card.getAttribute('data-title') || '').toLowerCase();
                const author = (card.getAttribute('data-author') || '').toLowerCase();
                const category = (card.getAttribute('data-category') || '').toLowerCase();

                if (title.includes(query) || author.includes(query) || category.includes(query)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // 6. Book Detail & Borrow Modal
    const bookModal = document.getElementById('book-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalConfirmBtn = document.getElementById('modal-confirm-btn');

    let currentSelectedBookTitle = '';

    function openBookModal(title, author, category, imgBg, isBorrowed) {
        currentSelectedBookTitle = title;
        document.getElementById('modal-book-title').textContent = title;
        document.getElementById('modal-book-author').textContent = `Penulis: ${author}`;
        document.getElementById('modal-book-cat').textContent = category;
        document.getElementById('modal-book-img').style.backgroundImage = imgBg;

        if (isBorrowed) {
            modalConfirmBtn.disabled = true;
            modalConfirmBtn.innerHTML = '<i class="fa-solid fa-clock"></i> Sedang Dipinjam';
            modalConfirmBtn.style.opacity = '0.6';
        } else {
            modalConfirmBtn.disabled = false;
            modalConfirmBtn.innerHTML = '<i class="fa-solid fa-check"></i> Konfirmasi Peminjaman';
            modalConfirmBtn.style.opacity = '1';
        }

        if (bookModal) {
            bookModal.classList.add('active');
        }
    }

    function closeBookModal() {
        if (bookModal) {
            bookModal.classList.remove('active');
        }
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeBookModal);
    }

    if (bookModal) {
        bookModal.addEventListener('click', (e) => {
            if (e.target === bookModal) closeBookModal();
        });
    }

    // Bind all Pinjam & Detail buttons
    document.addEventListener('click', (e) => {
        const pinjamBtn = e.target.closest('.btn-pinjam');
        const detailBtn = e.target.closest('.btn-detail');

        if (pinjamBtn || detailBtn) {
            const card = (pinjamBtn || detailBtn).closest('.book-card');
            if (card) {
                const title = card.getAttribute('data-title') || 'Buku';
                const author = card.getAttribute('data-author') || 'Penulis';
                const category = card.querySelector('.book-category')?.textContent || 'Kategori';
                const coverStyle = card.querySelector('.book-cover')?.style.backgroundImage || '';
                const isBorrowed = card.querySelector('.stock-dot.borrowed') !== null;

                openBookModal(title, author, category, coverStyle, isBorrowed);
            }
        }
    });

    if (modalConfirmBtn) {
        modalConfirmBtn.addEventListener('click', () => {
            closeBookModal();
            showToast(`Permintaan peminjaman untuk "${currentSelectedBookTitle}" berhasil dikirim!`);
        });
    }

    // 7. Contact Form Handler
    const contactForm = document.getElementById('contact-form-el');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Pesan Anda telah berhasil terkirim! Tim kami akan merespons segera.');
            contactForm.reset();
        });
    }

    // 8. Floating Back-to-Top Button
    const backToTopBtn = document.getElementById('back-to-top-btn');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 350) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 9. Toast Notification Helper
    window.showToast = function (message) {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--emerald); font-size: 1.2rem;"></i> ${message}`;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-30px)';
            toast.style.transition = 'all 0.4s ease';
            setTimeout(() => toast.remove(), 400);
        }, 3500);
    };

    // 10. Lightbox Helper Functions
    window.openLightbox = function (imgSrc, title) {
        const lightboxModal = document.getElementById('lightbox-modal');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxTitle = document.getElementById('lightbox-title');

        if (lightboxModal && lightboxImg && lightboxTitle) {
            lightboxImg.src = imgSrc;
            lightboxTitle.textContent = title;
            lightboxModal.classList.add('active');
        }
    };

    window.closeLightbox = function () {
        const lightboxModal = document.getElementById('lightbox-modal');
        if (lightboxModal) {
            lightboxModal.classList.remove('active');
        }
    };

    const lightboxModal = document.getElementById('lightbox-modal');
    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) closeLightbox();
        });
    }

    // 11. Reveal Animation on Scroll
    const revealElements = document.querySelectorAll('.book-card, .category-card, .gallery-item, .team-member, .stat-item');

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.1
    });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        revealObserver.observe(el);
    });
});

// Helper for card category click
function filterCategoryFromCard(categoryFilter) {
    const catalogSection = document.querySelector('#daftar-buku');
    if (catalogSection) {
        catalogSection.scrollIntoView({ behavior: 'smooth' });
    }

    setTimeout(() => {
        const targetBtn = document.querySelector(`#category-filter-bar .filter-btn[data-filter="${categoryFilter}"]`);
        if (targetBtn) {
            targetBtn.click();
        }
    }, 400);
}

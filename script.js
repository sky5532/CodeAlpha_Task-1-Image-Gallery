/*
script.js
Powers the Image Gallery's interactivity:
- Click a thumbnail to open it in a full-screen lightbox
- Next/Prev buttons cycle through the currently visible images
- Close via the X button or clicking outside the image
- Filter buttons show/hide images by category
*/

const VALID_FILTERS = new Set(['all', 'nature', 'people', 'places']);
const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const closeBtn = document.getElementById('closeBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const filterBtns = document.querySelectorAll('.filter-btn');

let currentVisibleIndex = 0;
let activeFilter = 'all';

function getVisibleItems() {
    return galleryItems.filter((item) => activeFilter === 'all' || item.dataset.category === activeFilter);
}

function updateLightboxImage() {
    const visibleItems = getVisibleItems();

    if (!visibleItems.length) {
        lightbox.classList.remove('active');
        return;
    }

    if (currentVisibleIndex < 0) {
        currentVisibleIndex = visibleItems.length - 1;
    }

    if (currentVisibleIndex >= visibleItems.length) {
        currentVisibleIndex = 0;
    }

    const selectedItem = visibleItems[currentVisibleIndex];
    const image = selectedItem.querySelector('img');

    if (image) {
        lightboxImg.src = image.src;
        lightboxImg.alt = image.alt;
    }
}

galleryItems.forEach((item) => {
    const image = item.querySelector('img');

    image.addEventListener('click', () => {
        const visibleItems = getVisibleItems();
        currentVisibleIndex = visibleItems.indexOf(item);

        if (currentVisibleIndex === -1) {
            currentVisibleIndex = 0;
        }

        updateLightboxImage();
        lightbox.classList.add('active');
    });
});

closeBtn.addEventListener('click', () => {
    lightbox.classList.remove('active');
});

nextBtn.addEventListener('click', () => {
    const visibleItems = getVisibleItems();

    if (!visibleItems.length) {
        return;
    }

    currentVisibleIndex = (currentVisibleIndex + 1) % visibleItems.length;
    updateLightboxImage();
});

prevBtn.addEventListener('click', () => {
    const visibleItems = getVisibleItems();

    if (!visibleItems.length) {
        return;
    }

    currentVisibleIndex = (currentVisibleIndex - 1 + visibleItems.length) % visibleItems.length;
    updateLightboxImage();
});

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.classList.remove('active');
    }
});

filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const rawFilter = btn.dataset.filter;
        activeFilter = VALID_FILTERS.has(rawFilter) ? rawFilter : 'all';

        galleryItems.forEach((item) => {
            const isVisible = activeFilter === 'all' || item.dataset.category === activeFilter;
            item.style.display = isVisible ? 'block' : 'none';
        });

        currentVisibleIndex = 0;
        updateLightboxImage();
    });
});
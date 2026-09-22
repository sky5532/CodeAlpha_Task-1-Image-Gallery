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

const menuDots = document.getElementById('menuDots');
const dropdownMenu = document.getElementById('dropdownMenu');

menuDots.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('active');
});

document.addEventListener('click', () => {
    dropdownMenu.classList.remove('active');
});

const hamburgerBtn = document.getElementById('hamburgerBtn');
const sideMenu = document.getElementById('sideMenu');

hamburgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    sideMenu.classList.toggle('active');
});

document.addEventListener('click', () => {
    sideMenu.classList.remove('active');
});

const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();

    galleryItems.forEach((item) => {
        const category = item.dataset.category.toLowerCase();
        if (category.includes (searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
})

const sideMenuItems = document.querySelectorAll('.side-menu-item');

sideMenuItems.forEach((item) => {
    item.addEventListener('click', () => {
        alert(`${item.textContent} view is coming soon!`);
        sideMenu.classList.remove('active');
    });
});

const navBtns = document.querySelectorAll('.nav-btn[data-tab]');
const galleryEl = document.querySelector('.gallery');
const filtersEl = document.querySelector('.filters');
const albumsView = document.getElementById('albumsView');

navBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        navBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        
        const tab = btn.dataset.tab;
        
        if (tab === 'photos') {
           galleryEl.style.display = 'grid';
           filtersEl.style.display = 'flex';
           albumsView.classList.remove('active');
        } else if (tab === 'albums') {
            galleryEl.style.display = 'none';
            filtersEl.style.display = 'none';
            albumsView.classList.add('active');
        }
        });
    });

const albumCards = document.querySelectorAll('.album-card');

albumCards.forEach((card) => {
    card.addEventListener('click', () => {
        const album = card.dataset.album;

        activeFilter = VALID_FILTERS.has(album) ? album : 'all';

        filterBtns.forEach((b) => {
            b.classList.toggle('active', b.dataset.filter === activeFilter);
        });
        galleryItems.forEach((item) => {
            const isVisible = activeFilter === 'all' || item.dataset.category === activeFilter;
            item.style.display = isVisible ? 'block' : 'none';
        });

        navBtns.forEach((b) => b.classList.remove('active'));
        document.querySelector('.nav-btn[data-tab="photos"]').classList.add('active');

        galleryEl.style.display = 'grid';
        filtersEl.style.display = 'flex';
        albumsView.classList.remove('active');
    });
});

// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Close Mobile Menu on Link Click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu) navMenu.classList.remove('active');
    });
});

// Photo Gallery Filter Function
function filterGallery(category, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) {
        btn.classList.add('active');
    } else {
        const match = document.querySelector(`.filter-btn[data-filter="${category}"]`);
        if (match) match.classList.add('active');
    }

    let visible = 0;
    document.querySelectorAll('.gallery-item').forEach(item => {
        const show = category === 'all' || item.classList.contains(category);
        item.style.display = show ? 'block' : 'none';
        if (show) visible++;
    });
    const empty = document.getElementById('galleryEmpty');
    if (empty) empty.style.display = visible ? 'none' : 'block';
}

// Photo Lightbox (works on currently visible gallery photos)
let lbItems = [];
let lbIndex = 0;

function openLightbox(item) {
    lbItems = Array.from(document.querySelectorAll('.gallery-item')).filter(i => i.style.display !== 'none');
    lbIndex = lbItems.indexOf(item);
    showLightbox();
    document.getElementById('lightbox').classList.add('open');
}

function showLightbox() {
    const item = lbItems[lbIndex];
    if (!item) return;
    const img = item.querySelector('img');
    document.getElementById('lbImg').src = img.src;
    document.getElementById('lbCaption').innerText =
        item.querySelector('h4').innerText + ' (' + (lbIndex + 1) + '/' + lbItems.length + ')';
}

function stepLightbox(dir) {
    if (!lbItems.length) return;
    lbIndex = (lbIndex + dir + lbItems.length) % lbItems.length;
    showLightbox();
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('open');
}

document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => openLightbox(item));
});

document.addEventListener('keydown', e => {
    const lb = document.getElementById('lightbox');
    if (!lb || !lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') stepLightbox(-1);
    if (e.key === 'ArrowRight') stepLightbox(1);
});

const lightboxEl = document.getElementById('lightbox');
if (lightboxEl) {
    lightboxEl.addEventListener('click', e => {
        if (e.target.id === 'lightbox') closeLightbox();
    });
}

// Cost Calculator Logic
function calculateCost() {
    const length = parseFloat(document.getElementById('plotLength').value) || 0;
    const fencingType = document.getElementById('fencingType').value;
    const spacing = parseFloat(document.getElementById('postSpacing').value) || 10;

    if (length <= 0) {
        alert('Kripya valid boundary length (Feet) enter karein.');
        return;
    }

    // Pole Count Calculation
    const poles = Math.ceil(length / spacing) + 1;
    document.getElementById('postCount').innerText = `${poles} Concrete/Iron Poles`;

    // Price Multipliers Per Feet
    let rateMin = 0;
    let rateMax = 0;

    switch(fencingType) {
        case 'chainlink':
            rateMin = 100; rateMax = 130;
            break;
        case 'barbed':
            rateMin = 60; rateMax = 85;
            break;
        case 'precast':
            rateMin = 220; rateMax = 280;
            break;
        case 'razor':
            rateMin = 140; rateMax = 180;
            break;
    }

    const minTotal = (length * rateMin).toLocaleString('en-IN');
    const maxTotal = (length * rateMax).toLocaleString('en-IN');

    document.getElementById('materialCost').innerText = `₹${minTotal} - ₹${maxTotal}`;
}

// Redirect Calculator Result to WhatsApp
function sendCalcToWhatsApp() {
    const length = document.getElementById('plotLength').value;
    const type = document.getElementById('fencingType').options[document.getElementById('fencingType').selectedIndex].text;
    
    const msg = `Hello V.S. Enterprises,%0A%0AI want a quote for my plot boundary:%0A- Total Perimeter: ${length} Feet%0A- Fencing Type: ${type}%0A%0APlease send me detailed rate quotation.`;
    window.open(`https://wa.me/916260362038?text=${msg}`, '_blank');
}

// Modal Popup Control
let selectedProduct = '';

function openModal(productName) {
    selectedProduct = productName;
    document.getElementById('modalProductName').innerText = `Enquire Price: ${productName}`;
    document.getElementById('inquiryModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('inquiryModal').style.display = 'none';
}

function handleModalSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('modalName').value;
    const qty = document.getElementById('modalQty').value;

    const msg = `Hello V.S. Enterprises,%0A%0AMy name is ${name}. I am interested in *${selectedProduct}*.%0ARequired Quantity/Feet: ${qty}.%0APlease share wholesale rates.`;
    window.open(`https://wa.me/917471162318?text=${msg}`, '_blank');
    closeModal();
}

// Contact Form Handler
function handleFormSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('custName').value;
    const phone = document.getElementById('custPhone').value;
    const city = document.getElementById('custCity').value;
    const msg = document.getElementById('custMsg').value;

    const fullMsg = `Hello V.S. Enterprises,%0A%0A*New Website Inquiry:*%0A- Name: ${name}%0A- Phone: ${phone}%0A- Location: ${city}%0A- Requirement: ${msg}`;
    
    window.open(`https://wa.me/916260362038?text=${fullMsg}`, '_blank');
}

// Close Modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('inquiryModal');
    if (event.target == modal) {
        closeModal();
    }
}

const tabs = document.querySelectorAll('[data-tab-target]');
const tabContents = document.querySelectorAll('[data-tab-content]');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = document.querySelector(tab.dataset.tabTarget);
        
        tabContents.forEach(tabContent => {
            tabContent.classList.remove('active');
        });
        
        tabs.forEach(t => {
            t.classList.remove('active');
        });
        
        tab.classList.add('active');
        target.classList.add('active');
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const tripButtons = document.querySelectorAll('#Hobbies .trip-btn');
    const tripSections = document.querySelectorAll('#Hobbies .gallery-section');

    tripButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active state from all buttons
            tripButtons.forEach(btn => btn.classList.remove('active'));
            // Hide all trip sections
            tripSections.forEach(section => section.style.display = 'none');

            // Activate clicked button and show matching section
            button.classList.add('active');
            const trip = button.getAttribute('data-trip');
            document.getElementById(trip).style.display = 'block';
        });
    });
});

// Image expansion modal
document.addEventListener("DOMContentLoaded", () => {
    const images = document.querySelectorAll('#Hobbies .gallery img');
    
    images.forEach(img => {
        img.addEventListener('click', () => {
            openModal(img.src, img.alt);
        });
    });

    // Close modal when clicking the overlay or close button
    const modal = document.getElementById('imageModal');
    modal.addEventListener('click', (e) => {
        if (e.target.id === 'imageModal' || e.target.classList.contains('close-modal')) {
            modal.style.display = 'none';
        }
    });
});

function openModal(src, alt) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    const caption = document.getElementById('modalCaption');

    modal.style.display = 'flex';
    modalImg.src = src;
    caption.textContent = alt;
}

document.addEventListener("DOMContentLoaded", () => {
    // --- Tab Switching Logic ---
    const tabs = document.querySelectorAll('[data-tab-target]');
    const tabContents = document.querySelectorAll('[data-tab-content]');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = document.querySelector(tab.dataset.tabTarget);
            tabContents.forEach(tc => tc.classList.remove('active'));
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            target.classList.add('active');
        });
    });

    // --- Trip Buttons Toggle ---
    const tripButtons = document.querySelectorAll('#Hobbies .trip-btn');
    const tripSections = document.querySelectorAll('#Hobbies .gallery-section');

    tripButtons.forEach(button => {
        button.addEventListener('click', () => {
            tripButtons.forEach(btn => btn.classList.remove('active'));
            tripSections.forEach(section => section.style.display = 'none');
            button.classList.add('active');
            const trip = button.getAttribute('data-trip');
            document.getElementById(trip).style.display = 'block';
        });
    });

    // --- Image Modal ---
    const images = document.querySelectorAll('#Hobbies .gallery img');
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    const caption = document.getElementById('modalCaption');

    images.forEach(img => {
        img.addEventListener('click', () => {
            openModal(img.src, img.alt);
        });
    });

    modal.addEventListener('click', (e) => {
        if (e.target.id === 'imageModal' || e.target.classList.contains('close-modal')) {
            modal.style.display = 'none';
        }
    });

    function openModal(src, alt) {
        modal.style.display = 'flex';
        modalImg.src = src;
        caption.textContent = alt;
    }
});

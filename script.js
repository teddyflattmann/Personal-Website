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
    const tripButtons = document.querySelectorAll('#personal .trip-btn');
    const tripSections = document.querySelectorAll('#personal .gallery-section');

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

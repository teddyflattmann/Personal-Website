// script.js
function init() {
  // Tab Switching Logic
  const tabs = document.querySelectorAll('[data-tab-target]');
  const tabContents = document.querySelectorAll('[data-tab-content]');

  tabs.forEach(tab => {
    // Remove any old listeners first (in case init runs twice)
    tab.replaceWith(tab.cloneNode(true));
  });

  // Re-query after cloneNode
  const freshTabs = document.querySelectorAll('[data-tab-target]');
  freshTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabContents.forEach(tc => tc.classList.remove('active'));
      freshTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelector(tab.dataset.tabTarget).classList.add('active');
    });
  });

  // Trip Buttons Toggle
  const tripButtons = document.querySelectorAll('#Hobbies .trip-btn');
  const tripSections = document.querySelectorAll('#Hobbies .gallery-section');

  tripButtons.forEach(btn => {
    btn.replaceWith(btn.cloneNode(true));
  });

  const freshBtns = document.querySelectorAll('#Hobbies .trip-btn');
  freshBtns.forEach(button => {
    button.addEventListener('click', () => {
      freshBtns.forEach(b => b.classList.remove('active'));
      tripSections.forEach(section => section.style.display = 'none');
      button.classList.add('active');
      document.getElementById(button.getAttribute('data-trip')).style.display = 'block';
    });
  });

  // Image Modal
  const images = document.querySelectorAll('#Hobbies .gallery img');
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImg');
  const caption = document.getElementById('modalCaption');

  images.forEach(img => {
    img.replaceWith(img.cloneNode(true));
  });

  document.querySelectorAll('#Hobbies .gallery img')
    .forEach(img => {
      img.addEventListener('click', () => openModal(img.src, img.alt));
    });

  modal.addEventListener('click', e => {
    if (e.target.id === 'imageModal' || e.target.classList.contains('close-modal')) {
      modal.style.display = 'none';
    }
  });

  function openModal(src, alt) {
    modal.style.display = 'flex';        
    modalImg.src = src;
    caption.textContent = alt;
  }
}

// fire on first load
window.addEventListener('DOMContentLoaded', init);
// …and also whenever the page is restored from bfcache
window.addEventListener('pageshow', event => {
  if (event.persisted) {
    init();
  }
});


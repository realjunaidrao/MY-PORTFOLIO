// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Form Submission handling (prevents page refresh)
// Replace this URL with the Web App URL you copied from Google Apps Script
const scriptURL = 'https://script.google.com/macros/s/AKfycbyiEM2Bc10glaypkiR1ft000JCagTMm1jWrVSqrA0oOgaV0HWzxjuEyDE8_juMGjCtTTw/exec';
const form = document.forms['contactForm'];
const submitBtn = document.getElementById('submitBtn');
const formStatus = document.getElementById('formStatus');

form.addEventListener('submit', async e => {
    e.preventDefault(); // Prevent default page refresh

    const originalBtnText = submitBtn.innerHTML;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    formStatus.textContent = 'Sending your feedback...';

    try {
        await fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors',
            body: new URLSearchParams(new FormData(form))
        });

        formStatus.textContent = 'Request finished without a readable confirmation. Check the Feedback sheet before retrying.';
    } catch (error) {
        console.error('Feedback submission failed:', error);
        formStatus.textContent = 'Could not send your feedback. Please check your connection and try again.';
    } finally {
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    }
});

const stars = document.querySelectorAll('.star');
const button = document.getElementById('toggle-lights');

button.addEventListener('click', () => {
    stars.forEach(star => {
        star.classList.toggle('hidden');
    });
});
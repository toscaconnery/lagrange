const modal = document.getElementById('modal-confirm');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const confirmBtn = document.getElementById('modal-confirm-btn');
const cancelBtn = document.getElementById('modal-cancel-btn');

let resolvePromise = null;

window.showConfirmModal = ({ title = 'Are you sure?', message = 'This action cannot be undone.' } = {}) => {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.style.display = 'flex';

    return new Promise((resolve) => {
        resolvePromise = resolve;
    });
};

confirmBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    if (resolvePromise) resolvePromise(true);
});

cancelBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    if (resolvePromise) resolvePromise(false);
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        if (resolvePromise) resolvePromise(false);
    }
});
document.getElementById('add-user-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = document.getElementById('submit-btn');
    const errorEl = document.getElementById('form-error');
    btn.disabled = true;
    btn.textContent = 'Saving...';
    errorEl.style.display = 'none';

    const body = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
    };

    try {
        const res = await fetch('/api/v1/users/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        if (!res.ok) {
            errorEl.textContent = data.message ?? 'Something went wrong.';
            errorEl.style.display = 'block';
            return;
        }

        window.location.href = '/users/list';
    } catch (err) {
        errorEl.textContent = 'Network error. Please try again.';
        errorEl.style.display = 'block';
    } finally {
        btn.disabled = false;
        btn.textContent = 'Add User';
    }
});
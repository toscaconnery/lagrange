document.getElementById('add-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = document.getElementById('submit-btn');
    const errorEl = document.getElementById('form-error');
    btn.disabled = true;
    btn.textContent = 'Saving...';
    errorEl.style.display = 'none';

    const body = {
        name: document.getElementById('name').value.trim(),
    };

    try {
        const res = await fetch('/api/v1/pools/add-user', {
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

        window.location.href = '/pools/list-user';
    } catch (err) {
        errorEl.textContent = 'Network error. Please try again.';
        errorEl.style.display = 'block';
    } finally {
        btn.disabled = false;
        btn.textContent = 'Add User';
    }
});
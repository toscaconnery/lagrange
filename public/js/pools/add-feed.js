document.getElementById('add-feed-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = document.getElementById('submit-btn');
    const errorEl = document.getElementById('form-error');
    btn.disabled = true;
    btn.textContent = 'Saving...';
    errorEl.style.display = 'none';

    const body = {
        name: document.getElementById('name').value.trim(),
        type: document.getElementById('type').value.trim(),
        weight: document.getElementById('weight').value.trim(),
    };

    try {
        const res = await fetch('/api/v1/pools/add-feed', {
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

        window.location.href = '/pools/list-feed';
    } catch (err) {
        errorEl.textContent = 'Network error. Please try again.';
        errorEl.style.display = 'block';
    } finally {
        btn.disabled = false;
        btn.textContent = 'Add Feed';
    }
});
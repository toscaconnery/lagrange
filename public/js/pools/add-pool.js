document.getElementById('add-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = document.getElementById('submit-btn');
    const errorEl = document.getElementById('form-error');
    btn.disabled = true;
    btn.textContent = 'Saving...';
    errorEl.style.display = 'none';

    const body = {
        label: document.getElementById('label').value.trim(),
        owner: document.getElementById('owner').value.trim()
    };

    try {
        console.log('--- body : ', body)
        const res = await fetch('/api/v1/pools/add-pool', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        window.location.href = '/pools/list';
    } catch (err) {
        errorEl.textContent = 'Network error. Please try again.';
        errorEl.style.display = 'block';
    } finally {
        btn.disabled = false;
        btn.textContent = 'Add User';
    }
});
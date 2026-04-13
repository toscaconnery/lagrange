document.getElementById('manage-pool-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = document.getElementById('submit-btn');
    const errorEl = document.getElementById('form-error');
    btn.disabled = true;
    btn.textContent = 'Saving...';
    errorEl.style.display = 'none';

    const body = {
        pool_id: document.getElementById('pool_id').value.trim(),
        manager: document.getElementById('manager').value.trim(),
    };

    try {
        console.log('--- body : ', body)
        const res = await fetch('/api/v1/pools/manage-pool', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        console.log('///// res : ', res)
        const data = await res.json()
        console.log('parsed:', data)

        window.location.href = `/pools/details/${body.pool_id}`;
    } catch (err) {
        errorEl.textContent = 'Network error. Please try again.';
        errorEl.style.display = 'block';
    } finally {
        btn.disabled = false;
        btn.textContent = 'Save';
    }
});
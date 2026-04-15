document.getElementById('start-pool-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = document.getElementById('submit-btn');
    const errorEl = document.getElementById('form-error');
    btn.disabled = true;
    btn.textContent = 'Saving...';
    errorEl.style.display = 'none';

    const body = {
        pool_id: document.getElementById('pool_id').value.trim(),
        fish_count: document.getElementById('fish_count').value.trim(),
        fish_type: document.getElementById('fish_type').value.trim(),
    };

    try {
        console.log('🔥 pool start data: ', body)
        const res = await fetch('/api/v1/pools/start-pool', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const data = await res.json();
        console.log('start pool result : ----- ', data)

        if (!res.ok) {
            errorEl.textContent = data.message ?? 'Something went wrong.';
            errorEl.style.display = 'block';
            return;
        }

        window.location.href = `/pools/list`;
    } catch (err) {
        errorEl.textContent = 'Network error. Please try again.';
        errorEl.style.display = 'block';
    } finally {
        btn.disabled = false;
        btn.textContent = 'Add Fish Type';
    }
});
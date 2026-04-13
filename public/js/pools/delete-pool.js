document.querySelectorAll('.btn-delete').forEach((btn) => {
    btn.addEventListener('click', async () => {
        const id = btn.dataset.id;

        const confirmed = await window.showConfirmModal({
            title: 'Delete Pool',
            message: `Are you sure you want to delete pool #${id}?`,
        });

        if (!confirmed) return;

        const body = {
            pool_id: id
        }

        const res = await fetch(`/api/v1/pools/delete-pool`, { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
         });
        const data = await res.json();

        if (data.success) {
            window.location.href = '/pools/list';
        }
    });
});
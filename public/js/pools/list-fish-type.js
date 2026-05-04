async function loadPools() {
  try {
    const res = await fetch('/api/v1/pools/list-fish-type');
    const data = await res.json();
    console.log('❇️ list fish type', data.data)

    const tbody = document.getElementById('fish-type-table-body');

    if (!data || data.length === 0) {
      tbody.innerHTML = `
            <tr>
                <td colspan="9" class="text-muted">No pools found.</td>
            </tr>
      `;
      return;
    }

    tbody.innerHTML = data.data.map((ft, idx) => `
        <tr>
            <td style="width: 60px;">${idx+1}</td>
            <td>${ft.name}</td>
        </tr>

    `).join('');

  } catch (err) {
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', loadPools);
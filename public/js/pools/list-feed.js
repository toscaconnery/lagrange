async function loadPools() {
  try {
    const res = await fetch('/api/v1/pools/list-feed');
    const data = await res.json();
    console.log('❇️ list feeds', data.data)

    const tbody = document.getElementById('feeds-table-body');

    if (!data || data.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" class="text-muted">No pools found.</td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = data.data.map((feed, idx) => `
      <tr>
        <td>${idx+1}</td>
        <td>${feed.name}</td>
        <td>${feed.type}</td>
        <td>${feed.weight || ''}</td>
        <td>${feed.created || ''}</td>
      </tr>
    `).join('');

  } catch (err) {
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', loadPools);
async function loadPools() {
  try {
    const res = await fetch('/api/v1/pools/list');
    const data = await res.json();
    console.log('❇️ list pools', data.data)

    const tbody = document.getElementById('pools-table-body');

    if (!data || data.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" class="text-muted">No pools found.</td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = data.data.map(pool => `
      <tr>
        <td>${pool.id}</td>
        <td>${pool.label}</td>
        <td>${pool.status}</td>
        <td>${pool.fish_type_name || ''}</td>
        <td>${pool.fish_count || ''}</td>
        <td>${pool.manager_name || ''}</td>
        <td>${pool.owner_name}</td>
        <td>${pool.fill_date || ''}</td>
        <td>
          <a href="/pools/details/${pool.id}" class="btn">Details</a>
          <a href="/pools/manage/${pool.id}" class="btn">Manage</a>
        </td>
      </tr>
    `).join('');

  } catch (err) {
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', loadPools);
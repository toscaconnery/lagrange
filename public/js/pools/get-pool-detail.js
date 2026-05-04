import { capitalize } from "../../../src/utils/formatter.js";

async function loadPools() {
  try {

    const path = window.location.pathname;
    console.log('--- path :', path)

    let poolId = null;

    const match = path.match(/^\/pools\/details\/(\d+)\/?$/);

    if (match) {
        poolId = match[1];
        const res = await fetch(`/api/v1/pools/pool-detail/${poolId}`);
        const data = await res.json();
        console.log('❇️ pool detail:', data.data)

        if (!data.data?.pool) {
            return
        }

        const poolData = data.data?.pool

        const poolOwnerNameElement = document.getElementById('pool_owner_name')
        poolOwnerNameElement.textContent = poolData.owner_name

        const poolManagerNameElement = document.getElementById('pool_manager_name')
        poolManagerNameElement.textContent = poolData.manager_name

        const poolStatusElement = document.getElementById('pool_status')
        poolStatusElement.textContent = capitalize(poolData.status)
    }

  } catch (err) {
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', loadPools);
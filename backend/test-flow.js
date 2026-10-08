const tokenUrl = 'http://localhost:5005/api/auth/login';
const baseUrl = 'http://localhost:5005/api';

async function testAllStages() {
  try {
    console.log('--- STARTING ERP INTEGRATION TEST ---');
    
    // STAGE 1: AUTH
    console.log('\n[Stage 1] Logging in...');
    const loginRes = await fetch(tokenUrl, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@tanerp.com', password: 'password123' })
    });
    const loginData = await loginRes.json();
    if (!loginRes.ok) throw new Error(loginData.message || 'Login failed');
    const token = loginData.token;
    console.log('✔ Login successful. Token received.');
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

    // STAGE 2: ACCOUNTING
    console.log('\n[Stage 2] Creating Accounts...');
    const cashAccRes = await fetch(`${baseUrl}/accounts`, {
      method: 'POST', headers,
      body: JSON.stringify({ code: `1001-${Date.now()}`, name: 'Cash', type: 'ASSET' })
    });
    const cashAcc = await cashAccRes.json();
    
    const salesAccRes = await fetch(`${baseUrl}/accounts`, {
      method: 'POST', headers,
      body: JSON.stringify({ code: `4001-${Date.now()}`, name: 'Sales', type: 'REVENUE' })
    });
    const salesAcc = await salesAccRes.json();
    console.log(`✔ Accounts created: Cash (ID: ${cashAcc.id}), Sales (ID: ${salesAcc.id})`);

    console.log('\n[Stage 2] Creating Voucher (Double Entry)...');
    const voucherRes = await fetch(`${baseUrl}/vouchers`, {
      method: 'POST', headers,
      body: JSON.stringify({
        voucherNo: `V-${Date.now()}`,
        type: 'RECEIPT',
        amount: 500,
        entries: [
          { accountId: cashAcc.id, debit: 500, credit: 0 },
          { accountId: salesAcc.id, debit: 0, credit: 500 }
        ]
      })
    });
    if (!voucherRes.ok) throw new Error(await voucherRes.text());
    console.log('✔ Double-entry voucher created successfully.');

    // STAGE 3: INVENTORY & PROCESS
    console.log('\n[Stage 3] Setting up Inventory & Process...');
    const chemRes = await fetch(`${baseUrl}/inventory`, {
      method: 'POST', headers,
      body: JSON.stringify({ name: 'Sodium Carbonate', stockQty: 100, unit: 'kg' })
    });
    const chem = await chemRes.json();
    console.log(`✔ Chemical created with 100kg stock (ID: ${chem.id})`);

    const drumRes = await fetch(`${baseUrl}/process/drums`, {
      method: 'POST', headers,
      body: JSON.stringify({ drumNo: `DRUM-${Date.now()}`, capacity: 200 })
    });
    const drum = await drumRes.json();
    
    const lotRes = await fetch(`${baseUrl}/process/lots`, {
      method: 'POST', headers,
      body: JSON.stringify({ lotNo: `LOT-${Date.now()}` })
    });
    const lot = await lotRes.json();
    console.log(`✔ Drum (ID: ${drum.id}) and Production Lot (ID: ${lot.id}) created.`);

    console.log('\n[Stage 3] Allocating Drum to Lot...');
    const allocateRes = await fetch(`${baseUrl}/process/allocate`, {
      method: 'POST', headers,
      body: JSON.stringify({ drumId: drum.id, lotId: lot.id })
    });
    const allocation = await allocateRes.json();
    if (!allocateRes.ok) throw new Error(allocation.message);
    console.log('✔ Drum successfully locked to Lot as IN_USE.');

    console.log('\n[Stage 3] Issuing Chemical to Lot...');
    const issueRes = await fetch(`${baseUrl}/inventory/issue`, {
      method: 'POST', headers,
      body: JSON.stringify({ lotId: lot.id, chemicalId: chem.id, qtyIssued: 25 })
    });
    if (!issueRes.ok) throw new Error(await issueRes.text());
    console.log('✔ 25kg of Chemical issued to Lot. (Stock should now be 75kg).');

    console.log('\n[Stage 3] Releasing Drum from Lot...');
    const releaseRes = await fetch(`${baseUrl}/process/release`, {
      method: 'POST', headers,
      body: JSON.stringify({ allocationId: allocation.id })
    });
    if (!releaseRes.ok) throw new Error(await releaseRes.text());
    console.log('✔ Drum released successfully. (Status should now be CLEANING).');

    console.log('\n--- ALL TESTS PASSED SUCCESSFULLY! ---');

  } catch (err) {
    console.error('\n❌ TEST FAILED:', err.message);
  }
}

testAllStages();

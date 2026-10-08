const API = 'http://localhost:5005/api';
let token = '';

async function fetchAPI(method, endpoint, body) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const res = await fetch(`${API}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

async function testAll() {
  console.log('--- STARTING FULL TANERP INTEGRATION TEST ---');

  try {
    // 1. Auth
    const loginRes = await fetchAPI('POST', '/auth/login', {
      email: 'admin@tanerp.com',
      password: 'password123'
    });
    token = loginRes.token;
    console.log('✅ Auth successful');

    // 2. CRM
    await fetchAPI('POST', '/crm/suppliers', { name: 'Test Supplier 1', contact: '123' });
    await fetchAPI('POST', '/crm/customers', { name: 'Test Customer 1', address: '456 Lane' });
    const crmSRes = await fetchAPI('GET', '/crm/suppliers');
    const crmCRes = await fetchAPI('GET', '/crm/customers');
    if (crmSRes.length < 1) throw new Error('Supplier not created');
    if (crmCRes.length < 1) throw new Error('Customer not created');
    console.log('✅ CRM endpoints active');

    // 3. Accounting & Trial Balance
    const accCode = 'ACC-' + Date.now();
    const accRes = await fetchAPI('POST', '/accounts', { code: accCode, name: 'Bank Test', type: 'ASSET' });
    const accId = accRes.id;
    const revCode = 'REV-' + Date.now();
    const revRes = await fetchAPI('POST', '/accounts', { code: revCode, name: 'Sales Test', type: 'REVENUE' });
    const revId = revRes.id;
    
    await fetchAPI('POST', '/vouchers', {
      voucherNo: 'VOUCHER-' + Date.now(),
      type: 'RECEIPT',
      amount: 1000,
      entries: [
        { accountId: accId, debit: 1000, credit: 0 },
        { accountId: revId, debit: 0, credit: 1000 }
      ]
    });
    console.log('✅ Accounting & Voucher creation successful');

    const tbRes = await fetchAPI('GET', '/accounts');
    const bankAcc = tbRes.find(a => a.id === accId);
    if (bankAcc.balance !== 1000) throw new Error('Balance incorrect');
    console.log('✅ Trial Balance calculation verified');

    // 4. Inventory & Process
    const cRes = await fetchAPI('POST', '/inventory', { name: 'Chem-' + Date.now(), stockQty: 500 });
    const chemId = cRes.id;

    const dRes = await fetchAPI('POST', '/process/drums', { drumNo: 'D-' + Date.now(), capacity: 200 });
    const drumId = dRes.id;

    const lRes = await fetchAPI('POST', '/process/lots', { lotNo: 'L-' + Date.now() });
    const lotId = lRes.id;

    await fetchAPI('POST', '/process/allocate', { lotId, drumId });
    await fetchAPI('POST', '/inventory/issue', { lotId, chemicalId: chemId, qtyIssued: 50 });

    const updatedChemRes = await fetchAPI('GET', '/inventory');
    const updatedChem = updatedChemRes.find(c => c.id === chemId);
    if (updatedChem.stockQty !== 450) throw new Error('Chemical stock not deducted correctly');
    console.log('✅ Process Allocation and Chemical Issuing successful');

    console.log('--- ALL TESTS PASSED SUCCESSFULLY! ---');
  } catch (err) {
    console.error('❌ TEST FAILED:', err.message);
  }
}

testAll();

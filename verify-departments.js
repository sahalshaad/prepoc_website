async function run() {
  const log = (msg, data) => console.log(`\n=== ${msg} ===\n`, JSON.stringify(data, null, 2));

  try {
    // 1. ADD
    const addRes = await fetch('http://localhost:3000/api/admin/departments', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Verification Dept' })
    });
    const addData = await addRes.json();
    log('ADD RESULT', addData);
    const newId = addData.data.id;

    // 2. EDIT
    const editRes = await fetch('http://localhost:3000/api/admin/departments', { 
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: newId, name: 'Verified Dept' })
    });
    const editData = await editRes.json();
    log('EDIT RESULT', editData);

    // 3. HIDE (Toggle Active)
    const hideRes = await fetch('http://localhost:3000/api/admin/departments', { 
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: newId, isActive: false })
    });
    const hideData = await hideRes.json();
    log('HIDE RESULT', hideData);

    // 4. DELETE
    const delRes = await fetch(`http://localhost:3000/api/admin/departments?id=${newId}`, { 
      method: 'DELETE' 
    });
    const delData = await delRes.json();
    log('DELETE RESULT', delData);

    // 5. Verify it's not active or removed
    const getRes = await fetch('http://localhost:3000/api/admin/departments');
    const getData = await getRes.json();
    const stillExists = getData.data.find(d => d.id === newId);
    log('FINAL CHECK (should be inactive or deleted)', { stillExists });

  } catch (err) {
    console.error(err);
  }
}

run();

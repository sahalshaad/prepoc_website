async function run() {
  // Try to delete 'web-development' which has team members
  const res = await fetch('http://localhost:3000/api/admin/departments?id=web-development', { method: 'DELETE' });
  const data = await res.json();
  console.log('Delete Web Dev (should fail):', data);

  // Try to add a new department
  const res2 = await fetch('http://localhost:3000/api/admin/departments', { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test Department' })
  });
  const data2 = await res2.json();
  console.log('Add new department:', data2);

  // Delete the new department (should succeed)
  const res3 = await fetch(`http://localhost:3000/api/admin/departments?id=${data2.data.id}`, { method: 'DELETE' });
  const data3 = await res3.json();
  console.log('Delete new department (should succeed):', data3);
}

run().catch(console.error);

(async () => {
  const res1 = await fetch('http://localhost:3000/api/admin/portfolio', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      project: {
        title: 'Test Project',
        clientName: 'Test Client',
        industry: 'Web Development',
        description: 'Test Desc',
        resultsAchieved: 'Test Results',
        tags: ['test']
      }
    })
  });
  const data1 = await res1.json();
  console.log('CREATE:', data1.success ? 'Success' : data1.error);

  if (data1.success && data1.data && data1.data.length > 0) {
    const id = data1.data[data1.data.length - 1].id;
    const res2 = await fetch('http://localhost:3000/api/admin/portfolio', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        project: {
          id: id,
          title: 'Test Project Edited',
          clientName: 'Test Client Edited',
          industry: 'Web Development',
          description: 'Test Desc Edited',
          resultsAchieved: 'Test Results Edited',
          tags: ['test-edited']
        }
      })
    });
    const data2 = await res2.json();
    console.log('EDIT:', data2.success ? 'Success' : data2.error);
    if (!data2.success) {
      console.log('EDIT FAILED:', data2);
    }
  }
})();

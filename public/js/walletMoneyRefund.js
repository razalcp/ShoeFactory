 const statusField =  document.getElementById('statusValue')


    let currentStatus=statusField.value

    url=`http://localhost:3003/initiateRefund?currentStatus=${currentStatus}`

    const result = fetch(url)
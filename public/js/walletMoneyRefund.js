 const statusField =  document.getElementById('statusValue')


    let currentStatus=statusField.value

    url=`/initiateRefund?currentStatus=${currentStatus}`

    const result = fetch(url)
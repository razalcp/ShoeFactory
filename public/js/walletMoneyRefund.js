 // Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const statusField = document.getElementById('hiddenfieldofaddress')

    if (statusField) {
        let currentStatus = statusField.value
        
        url = `/initiateRefund?currentStatus=${currentStatus}`
        
        const result = fetch(url)
    } else {
        console.error('Status field with ID "hiddenfieldofaddress" not found');
    }
});
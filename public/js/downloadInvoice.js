


function downloadPdf() {
    const element = document.getElementById('maindiv')
    console.log(element);
    html2pdf().from(element).save();
    
}
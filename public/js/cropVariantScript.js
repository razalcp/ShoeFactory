// Global variables
let currentVariantIndex = null;
let currentImageIndex = null;
let cropper = null;

// Function to handle file selection for variants
function handleVariantFileSelect(variantId, event) {
    const previewContainer = document.getElementById(`preview-${variantId}`);
    previewContainer.innerHTML = ''; // Clear previous previews

    const files = event.target.files;

    Array.from(files).forEach((file, index) => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();

            reader.onload = function(e) {
                const previewImage = document.createElement('img');
                previewImage.className = 'preview-image';
                previewImage.src = e.target.result;
                previewImage.title = file.name;
                previewImage.style.maxWidth = '100px';
                previewImage.style.maxHeight = '100px';
                previewImage.style.margin = '5px';
                previewImage.style.cursor = 'pointer';
                
                // Add click event to open cropper
                previewImage.onclick = function() {
                    openCropperModal(e.target.result, variantId, index);
                };

                const container = document.createElement('div');
                container.className = 'preview-item';
                container.appendChild(previewImage);
                
                previewContainer.appendChild(container);
            };

            reader.readAsDataURL(file);
        }
    });
}

// Function to open cropper modal
function openCropperModal(imageSrc, variantId, imageIndex) {
    currentVariantIndex = variantId;
    currentImageIndex = imageIndex;
    
    const modal = document.getElementById('myModal');
    const modalImg = document.getElementById('image');
    const croppedContainer = document.getElementById('cropped-container');
    
    modal.style.display = 'block';
    modalImg.src = imageSrc;
    
    // Clear previous cropped image
    croppedContainer.innerHTML = '';
    
    // Initialize cropper
    if (cropper) {
        cropper.destroy();
    }
    
    cropper = new Cropper(modalImg, {
        aspectRatio: 1/1,
        viewMode: 3
    });
}

// Function to crop image
async function cropVariantImage() {
    if (!cropper || currentVariantIndex === null || currentImageIndex === null) {
        return;
    }
    
    try {
        const croppedImage = await cropper.getCroppedCanvas().toDataURL("image/png");
        const dimensions = cropper.getData();
        
        let x = dimensions.x;
        let y = dimensions.y;
        let height = dimensions.height;
        let width = dimensions.width;
        
        const imageData = `index=${currentImageIndex} x=${x} y=${y} width=${width} height=${height}`;
        
        // Store crop data in the appropriate hidden field
        if (currentImageIndex === 0) {
            document.getElementById('hiddenField1').value = imageData;
        } else if (currentImageIndex === 1) {
            document.getElementById('hiddenField2').value = imageData;
        } else if (currentImageIndex === 2) {
            document.getElementById('hiddenField3').value = imageData;
        } else if (currentImageIndex === 3) {
            document.getElementById('hiddenField4').value = imageData;
        }
        
        // Update the preview image to show cropped version
        const previewContainer = document.getElementById(`preview-${currentVariantIndex}`);
        const previewImages = previewContainer.querySelectorAll('.preview-image');
        if (previewImages[currentImageIndex]) {
            previewImages[currentImageIndex].src = croppedImage;
        }
        
        // Show cropped image in modal
        const croppedImg = document.createElement('img');
        croppedImg.src = croppedImage;
        croppedImg.style.maxWidth = '200px';
        croppedImg.style.maxHeight = '200px';
        
        const croppedContainer = document.getElementById('cropped-container');
        croppedContainer.innerHTML = '';
        croppedContainer.appendChild(croppedImg);
        
        // Close modal
        document.getElementById('myModal').style.display = 'none';
        cropper.destroy();
        cropper = null;
        
    } catch (error) {
        console.error('Error cropping image:', error);
        alert('Error cropping image. Please try again.');
    }
}

// Close modal when clicking on close button
document.addEventListener('DOMContentLoaded', function() {
    const closeButtons = document.getElementsByClassName('close');
    if (closeButtons.length > 0) {
        closeButtons[0].onclick = function() {
            document.getElementById('myModal').style.display = 'none';
            if (cropper) {
                cropper.destroy();
                cropper = null;
            }
        };
    }

    // Close modal when clicking anywhere outside
    window.onclick = function(event) {
        const modal = document.getElementById('myModal');
        if (event.target === modal) {
            modal.style.display = 'none';
            if (cropper) {
                cropper.destroy();
                cropper = null;
            }
        }
    };

    // Add crop button event listener
    const cropButton = document.getElementById('btn-crop');
    if (cropButton) {
        cropButton.onclick = cropVariantImage;
    }
});

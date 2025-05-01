document.addEventListener('DOMContentLoaded', () => {
    const decreaseBtn = document.getElementById('decreaseBtn');
    const increaseBtn = document.getElementById('increaseBtn');
    const quantityInput = document.getElementById('quantityInput');
    const quantityHidden = document.getElementById('quantityHidden');

    decreaseBtn.addEventListener('click', () => {
        let value = parseInt(quantityInput.value, 10);
        if (value > 1) {
            quantityInput.value = value - 1;
            quantityHidden.value = value - 1;
        }
    });

    increaseBtn.addEventListener('click', () => {
        let value = parseInt(quantityInput.value, 10);
        quantityInput.value = value + 1;
        quantityHidden.value = value + 1;
    });

    quantityInput.addEventListener('input', () => {
        let value = parseInt(quantityInput.value, 10);
        if (isNaN(value) || value < 1) {
            quantityInput.value = 1;
        }
        quantityHidden.value = quantityInput.value;
    });
});

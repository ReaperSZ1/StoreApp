document.addEventListener('DOMContentLoaded', () => {
    const decreaseBtn = document.getElementById('decreaseBtn');
    const increaseBtn = document.getElementById('increaseBtn');
    const quantityInput = document.getElementById('quantityInput');

    decreaseBtn.addEventListener('click', () => {
      let value = parseInt(quantityInput.value, 10);
      if (value > 1) quantityInput.value = value - 1;
    });

    increaseBtn.addEventListener('click', () => {
      let value = parseInt(quantityInput.value, 10);
      quantityInput.value = value + 1;
    });

    quantityInput.addEventListener('input', () => {
      if (quantityInput.value === '' || parseInt(quantityInput.value) < 1) {
        quantityInput.value = 1;
      }
    });
  });
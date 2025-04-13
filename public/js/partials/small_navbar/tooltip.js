document.addEventListener('DOMContentLoaded', () => {
    const tooltip = document.getElementById('categories_tooltip');
    const overlay = document.getElementById('overlay');
    const trigger = document.getElementById('categories-list');
  
    let tooltipOpenedByClick = false;
  
    function openTooltip() {
      tooltip.classList.remove('invisible', 'opacity-0');
      tooltip.classList.add('visible', 'opacity-100');
      overlay.classList.remove('hidden');
    }
  
    function closeTooltip() {
      tooltip.classList.add('invisible', 'opacity-0');
      tooltip.classList.remove('visible', 'opacity-100');
      overlay.classList.add('hidden');
    }
  
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      tooltipOpenedByClick = true;
      openTooltip();
    });
  
    trigger.addEventListener('mouseenter', () => {
      if (!tooltipOpenedByClick) {
        openTooltip();
      }
    });
  
    trigger.addEventListener('mouseleave', (e) => {
      if (!tooltipOpenedByClick && !tooltip.contains(e.relatedTarget)) {
        closeTooltip();
      }
    });
  
    tooltip.addEventListener('mouseleave', (e) => {
      if (!tooltipOpenedByClick && !trigger.contains(e.relatedTarget)) {
        closeTooltip();
      }
    });
  
    overlay.addEventListener('click', () => {
      if (tooltipOpenedByClick) {
        closeTooltip();
        tooltipOpenedByClick = false;
      }
    });
  
    document.addEventListener('click', (e) => {
      if (
        tooltipOpenedByClick &&
        !tooltip.contains(e.target) &&
        !trigger.contains(e.target)
      ) {
        closeTooltip();
        tooltipOpenedByClick = false;
      }
    }); 
});
  
document.addEventListener('DOMContentLoaded', function () {
    const categories = document.getElementById('categories-list');
    const tooltip = document.querySelector('.tooltip-categories-responsive');
    const arrow = document.querySelector('.arrow-down-responsive');
    const content = document.querySelector('.content');

    let tooltipOpenedByClick = false;

    function positionTooltip() {
        const rect = categories.getBoundingClientRect();
        tooltip.style.top = `${rect.bottom + window.scrollY}px`;
        tooltip.style.left = `${rect.left + window.scrollX}px`;
    }

    categories.addEventListener('click', function (event) {
        event.stopPropagation();
        tooltipOpenedByClick = true;
        positionTooltip();
        tooltip.classList.remove('invisible', 'opacity-0');
        tooltip.classList.add('visible', 'opacity-100');
        arrow.classList.add('rotate-180');
        content.classList.add('dark-overlay');
    });

    categories.addEventListener('mouseenter', () => {
        if (!tooltipOpenedByClick) {
            positionTooltip();
            tooltip.classList.remove('invisible', 'opacity-0');
            tooltip.classList.add('visible', 'opacity-100');
            content.classList.add('dark-overlay');
        }
    });

    categories.addEventListener('mouseleave', (event) => {
        if (
            !tooltipOpenedByClick &&
            !tooltip.contains(event.relatedTarget)
        ) {
            tooltip.classList.add('invisible', 'opacity-0');
            tooltip.classList.remove('visible', 'opacity-100');
            content.classList.remove('dark-overlay');
        }
    });

    tooltip.addEventListener('mouseleave', (event) => {
        if (
            !tooltipOpenedByClick &&
            !categories.contains(event.relatedTarget)
        ) {
            tooltip.classList.add('invisible', 'opacity-0');
            tooltip.classList.remove('visible', 'opacity-100');
            content.classList.remove('dark-overlay');
        }
    });

    document.addEventListener('click', function (event) {
        if (
            tooltipOpenedByClick &&
            !tooltip.contains(event.target) &&
            !categories.contains(event.target)
        ) {
            tooltip.classList.add('invisible', 'opacity-0');
            tooltip.classList.remove('visible', 'opacity-100');
            arrow.classList.remove('rotate-180');
            content.classList.remove('dark-overlay');
            tooltipOpenedByClick = false;
        }
    });

    // 🆕 Atualiza posição em tempo real se necessário
    window.addEventListener('resize', () => {
        if (tooltipOpenedByClick) {
            positionTooltip();
        }
    });

    window.addEventListener('scroll', () => {
        if (tooltipOpenedByClick) {
            positionTooltip();
        }
    });
});

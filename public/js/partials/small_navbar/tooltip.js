document.addEventListener('DOMContentLoaded', function () {
    const categories = document.querySelector('.categories-list');
    const tooltip = document.querySelector('.tooltip_categories');
    const arrow = document.querySelector('.arrow-down');
    const container = document.querySelector('.container'); // Aplica apenas ao conteúdo

    categories.addEventListener('click', function (event) {
        event.stopPropagation();
        tooltip.classList.toggle('show_tooltip');
        arrow.classList.toggle('rotated');
        container.classList.toggle('dark-overlay'); // Apenas no conteúdo
    });

    categories.addEventListener('mouseover', function () {
        if (!container.classList.contains('dark-overlay')) {
            container.classList.add('dark-overlay');
        }
    });

    categories.addEventListener('mouseout', function (event) {
        if (
            !tooltip.contains(event.relatedTarget) &&
            !categories.contains(event.relatedTarget) &&
            !tooltip.classList.contains('show_tooltip')
        ) {
            container.classList.remove('dark-overlay');
        }
    });

    document.addEventListener('click', function (event) {
        if (!tooltip.contains(event.target) && !categories.contains(event.target)) {
            tooltip.classList.remove('show_tooltip');
            arrow.classList.remove('rotated');
            container.classList.remove('dark-overlay');
        }
    });
});

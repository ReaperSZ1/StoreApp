document.addEventListener('DOMContentLoaded', function () {
	const accountIcon = document.querySelector('.account');
	const tooltip = document.querySelector('.tooltip_account');

	// Alterna a visibilidade ao clicar no ícone
	accountIcon.addEventListener('click', function (event) {
		event.stopPropagation(); // Impede que o clique se propague para o body
		tooltip.classList.toggle('show_tooltip');
	});

	// Fecha o tooltip ao clicar fora
	document.addEventListener('click', function (event) {
		if (
			!tooltip.contains(event.target) &&
			!accountIcon.contains(event.target)
		) {
			tooltip.classList.remove('show_tooltip');
		}
	});
});

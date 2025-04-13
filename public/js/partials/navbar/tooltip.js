document.addEventListener('DOMContentLoaded', function () {
	const accountIcon = document.getElementById('account');
	const tooltip = document.getElementById('account_tooltip');

	accountIcon.addEventListener('click', function (event) {
		event.stopPropagation();
		tooltip.classList.toggle('opacity-0');
		tooltip.classList.toggle('invisible');
		tooltip.classList.toggle('opacity-100');
		tooltip.classList.toggle('visible');
	});

	document.addEventListener('click', function (event) {
		if (
			!tooltip.contains(event.target) &&
			!accountIcon.contains(event.target)
		) {
			tooltip.classList.add('opacity-0', 'invisible');
			tooltip.classList.remove('opacity-100', 'visible');
		}
	});
});

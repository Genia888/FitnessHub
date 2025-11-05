// Sticky header on scroll
window.addEventListener('scroll', function() {
	const headerRow = document.querySelector('.header-row');
	const scrollPosition = window.scrollY;
	
	if (scrollPosition > 100) {
		headerRow.classList.add('scrolled');
	} else {
		headerRow.classList.remove('scrolled');
	}
});

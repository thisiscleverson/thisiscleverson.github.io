
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const html = document.documentElement


if(html.getAttribute('data-theme') == null){
	html.setAttribute('data-theme', 'light')
}


const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
    html.setAttribute('data-theme', currentTheme)
}


themeToggle.addEventListener('click', () => {

	if(html.getAttribute("data-theme") == 'light'){
		html.setAttribute('data-theme', 'dark')
        localStorage.setItem('theme', 'dark');
		return
	}
	
	html.setAttribute('data-theme', 'light')
    localStorage.setItem('theme', 'light');
});

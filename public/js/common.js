// Theme (Dark/Light mode)

const getTheme = () => localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

const applyTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
};

const toggleTheme = () => applyTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light');

applyTheme(getTheme());

document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) applyTheme(e.matches ? 'dark' : 'light');
});
// End Theme (Dark/Light mode)

// Show alert (auth)

const showAlert = document.querySelector('[show-alert]')

if (showAlert) {
    const time = parseInt(showAlert.getAttribute('data-time'))
    const closeAlert = showAlert.querySelector('[close-alert]')

    setTimeout(() => {
        showAlert.classList.add('alert-hidden')
    }, time)

    closeAlert.addEventListener('click', () => {
        showAlert.classList.add('alert-hidden')
    })
}

// End Show alert (auth)



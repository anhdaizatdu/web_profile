(() => {
	const themeStorageKey = "web-profile-theme";
	const root = document.documentElement;

	function isTheme(theme) {
		return theme === "light" || theme === "dark";
	}

	function setTheme(theme) {
		if (!isTheme(theme)) {
			return false;
		}

		root.dataset.theme = theme;

		try {
			window.localStorage.setItem(themeStorageKey, theme);
		} catch {
			// Theme remains active for this page even when storage is unavailable.
		}

		return true;
	}

	function getTheme() {
		return root.dataset.theme;
	}

	try {
		const savedTheme = window.localStorage.getItem(themeStorageKey);
		if (isTheme(savedTheme)) {
			root.dataset.theme = savedTheme;
		}
	} catch {
		root.dataset.theme = "light";
	}

	window.setTheme = setTheme;
	window.getTheme = getTheme;
})();

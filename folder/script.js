(() => {
	const themeStorageKey = "web-profile-theme";
	const root = document.documentElement;
	const menuToggle = document.querySelector(".menu-toggle");
	const navigation = document.querySelector(".primary-navigation");
	const themeToggle = document.querySelector(".theme-toggle");
	const navigationLinks = document.querySelectorAll(".navigation-link");
	const typewriter = document.querySelector("[data-typewriter]");
	const typewriterSlogan = document.querySelector("[data-slogan]");
	const expertiseGroups = [
		{
			name: "Giáo dục",
			skills: [
				{ name: "Quản lý giáo dục", value: 85 },
				{ name: "Giáo dục tâm lý", value: 75 },
				{ name: "Phương pháp dạy học", value: 80 },
				{ name: "Giáo dục đặc biệt", value: 70 },
			],
		},
		{
			name: "Công nghệ",
			skills: [
				{ name: "C/C++", value: 75 },
				{ name: "Java", value: 70 },
				{ name: "HTML/CSS", value: 75 },
				{ name: "JavaScript", value: 70 },
				{ name: "SQL", value: 90 },
				{ name: "C#", value: 80 },
				{ name: "ASP.NET", value: 70 },
			],
		},
		{
			name: "Toán học",
			skills: [
				{ name: "Đại số", value: 90 },
				{ name: "Giải tích", value: 85 },
				{ name: "Hình học", value: 70 },
				{ name: "Xác suất & Thống kê", value: 75 },
			],
		},
		{
			name: "Nghệ thuật",
			skills: [
				{ name: "Nhạc cụ hiện đại", value: 35 },
				{ name: "Nhạc cụ dân tộc", value: 65 },
			],
		},
		{
			name: "Thể thao",
			skills: [
				{ name: "Võ thuật", value: 65 },
				{ name: "Điền kinh", value: 60 },
				{ name: "Thể hình", value: 65 },
				{ name: "Bơi lội", value: 55 },
			],
		},
	];

	function isTheme(theme) {
		return theme === "light" || theme === "dark";
	}

	function updateThemeButton() {
		const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
		themeToggle.setAttribute(
			"aria-label",
			nextTheme === "dark" ? "Chuyển sang giao diện tối" : "Chuyển sang giao diện sáng",
		);
	}

	function setTheme(theme) {
		if (!isTheme(theme)) {
			return false;
		}

		root.dataset.theme = theme;
		updateThemeButton();

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

	function updateActiveLink() {
		const currentHash = window.location.hash || "#trang-chu";
		let matchingLink = null;

		navigationLinks.forEach((link) => {
			const isActive = link.getAttribute("href") === currentHash;
			link.classList.toggle("is-active", isActive);
			if (isActive) {
				link.setAttribute("aria-current", "location");
				matchingLink = link;
			} else {
				link.removeAttribute("aria-current");
			}
		});

		return matchingLink;
	}

	function closeMenu({ restoreFocus = false } = {}) {
		menuToggle.setAttribute("aria-expanded", "false");
		menuToggle.setAttribute("aria-label", "Mở menu điều hướng");
		navigation.classList.remove("is-open");

		if (restoreFocus) {
			menuToggle.focus();
		}
	}

	function startTypewriter() {
		if (
			document.visibilityState === "hidden" ||
			window.matchMedia("(prefers-reduced-motion: reduce)").matches
		) {
			return;
		}

		if (typewriter) {
			const characters = Array.from(typewriter.textContent);
			typewriter.textContent = "";
			typewriter.classList.add("is-typing");

			let characterIndex = 0;
			function typeNextCharacter() {
				typewriter.textContent += characters[characterIndex];
				characterIndex += 1;

				if (characterIndex < characters.length) {
					window.setTimeout(typeNextCharacter, 65);
				} else {
					typewriter.classList.remove("is-typing");
				}
			}

			window.setTimeout(typeNextCharacter, 280);
		}

		const sloganText = typewriterSlogan?.querySelector("[data-slogan-text]");
		const slogans = [typewriterSlogan?.dataset.sloganFirst, typewriterSlogan?.dataset.sloganSecond];

		if (!sloganText || slogans.some((slogan) => !slogan)) {
			return;
		}

		let phraseIndex = 0;
		let characterIndex = 0;
		let isDeleting = false;
		sloganText.textContent = "";
		sloganText.classList.add("is-typing");

		function updateSlogan() {
			const characters = Array.from(slogans[phraseIndex]);

			if (isDeleting) {
				characterIndex -= 1;
				sloganText.textContent = characters.slice(0, characterIndex).join("");

				if (characterIndex === 0) {
					isDeleting = false;
					phraseIndex = (phraseIndex + 1) % slogans.length;
					window.setTimeout(updateSlogan, 320);
					return;
				}
			} else {
				characterIndex += 1;
				sloganText.textContent = characters.slice(0, characterIndex).join("");

				if (characterIndex === characters.length) {
					isDeleting = true;
					window.setTimeout(updateSlogan, 2400);
					return;
				}
			}

			window.setTimeout(updateSlogan, isDeleting ? 38 : 72);
		}

		window.setTimeout(updateSlogan, 360);
	}

	function initScrollReveal() {
		const revealItems = document.querySelectorAll(
			"[data-about-reveal], [data-study-reveal], [data-achievement-reveal], [data-contact-reveal]",
		);
		const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

		if (!revealItems.length || prefersReducedMotion || !("IntersectionObserver" in window)) {
			return;
		}

		root.classList.add("has-reveal");
		const observer = new IntersectionObserver((entries, currentObserver) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("is-visible");
					currentObserver.unobserve(entry.target);
				}
			});
		}, { threshold: 0.15, rootMargin: "0px 0px -32px 0px" });

		revealItems.forEach((item) => observer.observe(item));
	}

	function initExpertise() {
		const grid = document.querySelector("[data-expertise-grid]");

		if (!grid) {
			return;
		}

		expertiseGroups.forEach((group) => {
			const card = document.createElement("article");
			card.className = "expertise-card";

			const title = document.createElement("h3");
			title.className = "expertise-card-title";
			title.textContent = group.name;
			card.append(title);

			const skillList = document.createElement("ul");
			skillList.className = "expertise-skill-list";

			group.skills.forEach((skill) => {
				const item = document.createElement("li");
				item.className = "expertise-skill";

				const heading = document.createElement("div");
				heading.className = "expertise-skill-heading";

				const name = document.createElement("span");
				name.className = "expertise-skill-name";
				name.textContent = skill.name;

				const percentage = document.createElement("span");
				percentage.className = "expertise-skill-value";
				percentage.textContent = `${skill.value}%`;

				heading.append(name, percentage);

				const progress = document.createElement("div");
				progress.className = "expertise-progress";
				progress.setAttribute("role", "progressbar");
				progress.setAttribute("aria-label", skill.name);
				progress.setAttribute("aria-valuemin", "0");
				progress.setAttribute("aria-valuemax", "100");
				progress.setAttribute("aria-valuenow", String(skill.value));
				progress.dataset.value = String(skill.value);

				const fill = document.createElement("span");
				fill.className = "expertise-progress-fill";
				progress.append(fill);
				item.append(heading, progress);
				skillList.append(item);
			});

			card.append(skillList);
			grid.append(card);
		});

		const cards = grid.querySelectorAll(".expertise-card");
		const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

		function showProgress(card) {
			card.querySelectorAll(".expertise-progress").forEach((progress) => {
				progress.firstElementChild.style.width = `${progress.dataset.value}%`;
			});
		}

		if (reducedMotion.matches || !("IntersectionObserver" in window)) {
			cards.forEach(showProgress);
			return;
		}

		const observer = new IntersectionObserver((entries, currentObserver) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					showProgress(entry.target);
					currentObserver.unobserve(entry.target);
				}
			});
		}, { threshold: 0.2 });

		cards.forEach((card) => observer.observe(card));
	}

	try {
		const savedTheme = window.localStorage.getItem(themeStorageKey);
		if (isTheme(savedTheme)) {
			root.dataset.theme = savedTheme;
		}
	} catch {
		root.dataset.theme = "dark";
	}

	updateThemeButton();
	updateActiveLink();
	startTypewriter();
	initScrollReveal();
	initExpertise();

	themeToggle.addEventListener("click", () => {
		setTheme(root.dataset.theme === "dark" ? "light" : "dark");
	});

	menuToggle.addEventListener("click", () => {
		const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
		menuToggle.setAttribute("aria-expanded", String(!isExpanded));
		menuToggle.setAttribute("aria-label", isExpanded ? "Mở menu điều hướng" : "Đóng menu điều hướng");
		navigation.classList.toggle("is-open", !isExpanded);
	});

	navigationLinks.forEach((link) => {
		link.addEventListener("click", () => {
			closeMenu();
		});
	});

	window.addEventListener("hashchange", updateActiveLink);

	menuToggle.addEventListener("keydown", (event) => {
		if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
			closeMenu({ restoreFocus: true });
		}
	});

	navigation.addEventListener("keydown", (event) => {
		if (event.key === "Escape") {
			closeMenu({ restoreFocus: true });
		}
	});

	window.setTheme = setTheme;
	window.getTheme = getTheme;
})();
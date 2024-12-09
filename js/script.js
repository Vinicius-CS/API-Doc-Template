let translations = {};
let currentLanguage = 'en';
let xmlData = null;
let elements = [];
let pageInitialized = false;

async function loadFiles() {
	await loadTranslations();
	await loadXML();
	initializePage();
}

async function loadXML() {
	const response = await fetch(`./api-definition.xml?v=${Date.now()}`);
	if (response.ok) {
		const text = await response.text();
		const parser = new DOMParser();
		xmlData = parser.parseFromString(text, "application/xml");
		currentLanguage = xmlData.querySelector('Language')?.textContent || 'en';

		if (!translations.hasOwnProperty(currentLanguage)) {
			currentLanguage = 'en';
		}
	} else {
		console.error("Failed to load XML file.");
	}
}

async function loadTranslations() {
	const response = await fetch(`./translations.json?v=${Date.now()}`);
	if (response.ok) {
		translations = await response.json();
	} else {
		console.error("Failed to load translations file.");
	}
}

function selectFirstMenuItem() {
	const firstMenuItem = document.querySelector('.content-menu ul li');
	if (firstMenuItem) {
		firstMenuItem.classList.add('active');
	}
}

function debounce(func, wait = 100) {
	let timeout;
	return function (...args) {
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(this, args), wait);
	};
}

function initializePage() {
	if (pageInitialized) return;
	pageInitialized = true;

	const apiFunctions = xmlData.querySelectorAll('APIfunction');
	const contentContainer = document.querySelector('.content');
	const serverSelector = document.getElementById('server-selector');

	const servers = xmlData.querySelectorAll('Servers > Server');
	servers.forEach(server => {
		const option = document.createElement('option');
		option.value = server.querySelector('url').textContent;
		option.textContent = translate(server.querySelector('i18n')?.textContent || 'Server');
		serverSelector.appendChild(option);
	});

	apiFunctions.forEach(async item => {
		if (item.querySelector('visible')?.textContent?.toLowerCase() === 'false') return;

		const id = item.querySelector('source').textContent;
		const title = translate(item.querySelector('i18n')?.textContent || item.querySelector('title').textContent);

		const response = await fetch(`./content/${id}.${item.querySelector('type').textContent.toLowerCase()}?v=${Date.now()}`);
		if (response.ok) {
			const content = await response.text();
			const section = document.createElement('div');
			section.classList.add('content-section', 'overflow-hidden');
			section.id = id;
			section.innerHTML = `
				<h1>${title}
					<img src="./images/link-icon.svg" alt="${translate('copy', 'Copy')}" class="link-icon" style="visibility: hidden;" onclick="copyLink('${id}')">
				</h1>
				${content}
			`;
			contentContainer.appendChild(section);

			section.querySelectorAll('pre code').forEach(block => {
				hljs.highlightBlock(block);
			});

			const menuItem = document.createElement('li');
			menuItem.classList.add('scroll-to-link');
			menuItem.dataset.target = id;
			menuItem.innerHTML = `<a>${title}</a>`;
			document.getElementById('menu-items').appendChild(menuItem);
		} else {
			console.warn(`${translate('content_not_found_for', 'Content not found for')} '${id}'`);
		}
	});

	applyTranslations();
	calculElements();
	selectFirstMenuItem();
	addEventListeners();
	addCopyButton();
	addHoverCopyLink();
	scrollToHash();
}

function addEventListeners() {
	document.getElementById('button-menu-mobile')?.addEventListener('click', e => {
		e.preventDefault();
		document.querySelector('html').classList.toggle('menu-opened');
	});
	document.querySelector('.left-menu .mobile-menu-closer')?.addEventListener('click', e => {
		e.preventDefault();
		document.querySelector('html').classList.remove('menu-opened');
	});

	document.querySelectorAll('.scroll-to-link').forEach(item => {
		item.onclick = e => {
			e.preventDefault();
			const target = document.getElementById(item.dataset.target);
			target?.scrollIntoView({ behavior: 'smooth' });
			setActiveMenuItem(item);
		};
	});

	document.getElementById('server-selector')?.addEventListener('change', e => {
		changeServer(e.target.value);
	});

	window.addEventListener('resize', debounce(calculElements));
	window.addEventListener('scroll', onScroll);
}

function translate(key, defaultText = key) {
	return translations[currentLanguage]?.[key] || defaultText;
}

function applyTranslations() {
	document.querySelectorAll('[data-i18n]').forEach(element => {
		const key = element.getAttribute('data-i18n');
		element.textContent = translate(key);
	});
}

function changeServer(newValue) {
	const oldValue = localStorage.getItem('server') || '';

	document.querySelectorAll('*').forEach(element => {
		if (element.childNodes) {
			element.childNodes.forEach(node => {
				if (node.nodeType === Node.TEXT_NODE && node.nodeValue.includes(oldValue)) {
					node.nodeValue = node.nodeValue.replaceAll(oldValue, newValue);
				}
			});
		}
	});

	localStorage.setItem('server', newValue);
}

function calculElements() {
	elements = [];
	let totalHeight = 0;
	document.querySelectorAll('.content-section').forEach(div => {
		totalHeight += div.offsetHeight;
		elements.push({ id: div.id, maxHeight: totalHeight - 25 });
	});
	console.log("Calculated Elements:", elements); // Debug para verificar os elementos
	onScroll();
}

function onScroll() {
	const scroll = window.pageYOffset;

	elements.forEach(section => {
		if (scroll <= section.maxHeight) {
			document.querySelectorAll(".content-menu ul li").forEach(el => el.classList.remove('active'));
			const activeItem = document.querySelector(`.content-menu ul li[data-target='${section.id}']`);
			if (activeItem) {
				activeItem.classList.add('active');
			}
			return;
		}
	});
}

function setActiveMenuItem(activeItem) {
	document.querySelectorAll('.content-menu li').forEach(el => el.classList.remove('active'));
	activeItem.classList.add('active');
}

function addCopyButton() {
	document.querySelectorAll('pre code').forEach(codeElement => {
		const copyButton = document.createElement('button');
		copyButton.textContent = translate('copy', 'Copy');
		copyButton.onclick = () => {
			navigator.clipboard.writeText(codeElement.textContent);
			alert(translate('copied', 'Copied'));
		};
		codeElement.parentNode.insertBefore(copyButton, codeElement);
	});
}

function addHoverCopyLink() {
	document.querySelectorAll('.content-section h1').forEach(element => {
		element.addEventListener('mouseover', () => {
			element.querySelector('.link-icon').style.visibility = 'visible';
		});
		element.addEventListener('mouseleave', () => {
			element.querySelector('.link-icon').style.visibility = 'hidden';
		});
	});
}

function scrollToHash() {
	const hash = window.location.hash.slice(1);
	if (hash) {
		document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
	}
}

document.addEventListener('DOMContentLoaded', () => {
	loadFiles();
	const savedServer = localStorage.getItem('server');
	if (savedServer) {
		document.getElementById('server-selector').value = savedServer;
		changeServer(savedServer);
	}
});
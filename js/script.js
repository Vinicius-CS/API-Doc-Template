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

async function initializePage() {
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

	for (const item of apiFunctions) {
		if (item.querySelector('visible')?.textContent?.toLowerCase() === 'false') continue;

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
				${content.replaceAll((localStorage.getItem('Server') || '{{Server}}'), serverSelector.value)}
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
	}

	localStorage.setItem('server', (serverSelector.value || '{{Server}}'));
	applyTranslations();
	calculElements();
	selectFirstMenuItem();
	addEventListeners();
	addCopyButton();
	addCopyClick();
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
	newValue = newValue || document.getElementById('server-selector').value || '{{Server}}';
	const oldValue = localStorage.getItem('server') || '{{Server}}';

	function replaceTextContent(node) {
		if (node.nodeType === Node.TEXT_NODE) {
			node.nodeValue = node.nodeValue.replace(new RegExp(oldValue, 'gi'), newValue);
			node.nodeValue = node.nodeValue.replace(new RegExp('{{Server}}', 'gi'), newValue);
		} else {
			node.childNodes.forEach(replaceTextContent);
		}
	}

	document.querySelectorAll('.content').forEach(element => {
		element.childNodes.forEach(replaceTextContent);
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
	onScroll();
}

function onScroll()
{
	var scroll = window.pageYOffset;
	for (var i = 0; i < elements.length; i++)
	{
		var section = elements[i];
		if (scroll <= section.maxHeight)
		{
			var elems = document.querySelectorAll(".content-menu ul li");
			[].forEach.call(elems, function (el)
			{
				el.classList.remove('active');
			});
			var activeElems = document.querySelectorAll(".content-menu ul li[data-target='" + section.id + "']");
			[].forEach.call(activeElems, function (el)
			{
				el.classList.add('active');
			});
			break;
		}
	}
	if (window.innerHeight + scroll + 5 >= document.body.scrollHeight)
	{
		var elems = document.querySelectorAll(".content-menu ul li");
		[].forEach.call(elems, function (el)
		{
			el.classList.remove('active');
		});
		var activeElems = document.querySelectorAll(".content-menu ul li:last-child");
		[].forEach.call(activeElems, function (el)
		{
			el.classList.add('active');
		});
	}
}

function addCopyButton()
{
	document.querySelectorAll('pre code:not([not-copy])').forEach(codeElement =>
	{
		const copyImage = document.createElement('img');
		copyImage.className = 'copy-icon';
		copyImage.src = './images/copy-icon.svg';
		copyImage.alt = translate('copy', 'Copy');

		const tooltip = document.createElement('span');
		tooltip.className = 'tooltip';
		tooltip.textContent = translate('copied', 'Copied');

		copyImage.addEventListener('click', () =>
		{
			const textArea = document.createElement('textarea');
			textArea.value = codeElement.textContent;
			document.body.appendChild(textArea);
			textArea.select();
			document.execCommand('copy');
			document.body.removeChild(textArea);

			tooltip.style.visibility = 'visible';
			tooltip.style.opacity = '1';

			setTimeout(() =>
			{
				tooltip.style.visibility = 'hidden';
				tooltip.style.opacity = '0';
			}, 2000);
		});

		const container = document.createElement('div');
		container.style.position = 'relative';
		codeElement.parentNode.insertBefore(container, codeElement);
		container.appendChild(copyImage);
		container.appendChild(tooltip);
		container.appendChild(codeElement);
	});
}

function addCopyClick()
{
	document.querySelectorAll('.content code:not(.hljs, [not-copy])').forEach(codeElement =>
	{
		codeElement.style.cursor = 'pointer';

		const tooltip = document.createElement('span');
		tooltip.className = 'tooltip';
		tooltip.textContent = translate('copied', 'Copied');
		document.body.appendChild(tooltip);

		codeElement.addEventListener('click', function ()
		{
			const textArea = document.createElement('textarea');
			textArea.value = codeElement.textContent;
			document.body.appendChild(textArea);
			textArea.select();
			document.execCommand('copy');
			document.body.removeChild(textArea);

			const rect = codeElement.getBoundingClientRect();
			tooltip.style.top = `${rect.top + window.scrollY + rect.height / 2 - tooltip.offsetHeight / 2}px`;
			tooltip.style.left = `${rect.right + window.scrollX + 10}px`;

			tooltip.style.visibility = 'visible';
			tooltip.style.opacity = '1';

			setTimeout(() =>
			{
				tooltip.style.visibility = 'hidden';
				tooltip.style.opacity = '0';
			}, 2000);
		});
	});
}

let copyLinkTimeout = true;
function copyLink(source)
{
	const link = window.location.origin + window.location.pathname + '#' + source;
	navigator.clipboard.writeText(link).then(function ()
	{
		copyLinkTimeout = false;
		const tooltip = document.createElement('span');
		tooltip.className = 'tooltip';
		tooltip.textContent = translate('copied', 'Copied');
		document.body.appendChild(tooltip);

		const iconElement = document.querySelector(`img[onclick="copyLink('${source}')"]`);
		const rect = iconElement.getBoundingClientRect();
		tooltip.style.top = `${rect.top + window.scrollY + rect.height / 2 - tooltip.offsetHeight / 2}px`;
		tooltip.style.left = `${rect.right + window.scrollX + 10}px`;

		tooltip.style.visibility = 'visible';
		tooltip.style.opacity = '1';

		iconElement.style.display = 'inline';

		setTimeout(() =>
		{
			copyLinkTimeout = true;
			tooltip.style.visibility = 'hidden';
			tooltip.style.opacity = '0';
			document.body.removeChild(tooltip);

			const titleElement = iconElement.closest('h1');
			const isCursorOverTitle = titleElement.matches(':hover');
			if (!isCursorOverTitle)
			{
				iconElement.style.visibility = 'hidden';
			}
		}, 2000);
	});
}

function addHoverCopyLink()
{
	document.querySelectorAll('.content-section h1').forEach(element =>
	{
		element.addEventListener('mouseover', function ()
		{
			if (element.querySelector('.link-icon'))
			{
				element.querySelector('.link-icon').style.visibility = 'visible';
			}
		});

		element.addEventListener('mouseleave', function ()
		{
			if (copyLinkTimeout)
			{
				if (element.querySelector('.link-icon'))
				{
					element.querySelector('.link-icon').style.visibility = 'hidden';
				}
			}
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
});
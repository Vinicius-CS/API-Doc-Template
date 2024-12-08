var elements = [];

[].forEach.call(document.querySelectorAll('.scroll-to-link'), function (div)
{
	div.onclick = function (e)
	{
		e.preventDefault();
		var target = this.dataset.target;
		document.getElementById(target).scrollIntoView({ behavior: 'smooth' });
		var elems = document.querySelectorAll(".content-menu ul li");
		[].forEach.call(elems, function (el)
		{
			el.classList.remove("active");
		});
		this.classList.add("active");
		return false;
	};
});

document.getElementById('button-menu-mobile').onclick = function (e)
{
	e.preventDefault();
	document.querySelector('html').classList.toggle('menu-opened');
}
document.querySelector('.left-menu .mobile-menu-closer').onclick = function (e)
{
	e.preventDefault();
	document.querySelector('html').classList.remove('menu-opened');
}

function debounce(func)
{
	var timer;
	return function (event)
	{
		if (timer) clearTimeout(timer);
		timer = setTimeout(func, 100, event);
	};
}

function calculElements()
{
	var totalHeight = 0;
	elements = [];
	[].forEach.call(document.querySelectorAll('.content-section'), function (div)
	{
		var section = {};
		section.id = div.id;
		totalHeight += div.offsetHeight;
		section.maxHeight = totalHeight - 25;
		elements.push(section);
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
				el.classList.remove("active");
			});
			var activeElems = document.querySelectorAll(".content-menu ul li[data-target='" + section.id + "']");
			[].forEach.call(activeElems, function (el)
			{
				el.classList.add("active");
			});
			break;
		}
	}
	if (window.innerHeight + scroll + 5 >= document.body.scrollHeight)
	{ // end of scroll, last element
		var elems = document.querySelectorAll(".content-menu ul li");
		[].forEach.call(elems, function (el)
		{
			el.classList.remove("active");
		});
		var activeElems = document.querySelectorAll(".content-menu ul li:last-child");
		[].forEach.call(activeElems, function (el)
		{
			el.classList.add("active");
		});
	}
}

function addCopyButton() {
	document.querySelectorAll('pre code:not([not-copy])').forEach(codeElement => {
		const copyImage = document.createElement('img');
		copyImage.className = 'copy-icon';
		copyImage.src = './images/copy-icon.svg';
		copyImage.alt = translate('copy', 'Copy');

		const tooltip = document.createElement('span');
		tooltip.className = 'tooltip';
		tooltip.textContent = translate('copied', 'Copied');

		copyImage.addEventListener('click', () => {
			const textArea = document.createElement('textarea');
			textArea.value = codeElement.textContent;
			document.body.appendChild(textArea);
			textArea.select();
			document.execCommand('copy');
			document.body.removeChild(textArea);

			tooltip.style.visibility = 'visible';
			tooltip.style.opacity = '1';

			setTimeout(() => {
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

function addCopyClick() {
	document.querySelectorAll('.content code:not(.hljs, [not-copy])').forEach(codeElement => {
		codeElement.style.cursor = 'pointer';

		const tooltip = document.createElement('span');
		tooltip.className = 'tooltip';
		tooltip.textContent = translate('copied', 'Copied');
		document.body.appendChild(tooltip);

		codeElement.addEventListener('click', function () {
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

			setTimeout(() => {
				tooltip.style.visibility = 'hidden';
				tooltip.style.opacity = '0';
			}, 2000);
		});
	});
}

let copyLinkTimeout = true;
function copyLink(source) {
	const link = window.location.origin + window.location.pathname + '#' + source;
	navigator.clipboard.writeText(link).then(function() {
		copyLinkTimeout = false;
		const tooltip = document.createElement('span');
		tooltip.className = 'tooltip';
		tooltip.textContent = 'Copied';
		document.body.appendChild(tooltip);

		const iconElement = document.querySelector(`img[onclick="copyLink('${source}')"]`);
		const rect = iconElement.getBoundingClientRect();
		tooltip.style.top = `${rect.top + window.scrollY + rect.height / 2 - tooltip.offsetHeight / 2}px`;
		tooltip.style.left = `${rect.right + window.scrollX + 10}px`;

		tooltip.style.visibility = 'visible';
		tooltip.style.opacity = '1';

		iconElement.style.display = 'inline';

		setTimeout(() => {
			copyLinkTimeout = true;
			tooltip.style.visibility = 'hidden';
			tooltip.style.opacity = '0';
			document.body.removeChild(tooltip);

			const titleElement = iconElement.closest('h1');
			const isCursorOverTitle = titleElement.matches(':hover');
			if (!isCursorOverTitle) {
				iconElement.style.visibility = 'hidden';
			}
		}, 2000);
	});
}

function addHoverCopyLink() {
	document.querySelectorAll('.content-section h1').forEach(element => {
		element.addEventListener('mouseover', function () {
			element.querySelector('.link-icon').style.visibility = 'visible';
		});

		element.addEventListener('mouseleave', function () {
			if (copyLinkTimeout) {
				element.querySelector('.link-icon').style.visibility = 'hidden';
			}
		});
	});
}

function changeServer(newValue, oldValue =  localStorage.getItem('server')) {
	document.querySelectorAll('*:not(html ,body, select, option, .left-menu, .content-menu, .content-infos)').forEach(element => {
		if (element.innerHTML.includes(oldValue)) {
			element.innerHTML = element.innerHTML.replace(new RegExp(oldValue, 'g'), newValue);
		}
	});

	localStorage.setItem('server', newValue);
}

function loadTranslations(callback) {
	fetch('./translations.json')
		.then(response => response.json())
		.then(data => {
			translations = data;
			callback();
		});
}

function translate(key, defaultText = key) {
	return translations[currentLanguage][key] || defaultText;
}

function applyTranslations() {
	document.querySelectorAll('[data-i18n]').forEach(element => {
		const key = element.getAttribute('data-i18n');
		if (key !== (translateText = translate(key))) {
			element.textContent = translateText;
		}
	});
}

calculElements();
loadTranslations(applyTranslations);
window.onload = () =>
{
	if (localStorage.getItem('server') === null || localStorage.getItem('server') === '') {
		localStorage.setItem('server', '{{Server}}');
		changeServer(document.getElementById('server').value);
	} else {
		document.getElementById('server').value = localStorage.getItem('server');
		changeServer(document.getElementById('server').value, '{{Server}}');
	}

	calculElements();
	addCopyClick();
	addCopyButton();
	addHoverCopyLink();
};
window.onchange = () =>
{
	calculElements();
	addCopyClick();
	addCopyButton();
	addHoverCopyLink();

	document.querySelectorAll('.link-icon, .tooltip').forEach(element => {
		element.style.visibility = 'hidden';
	});
}
window.addEventListener("resize", debounce(function (e)
{
	e.preventDefault();
	calculElements();
}));
window.addEventListener('scroll', function (e) {
	e.preventDefault();
	onScroll();
});
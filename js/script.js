let translations = {};
let currentLanguage = 'en';
let xmlData = null;
let elements = [];

async function loadFiles()
{
	await loadTranslations();
	await loadXML();
	initializePage();
}

async function loadXML()
{
	const response = await fetch('./api-definition.xml');
	const text = await response.text();
	const parser = new DOMParser();
	xmlData = parser.parseFromString(text, "application/xml");
	currentLanguage = xmlData.querySelector('Language').textContent;

	if (!translations.hasOwnProperty(currentLanguage))
	{
		currentLanguage = 'en';
	}
}

async function loadTranslations()
{
	const response = await fetch('./translations.json');
	translations = await response.json();
}

function initializePage()
{
	const apiFunctions = xmlData.querySelectorAll('APIfunction');
	const contentContainer = document.querySelector('.content');
	const serverSelector = document.getElementById('server-selector');

	const servers = xmlData.querySelectorAll('Servers > Server');
	servers.forEach(server =>
	{
		const option = document.createElement('option');
		option.value = server.querySelector('url').textContent;
		option.textContent = translate(server.querySelector('i18n').textContent);
		serverSelector.appendChild(option);
	});

	apiFunctions.forEach(item =>
	{
		if (item.querySelector('visible')?.textContent?.toLowerCase() == false) {
			return;
		}

		const id = item.querySelector('source').textContent;
		const title = translate(item.querySelector('i18n')?.textContent || item.querySelector('title').textContent);

		fetch(`./content/${id}.${item.querySelector('type').textContent.toLowerCase()}`)
			.then(response => response.text())
			.then(content =>
			{
				if (!content.includes('<!doctype html><html><head><title>404 Not Found</title>'))
				{
					const section = document.createElement('div');
					section.classList.add('content-section');
					section.classList.add('overflow-hidden');
					section.id = id;
					section.innerHTML = `
						<h1>${title}
							<img src="./images/link-icon.svg" alt="${translate('copy', 'Copy')}" class="link-icon" style="visibility: hidden;" onclick="copyLink('${id}')">
						</h1>
						${content}
					`;
					contentContainer.appendChild(section);
					section.querySelectorAll('pre code').forEach((block) =>
					{
						hljs.highlightBlock(block);
					});

					const menuItem = document.createElement('li');
					menuItem.classList.add('scroll-to-link');
					menuItem.dataset.target = id;
					menuItem.innerHTML = `<a>${title}</a>`;
					document.getElementById('menu-items').appendChild(menuItem);
				}
				else
				{
					console.warn(`${translate('content_not_found_for', 'Content not found for')} '${id}.${item.querySelector('type').textContent.toLowerCase()}'`);
				}

				applyTranslations();
				addEventListeners();
			});
	});

	applyTranslations();
	calculElements();
	addCopyClick();
	addCopyButton();
	addHoverCopyLink();
	scrollToHash();
}

function addEventListeners()
{
	document.getElementById('button-menu-mobile').onclick = function (e)
	{
		e.preventDefault();
		document.querySelector('html').classList.toggle('menu-opened');
	};
	document.querySelector('.left-menu .mobile-menu-closer').onclick = function (e)
	{
		e.preventDefault();
		document.querySelector('html').classList.remove('menu-opened');
	};

	document.querySelectorAll('.scroll-to-link').forEach(item =>
	{
		item.onclick = e =>
		{
			e.preventDefault();
			const target = document.getElementById(item.dataset.target);
			target?.scrollIntoView({ behavior: 'smooth' });
			setActiveMenuItem(item);
		};
	});

	document.getElementById('server-selector').onchange = function (e)
	{
		changeServer(e.target.value);
	};

	window.addEventListener('resize', debounce(calculElements));
	window.addEventListener('scroll', onScroll);
}

function setActiveMenuItem(activeItem)
{
	document.querySelectorAll('.content-menu li').forEach(el => el.classList.remove('active'));
	activeItem.classList.add('active');
}

function translate(key, defaultText = key)
{
	return translations[currentLanguage]?.[key] || defaultText;
}

function applyTranslations()
{
	document.querySelectorAll('[data-i18n]').forEach(element =>
	{
		const key = element.getAttribute('data-i18n');
		element.textContent = translate(key);
	});
}

function debounce(func, wait = 100)
{
	let timeout;
	return function (...args)
	{
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(this, args), wait);
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

function changeServer(newValue, oldValue = localStorage.getItem('server'))
{
	console.log('Changing server from', oldValue, 'to', newValue);
	document.querySelectorAll('.copy-icon, .tooltip').forEach(element => element.remove());
	document.querySelectorAll('*:not(html, body, select, option, .left-menu, .content-menu, .content-infos)').forEach(element =>
	{
		console.log(element, element.innerHTML, element.innerHTML.includes(oldValue), element.innerHTML.includes('{{Server}}'));
		if (element.innerHTML.includes(oldValue))
		{
			element.innerHTML = element.innerHTML.replace(new RegExp(oldValue, 'g'), newValue);
		}

		if (element.innerHTML.includes('{{Server}}'))
		{
			element.innerHTML = element.innerHTML.replace(new RegExp('{{Server}}', 'g'), newValue);
		}
	});

	localStorage.setItem('server', newValue);
	addCopyClick();
	addCopyButton();
	addHoverCopyLink();
	document.querySelectorAll('.link-icon, .tooltip').forEach(element =>
	{
		element.style.visibility = 'hidden';
	});
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

function scrollToHash()
{
	const hash = window.location.hash;
	if (hash)
	{
		const target = document.getElementById(hash.substring(1));
		if (target)
		{
			target.scrollIntoView({ behavior: 'smooth' });
			const menuItem = document.querySelector(`.content-menu li[data-target='${hash.substring(1)}']`);
			if (menuItem)
			{
				setActiveMenuItem(menuItem);
			}
		}
	}
}

document.getElementById('button-menu-mobile').onclick = function (e)
{
	e.preventDefault();
	document.querySelector('html').classList.toggle('menu-opened');
};
document.querySelector('.left-menu .mobile-menu-closer').onclick = function (e)
{
	e.preventDefault();
	document.querySelector('html').classList.remove('menu-opened');
};

loadFiles();
calculElements();
window.onload = () =>
{
	calculElements();
	scrollToHash();
	addCopyClick();
	addCopyButton();
	addHoverCopyLink();

	changeServer(document.getElementById('server-selector').value);
};
window.addEventListener("resize", debounce(function (e)
{
	e.preventDefault();
	calculElements();
}));
window.addEventListener('scroll', function (e)
{
	e.preventDefault();
	onScroll();
});

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
	document.querySelectorAll('pre code').forEach(codeElement => {
		const copyImage = document.createElement('img');
		copyImage.className = 'copy-icon';
		copyImage.src = './images/copy-icon.svg';
		copyImage.alt = 'Copiar';

		const tooltip = document.createElement('span');
		tooltip.className = 'tooltip';
		tooltip.textContent = 'Copied';

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
	document.querySelectorAll('.content code:not(.hljs)').forEach(function (codeElement) {
		codeElement.style.cursor = 'pointer';

		const tooltip = document.createElement('span');
		tooltip.className = 'tooltip';
		tooltip.textContent = 'Copied';
		tooltip.style.position = 'absolute';
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

function changeServer(newValue, oldValue =  localStorage.getItem('server')) {
	document.querySelectorAll('*:not(html ,body, select, option, .left-menu, .content-menu, .content-infos)').forEach(element => {
		if (element.innerHTML.includes(oldValue)) {
			element.innerHTML = element.innerHTML.replace(new RegExp(oldValue, 'g'), newValue);
		}
	});

	localStorage.setItem('server', newValue);
}

calculElements();
window.onload = () =>
{
	if (localStorage.getItem('server') === null) {
		localStorage.setItem('server', '{{Server}}');
		changeServer(document.getElementById('server').value);
	} else {
		document.getElementById('server').value = localStorage.getItem('server');
		changeServer(document.getElementById('server').value, '{{Server}}');
	}

	calculElements();
	addCopyClick();
	addCopyButton();
};
window.onchange = () =>
{
	calculElements();
	addCopyClick();
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
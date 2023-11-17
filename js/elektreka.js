// Поиск неправильной локализации
const $$ = (selector) => document.querySelector(selector);
const $all = (selector) => document.querySelectorAll(selector);

const createButton = (text, className, handler) => {
	const initialStyles = `
    display: block;
    position: relative;
    background-color: #7b04df;
    color: white;
	 z-index: 100;
	 margin-right: 1em;
    padding: 0.5em 1.5em;
    border: none;
    border-radius: 5px;
	 transition: 0.2s;
  `;

	const onHandlerStyles = ({ target }, styles) => {
		target.style.cssText += styles;
		target.removeEventListener("mouseout", onHandlerStyles);
	}

	const button = document.createElement("button");
	button.textContent = text;
	button.style = initialStyles;
	button.classList.add(className);
	button.addEventListener("click", handler);
	button.addEventListener("mouseover", (e) => onHandlerStyles(e, `
		background-color: #a768ea;
		cursor: pointer;
	`));
	button.addEventListener("mouseout", (e) => onHandlerStyles(e, `
		background-color: #7b04df;
	`));

	return button;
};

const getProductsNames = () => {
	const products = [...$all('.products-list-row')];
	const paginationNode = $$('.hpm-pagination .pagination li:nth-last-child(2) a');

	const productsNames = products.map(node => ({
		ua: node.querySelector('[targetlangid="1"]').value,

		// ru: node.querySelector('[targetlangid="4"]').value
	}))

	const compareNames = productsNames.map(obj => `Name: ${obj.ua}`)

	paginationNode.click();

	return compareNames;
}

const setup = () => {
	const compareNames = getProductsNames();
	console.clear();
	console.warn(compareNames.join('\n'));
}

window.onload = () => {
	const menuStyles = `
		display: flex;
		position: fixed;
		right: 10px;
		bottom: 10px;
		z-index: 100;
	`;

	const menu = document.createElement('div');
	menu.classList.add('private-buttons-menu');
	menu.style = menuStyles;

	const copyBtn = createButton('Проверить и перейти', 'check-info', setup);

	document.body.append(menu);
	menu.append(copyBtn);

}
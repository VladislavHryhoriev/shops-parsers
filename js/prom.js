const $all = (selector) => document.querySelectorAll(selector);
const $$ = (selector) => document.querySelector(selector);
const $text = (selector) => document.querySelector(selector)?.innerText;
const $value = (selector) => document.querySelector(selector).value;
const $style = (selector) => document.querySelector(selector).style;

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



const copyData = ({ orderId, client, delivery, products, total, karma }) => {
	const text = `
		Пром
		● ${orderId}
		● ${products.map(({ article, amount }) => `${article} ${amount}`)} = ${total}
		● ${client?.recipient}
		● ${client?.phone}
		● ${delivery?.provider}
		● ${delivery?.city}
		● ${karma}
		>> ${delivery?.note}`
		.replace(/\s+/g, " ")
		.trim();

	navigator.clipboard.writeText(text);

	console.log(text);
};

const getData = () => {
	try {
		const products = [];
		let form = {};

		for (const node of [...$all('.b-order-edit-table')]) {
			products.push({
				article: 0,
				amount: 1 + 'шт',
				price: 0
			});
		}

		if ($text('[data-qaid="nova_poshta_provider_name"]')) {
			form = {
				orderId: $text('.qa_order_id').replace('№', ''),
				products: products,
				total: $text('[data-qaid="products_price"]'),
				client: {
					recipient: $text('[data-qaid="recipientFullName"]'),
					phone: $text('[data-qaid="recipientPhone"]').replace("+38", ""),
				},
				delivery: {
					provider: $text('[data-qaid="nova_poshta_provider_name"]'),
					city: $text('[data-qaid="deliveryAddress"]'),
					note: $value('[data-qaid="textarea_field"]'),
				},
				karma: $text('[data-qaid="successful_purchases"]')
			};
		}

		// if ($text('[data-qaid="custom_provider_name"]')) {
		// 	form = {
		// 		orderId: $text('.qa_order_id').replace('№', ''),
		// 		products: products,
		// 		total: $text('[data-qaid="products_price"]'),
		// 		client: {
		// 			recipient: $text('[data-qaid="recipientFullName"]'),
		// 			phone: $text('[data-qaid="recipientPhone"]').replace("+38", "").replace(/[^\d]/g, ""),
		// 		},
		// 		delivery: {
		// 			provider: $text('[data-qaid="custom_provider_name"]'),
		// 			city: 0,
		// 			warehouse: 0,
		// 			note: 0
		// 		}
		// 	};
		// }


		console.log(form);

		return form;
	} catch (e) {
		alert("Ошибка, детали в консоли");
		console.error(e);
	}
};

const copyToBuffer = () => copyData(getData());

window.onload = () => {
	const menuStyles = `
		display: flex;
		position: fixed;
		right: 10px;
		bottom: 10px;
	`;

	const menu = document.createElement('div');
	menu.classList.add('private-buttons-menu');
	menu.style = menuStyles;

	const copyBtn = createButton('Скопировать для 1c', 'copy-info', copyToBuffer);

	document.body.append(menu);
	menu.append(copyBtn);

	// checkUrl();

	// window.addEventListener("mousemove", checkUrl);
}

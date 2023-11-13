const $all = (selector) => document.querySelectorAll(selector);
const $$ = (selector) => document.querySelector(selector);
const $text = (selector) => document.querySelector(selector)?.innerText;
const $value = (selector) => document.querySelector(selector).value;
const $style = (selector) => document.querySelector(selector).style;

const createButton = (text, className, handler) => {
	const initialStyles = `
    display: block;
    position: relative;
    background-color: #0849b2;
    color: white;
	 z-index: 100;
	 margin-right: 1em;
    padding: 0.5em 1.5em;
    border: 1px solid #000;
    border-radius: 5px;
  `;

	const button = document.createElement("button");
	button.textContent = text;
	button.style = initialStyles;
	button.classList.add(className);
	button.addEventListener("click", handler);
	button.addEventListener("mouseover", (e) => onHandlerStyles(e, `
		background-color: #02218a;
	`));
	button.addEventListener("mouseout", (e) => onHandlerStyles(e, `
		background-color: #0849b2;
	`));

	return button;
};

const onHandlerStyles = ({ target }, styles) => {
	target.style.cssText += styles;
	target.removeEventListener("mouseout", onHandlerStyles);
}

const copyData = ({ orderId, client, delivery, products, total }) => {
	let text = '';

	if ($text('.order-status').includes('Нове')) {
		text = `
		Епіцентр
		● ${orderId}
		● ${products.map(({ article, amount }) => `${article} ${amount}`)} = ${total}`
			.replace(/\s+/g, " ")
			.trim();
	} else {
		text = `
		Епіцентр
		● ${orderId}
		● ${client?.lastName} ${client?.firstName} ${client?.patronymic}
		● ${client?.phone}
		● ${delivery?.provider}
		● ${delivery?.city}
		● ${delivery?.warehouse}
		>> ${delivery?.note}`
			.replace(/\s+/g, " ")
			.trim();
	}

	navigator.clipboard.writeText(text);
};

const getData = () => {
	try {
		const products = [];

		for (const node of [...$all(".order-products-list > *")]) {
			const inputSelector =
				node.querySelector('input[type="number"]')?.value ||
				parseInt(node.querySelector(".number-change").textContent.replace(/[^\d]/g, ''))
				;

			products.push({
				article: node.querySelector(".item-sku").innerText.split(" ")[1],
				amount: inputSelector + 'шт',
				price: node.querySelector(".item-amount").innerText.split(" ")[0]
			});
		}

		const form = {
			orderId: $text(".order-title").split(" ")[1],
			products: products,
			total: $text(".total").split(" ")[3],
			client: {
				firstName: $value('input[formcontrolname="firstName"]'),
				lastName: $value('input[formcontrolname="lastName"]'),
				patronymic: $value('input[formcontrolname="patronymic"]'),
				phone: $value('input[formcontrolname="phone"]')
					.replace("+38", "")
					.replace(/[^\d]/g, ""),
				email: $value('input[formcontrolname="email"]')
			},
			delivery: {
				provider: $text(".selected-provider"),
				city: $value(
					'em-delivery-providers-select-city[formcontrolname="settlement"] input'
				),
				warehouse: $value(
					'em-delivery-providers-select-office[formcontrolname="office"] textarea'
				),
				ttn: $value('input[formcontrolname="number"]').split(' ').join(''),
				note: $text(".commentary-field > div")
			}
		};

		return form;
	} catch (e) {
		alert("Ошибка, детали в консоли");
		console.error(e);
	}
};

const checkUrl = () => {
	const url = location.href;

	if ($text('.order-status') === 'Нове') {
		$$(".copy-info").textContent = 'Проверить товар';
	} else {
		$$(".copy-info").textContent = 'Скопировать для 1c';
	}

	if (url.includes("orders") && url.split("/").length > 5) {
		$style(".private-buttons-menu").display = "flex";
	} else {
		$style(".private-buttons-menu").display = "none";
	}
};

const getTTNData = (data) => {
	const APIKEY = 'f2c4b306e28d8448f81b0c69b1a5b314'

	try {
		if (!data.delivery.ttn) {
			alert('ТТН отсутствует, либо это УКР Почта');
			return;
		};

		const requestData = {
			"apiKey": APIKEY,
			"modelName": "TrackingDocument",
			"calledMethod": "getStatusDocuments",
			"methodProperties": {
				"Documents": [
					{
						"DocumentNumber": data.delivery.ttn,
						"Phone": data.client.phone,
					}
				]
			}
		};

		const request = fetch('https://api.novaposhta.ua/v2.0/json/', {
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(requestData)
		}).then(json => json.json()).then(data => {
			alert(data.data[0].Status)
			console.log(data.data[0]);
		});

		return request;
	} catch (e) {
		alert('Что-то пошло не так, ошибка в консоли...')
		console.error(e);
	}
}

const copyToBuffer = () => copyData(getData());

window.onload = () => {
	const menuStyles = `
		display: flex;
		position: absolute;
		left: calc(50% - (177px / 2));
		bottom: 10px;
	`;

	const menu = document.createElement('div');
	menu.classList.add('private-buttons-menu');
	menu.style = menuStyles;

	const copyBtn = createButton('Скопировать для 1c', 'copy-info', copyToBuffer);
	// const getTTNBtn = createButton('Получить данные из ТТН', 'ttn-info', () => getTTNData(getData()));

	document.body.append(menu);
	menu.append(copyBtn); // getTTNBtn

	checkUrl();

	window.addEventListener("mousemove", checkUrl);
}

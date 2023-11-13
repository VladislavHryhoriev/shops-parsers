const selectByText = (text, array) =>
	array.filter((node) => node.innerText === text)[0];

const selectByName = async (name) => document.getElementsByName(name)[0].value;

const btnStyles = `
    display: none;
    position: absolute;
    right: 10px;
    bottom: 10px;
    background-color: #0849b2;
    color: white;
	 z-index: 100;
    padding: 0.5em 1.5em;
    border: 1px solid #000;
    border-radius: 5px;
`;

const handleClick = async () => {
	try {
		const copyBtn = document.querySelector(".copy-list-button");

		const form = {};
		const btnNodes = [...document.querySelectorAll("button")];
		const mainInfo = selectByText("Загальна інформація", btnNodes);
		const delivery = selectByText("Оплата і доставка", btnNodes);
		const products = selectByText("Товари", btnNodes);

		mainInfo.click();
		form.id = await selectByName("orderFormIdMagentoOrder");
		form.note = await selectByName("orderFormNote");

		delivery.click();
		form.name = await selectByName("orderFormCustomerName");
		form.number = await selectByName("orderFormCustomerPhone").then((data) =>
			data.toString().replace("+38", "")
		);
		form.city = await selectByName("orderFormShippingCity");
		form.deliveryAddress = await selectByName("orderFormStockName");
		form.street = await selectByName("orderFormShippingStreet");
		form.house = await selectByName("orderFormShippingHouse");
		form.apartment = await selectByName("orderFormShippingApartment");
		form.deliveryType = await selectByName("orderFormShippingType");

		products.click();
		const trNodes = [];

		setTimeout(() => {
			for (const node of [...document.querySelectorAll("tbody > tr")]) {
				if (node.cells[4].textContent.split("-").length > 2) {
					trNodes.push({
						code: node.cells[4].textContent.split("-").slice(0, 2).join("-"),
						value: node.cells[1].textContent,
						total: node.cells[5].textContent
					});
				} else {
					trNodes.push({
						code: node.cells[4].textContent.split("-")[0],
						value: node.cells[1].textContent,
						total: node.cells[5].textContent
					});
				}
			}

			form.products = trNodes;

			const text = `
          Алло: ${form.id}
           ● ${form.products.map(
				({ code, value, total }) => ` ${code} - ${value}шт = ${total}грн`
			)}
           ● ${form.name}
           ● ${form.number}
           ● ${form.city ? form.city : "Город не указан"}
           ● ${form.deliveryAddress ? form.deliveryAddress : "Склад не указан"}
           ${form.house ? " ● Буд: " + form.house : ""}
           ${form.apartment ? " ● Кв: " + form.apartment : ""}
           >> ${form.note}
           ● ${form.deliveryType}`
				.replace(/\s+/g, " ")
				.trim();

			navigator.clipboard.writeText(text);

			copyBtn.textContent = "Скопировано";
			copyBtn.style.backgroundColor = "green";

			setTimeout(() => {
				copyBtn.textContent = "Скопировать для 1C";
				copyBtn.style.backgroundColor = "#0849b2";
			}, 1000);

			mainInfo.click();
		}, 100);
	} catch (e) {
		console.error(e);
		alert("Ошибка копирования, откройте заказ через редактирование!");
	}
};

const checkUrl = () => {
	if (location.href.includes("edit")) {
		document.querySelector(".copy-list-button").style.display = "block";
	} else {
		document.querySelector(".copy-list-button").style.display = "none";
	}
};

window.onload = () => {
	const newCopyBtn = document.createElement("button");
	newCopyBtn.classList.add("copy-list-button");
	newCopyBtn.innerText = "Скопировать для 1C";
	newCopyBtn.style = btnStyles;
	newCopyBtn.onclick = handleClick;

	document.body.append(newCopyBtn);
	checkUrl();
};

window.addEventListener("click", checkUrl);

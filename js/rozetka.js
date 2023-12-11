document.querySelector('#favIcon').remove(); // удалить уведомление

const $$ = (selector) => document.querySelector(selector);

const waitForElement = (selector, callback) => {
	const intervalId = setInterval(() => {
		console.log(1);
		const node = $$(selector);
		if (node) {
			clearInterval(intervalId);
			callback(node);
		}
	}, 100);
};

const findText = (node) => {
	const userInfoNode = $$(node);

	const nodesName = userInfoNode.querySelectorAll('.info-group--description');
	const nodesPhone = userInfoNode.querySelectorAll('.info-group--link');

	const names = [...nodesName].map((node) => node.textContent.trim());
	const phones = [...nodesPhone].map((node) => node.textContent.trim());

	const user = {
		names: names[0] === names[1] ? true : false,
		phones: phones[0] === phones[1] ? true : false,
	};

	return user;
};

document.body.addEventListener('click', () => {
	waitForElement('.detail-box--body', () => {
		const { names, phones } = findText('.detail-box--body');
		if (names && phones) {
			$$('.detail-box--body').style.backgroundColor = '#ddffdd';
		} else {
			$$('.detail-box--body').style.backgroundColor = '#ffdddd';
		}
	});
});

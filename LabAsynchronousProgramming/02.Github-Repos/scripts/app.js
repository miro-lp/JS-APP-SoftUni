function loadRepos() {
	const userName = document.getElementById('username').value;
	const li = document.getElementById('repos');
	const url = `https://api.github.com/users/${userName}/repos`;
	fetch(url)
		.then(res => {
			if (res.ok == false) {
				throw new Error(`${res.status} ${res.statusText}`);
			}
			return res.json();
		})
		.then(handleResponse)
		.catch(errrorHandler);

	function handleResponse(data) {
		li.innerHTML = '';
		for (let repo of data) {
			const liElement = document.createElement('li');
			liElement.innerHTML = `<a href="${repo.html_url}">
			${repo.full_name}
		</a>`;
			li.appendChild(liElement);

		}
	}

	function errrorHandler(error){
		li.innerHTML = '';
		li.textContent = `${error.message}`

	}

}
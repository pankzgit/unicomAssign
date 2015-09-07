(function () {
var dragSrcEl = null;
var form = document.getElementsByClassName("formE")[0],
	msg = document.getElementsByClassName("msg")[0],
	showTableButton = document.getElementById("showTable"),
	createUserButton = document.getElementById("createUser"),
	searchBox = document.getElementsByClassName("searchBox")[0],
	_state = {
		header: {
			"name": "+",
			"zipcode": "+",
			"country": "+",
			"preference": "+",
			"phone": "+",
			"email": "+",
			"password": "+",
			"date": "+"
		},
		DEFAULT_SORT: "name"//creation_time
	};


showTableButton.addEventListener("click", showTableHandler, false);
createUserButton.addEventListener("click", showFormHandler, false);
form.addEventListener("submit", submitHandler.bind(form), false);
searchBox.addEventListener("keyup", searchHandler, false);

if (!localStorage.getItem("users")) {
	localStorage.setItem("users", JSON.stringify([]));
}

if (JSON.parse(localStorage.getItem("users")).length === 0) {
	showTableButton.setAttribute("disabled", true)
}

function showTableHandler () {
	var formWrapper = document.getElementsByClassName("formWrapper")[0],
		tableWrapper = document.getElementsByClassName("tableWrapper")[0],
		users = JSON.parse(localStorage.getItem("users"));

		//Defualt Sort on Name
		users = users.sort(function (a,b) {
					return a[_state.DEFAULT_SORT] < b[_state.DEFAULT_SORT]
		});

	localStorage.setItem('users', JSON.stringify(users));

	formWrapper.classList.add("hide");
	updateUserTable();
	tableWrapper.classList.remove("hide");
}

function showFormHandler () {
	var formWrapper = document.getElementsByClassName("formWrapper")[0],
		tableWrapper = document.getElementsByClassName("tableWrapper")[0];

	formWrapper.classList.remove("hide");
	tableWrapper.classList.add("hide");
}

function submitHandler (ev) {
	var oThis = this,
		emails = [],
		showTableButton = document.getElementById("showTable"),
		formWrapper = document.getElementsByClassName("formWrapper")[0],
		form = document.getElementsByClassName("formE")[0],
		users = JSON.parse(localStorage.getItem("users"));

	var formData = _formDatatoJson(oThis);
	formData.id = users.length + 1;
	// Object.defineProperty(formData, "_id", {
	// 	value: users.length + 1,
	// 	get: function () {
	// 		return value;
	// 	}
	// })
	// check for unique Email
	users.forEach(function (user) {
		emails.push(user.email);
	});

	if (emails.indexOf(formData.email) !== -1) {
		alert("Please provide unique email");
		msg.className = "msg wk";
		msg.innerHTML = "Please provide unique email Id";
		document.getElementById("email").focus();
		ev.preventDefault();
		return;

	}

	users.push(formData);

	localStorage.setItem("users", JSON.stringify(users));
	
	//formWrapper.classList.add('hide');
	alert("Form Submitted Successfully");
	form.reset();
	_reset();
	showTableButton.removeAttribute("disabled");
	//updateUserTable();
	ev.preventDefault();
	return false;
}

function _reset () {
	var passwordErrMsg = document.getElementsByClassName("passwordErrMsg")[0],
		errorMsg = document.getElementsByClassName("msg")[0];

	passwordErrMsg.textContent = "";
	errorMsg.textContent = "";
}

function _formDatatoJson (form) {
	var oThis = this,
		//all input field (assumption)
		inputArr = form.getElementsByTagName("input"),
		formObj = {};

	for (var i = 0; i< inputArr.length; i++) {
		formObj[inputArr[i].id] = inputArr[i].value
	}

	return formObj;
}

function handleDragStartRow (e) {
	var oThis = this;
	dragSrcEl = this;

  	e.dataTransfer.effectAllowed = 'move';
  	e.dataTransfer.setData('text/html', this.innerHTML);
  	oThis.classList.add("move");
}

function handleDropRow(e) {
  // this / e.target is current target element.
  var oThis = this;
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  if (dragSrcEl != this) {
   
    dragSrcEl.innerHTML = this.innerHTML;
    oThis.innerHTML = e.dataTransfer.getData('text/html');
    oThis.classList.remove("over");
    //oThis.style.opacity = "1"
  }


  return false;
}

function handleDragEndRow(e) {
var oThis = this,
	rows = document.getElementsByClassName("rowTable");
[].forEach.call(rows, function (row) {
    row.classList.remove('over');
});

oThis.classList.remove("move");

}

function handleDragEnterRow (e) {
	var oThis = this;
	oThis.classList.add("over");
	e.preventDefault();
	return true;	

}

function handleDragOverRow (e) {
	var oThis = this;
	e.preventDefault();
	return true;
}

function handleDragLeaveRow (e) {
	var oThis = this;
	oThis.classList.remove("over");
	e.preventDefault();
	return true;
}

function updateUserTable () {
	var itemList = document.getElementsByClassName("itemList")[0],
		tableWrapper = document.getElementsByClassName("tableWrapper")[0],
		row = null,
		col = null,
		divParent = document.createElement("div"),
		users = JSON.parse(localStorage.getItem("users")),
		tempVal,
		textNode,
		label,
		userDetails = [];
	tableWrapper.classList.remove("hide");
	itemList.innerHTML = "";
	createHeaderTable();

	for (var i = 0; i < users.length; i++) {
		row = document.createElement("div");
		row.className = "rowTable " + i;
		row.setAttribute('draggable', true);

		row.dataset.id = users[i].id;

		row.addEventListener('dragstart', handleDragStartRow.bind(row), false);
		row.addEventListener('dragenter', handleDragEnterRow.bind(row), false)
		row.addEventListener('dragover', handleDragOverRow.bind(row), false);
		row.addEventListener('dragleave', handleDragLeaveRow.bind(row), false);
		row.addEventListener('drop', handleDropRow.bind(row), false);
		row.addEventListener('dragend', handleDragEndRow.bind(row), false);

		userDetails = users[i];

		for (var key in userDetails) {
			if (key === "id") {
				continue;
			}
			col = document.createElement("div");
			col.className = "colElement";
			label = document.createElement("span");
			tempVal = userDetails[key];
			textNode = document.createTextNode(tempVal);
			label.appendChild(textNode);
			label.title = tempVal;
			col.appendChild(label);
			row.appendChild(col);
		}
		divParent.appendChild(row);

	}

	itemList.appendChild(divParent);

}

function createHeaderTable () {
	var headerLayout = document.getElementsByClassName("tableHeader")[0],
		div = null,
		col = null,
		divParent = document.createElement("div"),
		userHeader = JSON.parse(localStorage.getItem("users")).length !== 0 ? JSON.parse(localStorage.getItem("users"))[0] : {},
		tempVal,
		textNode,
		label,
		userDetails = [];
		headerLayout.innerHTML = "";
		for (var key in userHeader) {
			if (key === "id") {
				continue;
			}
			div = document.createElement("div");
			div.classList.add("colHeader");
			label = document.createElement("span");
			textNode = document.createTextNode(key);
			label.appendChild(textNode);
			div.appendChild(label);
			div.addEventListener("dblclick", sortColumnHandler, false);
			div.dataset.key = key;
			div.dataset.order = _state.header[key];
			divParent.appendChild(div);
		}

		headerLayout.appendChild(divParent);
}

function sortColumnHandler (ev) {
	var target = ev.currentTarget,
		key = target.dataset.key,
		order = target.dataset.order,
		users = JSON.parse(localStorage.getItem('users'));
	users = users.sort(function (a,b) {
				if (order === "+") {
					return a[key] < b[key]
				}
				else {
					return a[key] > b[key]
				}
			});
	_state.header[key] = (order === "+") ? "-" : "+";
	localStorage.setItem("users", JSON.stringify(users));
	updateUserTable();
}

function searchHandler (ev) {
	if (ev.keyCode !== 13) { // Trigger Search only on Enter 
		return
	}
	var searchKey = ev.target.value;
	var matchlist = [];
	var users = JSON.parse(localStorage.getItem("users"));
	var itemList = document.getElementsByClassName("rowTable");

	if (searchKey.length !== 0) {
		for (var j = 0; j< users.length; j++) {
			if (users[j].name.toLowerCase().indexOf(searchKey.toLowerCase()) !== -1) {
				matchlist.push(users[j].id);
			}
		}
	}

	for (var i = 0; i < itemList.length; i++) {
		if (matchlist.indexOf(parseInt(itemList[i].dataset.id, 10)) !== -1) {
			itemList[i].classList.add("highlight");
		}

		else {
			itemList[i].classList.remove("highlight");
		}
	}
}


}) (document);
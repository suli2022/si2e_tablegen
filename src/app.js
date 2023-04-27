const tbody = document.querySelector("#tbody");
const saveButton = document.querySelector("#saveButton");
const nameInput = document.querySelector("#name");
const quantityInput = document.querySelector("#quantity");
const priceInput = document.querySelector("#price");

const editidInput = document.querySelector("#editid");
const editnameInput = document.querySelector("#editname");
const editquantityInput = document.querySelector("#editquantity");
const editpriceInput = document.querySelector("#editprice");

const saveEditButton = document.querySelector('#saveEditButton');

var gyumolcsok = [];
const host = 'http://localhost:8000/';


function getFruits() {
    let endpoint = 'fruits';
    let url = host + endpoint;

    fetch(url)
    .then(response => response.json())
    .then(result => { 
        console.log(result);
        gyumolcsok = result;
        generateTbody();
    });

}

getFruits();

function generateTbody() {
    gyumolcsok.forEach((gyumolcs) => {
        let tr = document.createElement('tr');
        let tdName = document.createElement('td');
        let tdQuantity = document.createElement('td');
        let tdPrice = document.createElement('td');

        tdName.textContent = gyumolcs.name;
        tdQuantity.textContent = gyumolcs.quantity;
        tdPrice.textContent = gyumolcs.price;

        tbody.append(tr);
        tr.append(tdName);
        tr.append(tdQuantity);
        tr.append(tdPrice);        
        tr.append(generateTdDelete(gyumolcs.id));
        tr.append(generateTdEdit(gyumolcs))
    });
}


function generateTdDelete(id) {
    let td = document.createElement('td');
    let button = document.createElement('button');
    button.textContent = "Törlés";
    button.classList = "btn btn-warning";
    button.addEventListener('click', () => {
        console.log(id);
        deleteFruit(id);
        // let index = 0;
        // let count = 0;
        // gyumolcsok.forEach((gy) => {
        //     if(gy.id == id) {
        //         index = count;
        //     }
        //     count++;
        // });
        // console.log(index);
        // gyumolcsok.splice(index, 1);
        // tbody.textContent = "";
        // generateTbody();
    });
    td.append(button);
    return td;
}


function generateTdEdit(fruit) {
    let td = document.createElement('td');
    let button = document.createElement('button');
    button.textContent = "Szerkesztés";
    button.classList = "btn btn-primary";
    
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#editModal');

    button.addEventListener('click', () => {
        console.log('működik');
        console.log(fruit.name);
        editidInput.value = fruit.id;
        editnameInput.value = fruit.name;
        editquantityInput.value = fruit.quantity;
        editpriceInput.value = fruit.price;

    });
    td.append(button);
    return td;
}

function createFruit(fruit) {
    let endpoint = 'fruits';
    let url = host + endpoint;

    fetch(url, {
        method: 'post',
        body: JSON.stringify(fruit),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(result => {
        console.log(result)
    });
}

function deleteFruit(id) {
    let endpoint = 'fruits';
    let url = host + endpoint + '/' + id;
    fetch(url, {
        method: 'delete'
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        tbody.textContent = "";
        getFruits();       
    });
}

saveButton.addEventListener('click', () => {    
    let name =  nameInput.value;
    let quantity = quantityInput.value;
    let price = priceInput.value;
    let gyumolcs = { 
        name: name, 
        quantity: quantity, 
        price: price
    };
    createFruit(gyumolcs);
    tbody.textContent = '';
    getFruits();
    clearFieldOnAddModel();
});

function clearFieldOnAddModel() {
    nameInput.value = '';
    quantityInput.value = '';
    priceInput.value = '';
}


saveEditButton.addEventListener('click', () => {

    let id = editidInput.value;
    let name = editnameInput.value;
    let quantity = editquantityInput.value;
    let price = editpriceInput.value;

    let fruit = {
        id: id,
        name: name,
        quantity: quantity,
        price: price
    }
    updateFruit(fruit);

    gyumolcsok.forEach((gyumolcs) => {
        if (gyumolcs.id == id ) {
            gyumolcs.name = name;
            gyumolcs.quantity = quantity;
            gyumolcs.price = price;
        }
    });
    tbody.textContent = '';
    generateTbody();
    
});

function updateFruit(fruit) {
    let endpoint = 'fruits';
    let url = host + endpoint + "/" + fruit.id;
    let headers = {
        "Content-Type": "application/json"
    }
    fetch(url, {
        method: 'put',
        body: JSON.stringify(fruit), 
        headers: headers
    })
    .then(res => res.json())
    .then(res => {
        console.log(res);
    });
}
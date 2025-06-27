let elSarvarProductList = document.querySelector(".sarvar-product-list");
let modalWrapper = document.querySelector(".modal-wrapper");
let modalInner = document.querySelector(".modal-inner");
let elSearchInput = document.querySelector(".search-input");
let url = "https://api.escuelajs.co/api/v1/products";

let allProducts = [];

// Get Products (yagona versiya)
const getProducts = () => {
    axios(url).then(data => {
        allProducts = data.data;
        renderProducts(allProducts, elSarvarProductList);
    });
};
getProducts(); // dastlab chaqiramiz

// Re-render
function reRender() {
    getProducts();
}

// Search input event
elSearchInput.addEventListener("input", function () {
    const value = this.value.toLowerCase().trim();
    
    const filtered = allProducts.filter(product =>
        product.title.toLowerCase().includes(value) ||
        String(product.price).includes(value)
    );
    renderProducts(filtered, elSarvarProductList);
});

// Render Products
function renderProducts(arr, list) {
    list.innerHTML = "";
    arr.forEach(item => {
        let elItem = document.createElement("li");
        elItem.className = "w-[350px] p-5 rounded-md bg-class";
        elItem.innerHTML = `
            <img class="w-full h-[200px] mb-3" src="${item.images[0]}" alt="Img"/>
            <div class="flex items-center justify-between mb-3">
                <h2 class="text-white font-semibold text-[18px]">${item.title}</h2>
                <p class="text-white font-semibold text-[18px]">${item.price}$</p>
            </div>
            <p class="h-[200px] text-white font-semibold text-[13px]">${item.description}</p>
            <div class="flex justify-between mt-5">
                <button onclick="handleEdit(${item.id})" class="font-bold bg-blue-500 p-2 rounded-md text-white text-[18px] hover:bg-blue-400 duration-300 cursor-pointer">Edit</button>
                <button onclick="handleDelete(${item.id})" class="font-bold bg-red-600 p-2 rounded-md text-white text-[18px] hover:bg-red-400 duration-300 cursor-pointer">Delete</button>
            </div>
        `;
        list.append(elItem);
    });
}

// Delete Product
const handleDelete = (id) => {
    axios.delete(url + "/" + id).then(() => getProducts());
};

// Create Product
function handleCreate() {
    modalWrapper.classList.remove("scale-0");
    modalInner.innerHTML = `
        <form autocomplete="off" class="w-[400px] add-form space-y-[10px] bg-white p-5 rounded-md">
            <input type="text" class="p-2 border-[2px] w-full rounded-md outline-none" placeholder="Enter title" name="title"/>
            <input type="number" class="p-2 border-[2px] w-full rounded-md outline-none" placeholder="Enter price" name="price"/>
            <input type="text" class="p-2 border-[2px] w-full rounded-md outline-none" placeholder="Enter description" name="description"/>
            <input type="text" class="p-2 border-[2px] w-full rounded-md outline-none" placeholder="Enter img" name="img"/>
            <button type="submit" class="bg-class text-white font-bold text-[20px] rounded-md w-full py-1 cursor-pointer duration-300">Create</button>
        </form>
    `;

    let elAddForm = document.querySelector(".add-form");
    elAddForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const data = {
            title: e.target.title.value,
            price: e.target.price.value,
            description: e.target.description.value,
            categoryId: 58,
            images: [e.target.img.value]
        };

        axios.post(url, data).then(() => {
            modalWrapper.classList.add("scale-0");
            getProducts();
        });
    });
}

// Edit Product
function handleEdit(id) {
    axios.get(url + `/${id}`).then(res => {
        modalWrapper.classList.remove("scale-0");
        modalInner.innerHTML = `
            <form autocomplete="off" class="w-[400px] edit-form space-y-[10px] bg-white p-5 rounded-md">
                <input value="${res.data.title}" class="p-2 border-[2px] w-full rounded-md outline-none" placeholder="Enter title" name="title"/>
                <input value="${res.data.price}" type="number" class="p-2 border-[2px] w-full rounded-md outline-none" placeholder="Enter price" name="price"/>
                <input value="${res.data.description}" class="p-2 border-[2px] w-full rounded-md outline-none" placeholder="Enter description" name="description"/>
                <input value="${res.data.images[0]}" class="p-2 border-[2px] w-full rounded-md outline-none" placeholder="Enter img" name="img"/>
                <button type="submit" class="bg-class text-white font-bold cursor-pointer text-[20px] rounded-md w-full py-1 duration-300">Update</button>
            </form>
        `;

        let elForm = document.querySelector(".edit-form");
        elForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const data = {
                id: id,
                title: e.target.title.value,
                price: e.target.price.value,
                description: e.target.description.value,
                categoryId: 58,
                images: [e.target.img.value]
            };
            axios.put(url + `/${id}`, data).then(() => {
                modalWrapper.classList.add("scale-0");
                reRender();
            });
        });
    });
}

// Modalni yopish
modalWrapper.addEventListener("click", function (e) {
    if (e.target === modalWrapper) {
        modalWrapper.classList.add("scale-0");
    }
});

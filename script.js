// https://fakestoreapi.com/products

const listCardGrid = document.getElementById('listCardGrid');
const loadPrevious = document.getElementById('loadPrevious');
const loadNext = document.getElementById('loadNext');
const activePaginatedBtn = document.getElementById('activePaginatedBtn');
const cartItems = []; // global cart items
const categoriesFilter = document.getElementById('categoriesFilter');
let allProducts = [];
let filteredProducts =[];
let totalProducts;
let page = 1;
const productsPerPage = 6;


const loadProducts = async ()=>{
    const start = (page -1) * productsPerPage;
    const end = start + productsPerPage;
    activePaginatedBtn.innerHTML = page
    
    // Fetch data from the API if the Allproduct is empty + setting the categories
    if(allProducts.length === 0)
    {
        const res = await fetch("https://fakestoreapi.com/products");
        allProducts = await res.json();
        filteredProducts = [...allProducts];
        totalProducts = filteredProducts.length;

        // Collect catigories from the data
        const catigoriesList = filteredProducts.reduce((acc, value)=>{   
            if(!acc.includes(value.category))
                acc.push(value.category);
            return acc;
        },[]);
        
        // Update Catigories drop menu
        categoriesFilter.innerHTML =`<option>All Categories</option>`;
        catigoriesList.forEach(item => {
            categoriesFilter.innerHTML += `
            <option>${item}</option>
        `;
        });
    }
    
    
    // Pagination and display data
    const PaginatedItems = filteredProducts.slice(start,end);
    const htmlString = PaginatedItems.map(
        (product) =>
             `
            <div class="product-card">
                <div class="image-container">
                    <img src="${product.image}" alt="Product Name">
                </div>
                <div class="product-info">
                    <h4>${product.title}</h4>
                    <p class="price">$${product.price}</p>
                    <p><strong>Rating:</strong> ${product.rating.rate} / 5</p>

                    <div class="card-buttons">
                        <button class="btn-details" onclick="viewDetails(${product.id})">View Details</button>
                        <button class="btn-add" onclick="addToCart(${product.id})">Add to Cart</button>
                    </div>
                </div>
            </div>
            `
        
    ).join('');

    if(listCardGrid)
    {
        listCardGrid.innerHTML = htmlString;
    }
    loadCartItems();
}

const loadCartItems = ()=>{
    const cartItemsUl = document.getElementById('cart-items');
    // const totalQuantity = document.getElementById('total-qty');
    // const totalPrice = document.getElementById('total-price');
    let totalQuantity = 0;
    let totalPrice = 0;
    cartItemsUl.innerHTML="";
    cartItems.forEach(item =>{

        totalQuantity += item.quantity;
        totalPrice += (item.quantity * item.item.price);
        cartItemsUl.innerHTML += `
            <li>${item.item.title} - $${item.item.price * item.quantity} ${item.quantity} <button class="remove-btn" onclick="removeItemFromCart(${item.item.id})">Remove</button></li>
        `;
    });
    document.getElementById('total-qty').innerHTML = totalQuantity;
    document.getElementById('total-price').innerHTML = `$${totalPrice.toFixed(2)}`
    
}

loadPrevious.addEventListener('click',()=>{
    if(page>1)
    {
        page--;
        console.log(page);
        loadProducts();
    }
})
loadNext.addEventListener('click',()=>{
    
    if(page < Math.ceil(totalProducts/productsPerPage))
    {
        console.log(page);
         page++;
        loadProducts();
    }
})
//  viewDetails
async function viewDetails(productId)
{   
    const productModal = document.getElementById('productModal');
    const modalBody = document.getElementById('modalBody');

    const res = await fetch(`https://fakestoreapi.com/products/${productId}`);
    const product = await res.json();
    
    productModal.classList.add('active');
    modalBody.innerHTML = 
    `
        <div class="modal-detail-container">
            <img src="${product.image}" alt="${product.title}">
            <div>
                <span class="category-badge">${product.category}</span>
                <h2>${product.title}</h2>
                <p><strong>Rating:</strong> ${product.rating.rate} / 5</p>
                <p>${product.description}</p>
                <h3 class="price">$${product.price}</h3>
                <button class="btn-add" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `;

}
// closeModal
function closeModal(){
    const productModal = document.getElementById('productModal');
    const modalBody = document.getElementById('modalBody');

    productModal.classList.remove('active');
    modalBody.innerHTML = "";
}
// addToCart
async function addToCart(productId){
    const res = await fetch(`https://fakestoreapi.com/products/${productId}`);
    const prod = await res.json();
    const prodObject = {
        item: prod,
        quantity: 1,
    }
    
    // check if the item added before
    const existingItem = cartItems.find(item => item.item.id === prodObject.item.id);
    if(existingItem)
    {
        existingItem.quantity +=1;
    }
    else 
    {
        cartItems.push(prodObject);
    }
    console.log(cartItems);
    
    loadCartItems();

}
// Remove Item from cart 
function removeItemFromCart(itemId)
{
    const index = cartItems.findIndex(i=>i.item.id === itemId)
    
    if(index !== -1)
    {
        if(cartItems[index].quantity >1)
        {
            cartItems[index].quantity-=1;
        }
        else{
            cartItems.splice(index, 1);
        }
    }
    
    loadCartItems();
}

// Sort by Price
let ascendingBool = false;
function sortByPrice()
{
    if(!ascendingBool)
    {
        filteredProducts.sort((a,b)=>a.price-b.price);
        ascendingBool =true
    }
    else{
        filteredProducts.reverse();
        ascendingBool = false;
    }
    loadProducts();
}
function sortByRating(){
    if(!ascendingBool)
    {
        filteredProducts.sort((a,b)=>a.rating.rate-b.rating.rate);
        ascendingBool =true
    }
    else{
        filteredProducts.reverse();
        ascendingBool = false;
    }
    loadProducts();
}
// Filter 
function applyFilter()
{
    // Get the values of the fields
    const searchInputField = document.getElementById('searchInputField').value;
    const minPriceInput = document.getElementById('minPriceInput').value;
    const maxPriceInput = document.getElementById('maxPriceInput').value;
    const selectedCategory = categoriesFilter.value;

    // return the item if  all the matches return true
    filteredProducts= allProducts.filter(item=>{
        const matchesSearch = item.title.toLowerCase().includes(searchInputField.toLowerCase());
        const matchesMinSearch = (minPriceInput == 0 || minPriceInput == '' )?true:item.price >= minPriceInput;
        const matchesMaxSearch = (maxPriceInput == 0 || maxPriceInput == '' )?true:item.price <= maxPriceInput;
        const matchesCategory = (selectedCategory === "All Categories") || (item.category === selectedCategory);

        return matchesCategory && matchesMaxSearch && matchesMinSearch && matchesSearch;
    });
    // Update the total for the pagination
    totalProducts = filteredProducts.length;
    page =1;
    loadProducts();
}
// Program start
loadProducts();
setTimeout(()=>{
    console.log(allProducts)
},1000)

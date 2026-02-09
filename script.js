// https://fakestoreapi.com/products

const listCardGrid = document.getElementById('listCardGrid');
const loadPrevious = document.getElementById('loadPrevious');
const loadNext = document.getElementById('loadNext');
const activePaginatedBtn = document.getElementById('activePaginatedBtn');
const cartItems = []; // global cart items

let totalProducts;
let page = 1;
const productsPerPage = 6;


const loadProducts = async ()=>{
    const start = (page -1) * productsPerPage;
    const end = start + productsPerPage;
    activePaginatedBtn.innerHTML = page
    // const paginateURL = `https://fakestoreapi.com/products?limit=${productsPerPage}&skip=${skip}`;
    const allProductsURL= "https://fakestoreapi.com/products";

    const products = await fetch(allProductsURL).then((res)=>res.json());

    totalProducts = products.length;
    console.log(totalProducts)
    const PaginatedItems = products.slice(start,end);

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
loadProducts();

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
    // check if the product already in cart then increase the quantity, price etc..

}
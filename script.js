// https://fakestoreapi.com/products

const listCardGrid = document.getElementById('listCardGrid');
const loadPrevious = document.getElementById('loadPrevious');
const loadNext = document.getElementById('loadNext');
let totalProducts 
let page = 1;
const productsPerPage = 6;

let lenght = 0;
const loadProducts = async ()=>{
    const start = (page -1) * productsPerPage;
    const end = start + productsPerPage;
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


// addToCart
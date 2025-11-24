// Function to Add Items to Cart (Used on Shop Page)
function addToCart(id, name, price) {
    // 1. Get existing cart from storage, or start empty array
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // 2. Check if item already exists
    let existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1; // If exists, just increase qty
    } else {
        // If new, add to array
        cart.push({ id: id, name: name, price: price, quantity: 1 });
    }

    // 3. Save back to storage
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(name + " added to cart!");
}

// Function to Load Cart Items (Used on Cart Page)
function loadCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartBody = document.getElementById('cart-body');
    
    // If on a page without the cart table, stop function
    if (!cartBody) return; 

    cartBody.innerHTML = ''; // Clear current table
    let subTotal = 0;

    if (cart.length === 0) {
        cartBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Your cart is empty.</td></tr>';
    }

    // Loop through items and build HTML
    cart.forEach((item, index) => {
        let itemTotal = item.price * item.quantity;
        subTotal += itemTotal;

        let row = `
            <tr>
                <td>${item.name}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>
                    <input type="number" class="qty-input" 
                           value="${item.quantity}" min="1" 
                           onchange="updateQuantity(${index}, this.value)">
                </td>
                <td>$${itemTotal.toFixed(2)}</td>
                <td>
                    <button class="btn-danger" style="padding:5px 10px;" onclick="removeFromCart(${index})">Remove</button>
                </td>
            </tr>
        `;
        cartBody.innerHTML += row;
    });

    // Calculate Totals
    updateTotals(subTotal);
}

// Update Quantity when user types in input
function updateQuantity(index, newQty) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (newQty < 1) {
        newQty = 1;
    }
    
    cart[index].quantity = parseInt(newQty);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart(); // Refresh the table
}

// Remove Item
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1); // Remove item at that index
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart(); // Refresh table
}

// Clear All
function clearCart() {
    localStorage.removeItem('cart');
    loadCart();
}

// Calculate Math
function updateTotals(subTotal) {
    let tax = subTotal * 0.10;
    let total = subTotal + tax;

    document.getElementById('sub-total').innerText = subTotal.toFixed(2);
    document.getElementById('tax').innerText = tax.toFixed(2);
    document.getElementById('grand-total').innerText = total.toFixed(2);
    
    // Save final total to storage for Checkout page to see
    localStorage.setItem('finalTotal', total.toFixed(2));
}



/* --- CHECKOUT PAGE LOGIC --- */

// 1. Load Cart Totals into Checkout Page
function loadCheckout() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let savedTotal = localStorage.getItem('finalTotal'); // Retrieved from what we calculated in cart.html

    // If no total saved, calculate it manually
    if (!savedTotal) {
        let subTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        let tax = subTotal * 0.10;
        savedTotal = (subTotal + tax).toFixed(2);
    }

    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Update HTML elements
    let itemsEl = document.getElementById('checkout-items');
    let totalEl = document.getElementById('checkout-total');
    let payInput = document.getElementById('payment');

    if (itemsEl) itemsEl.innerText = totalItems;
    if (totalEl) totalEl.innerText = "$" + savedTotal;
    
    // Auto-fill the payment input and lock it to the correct amount
    if (payInput) {
        payInput.value = savedTotal;
        payInput.min = savedTotal;
    }
}

// 2. Process Order (When clicking "Confirm & Checkout")
function processOrder(event) {
    event.preventDefault(); // Stop the form from submitting normally

    // Get the user's input
    let customerName = document.getElementById('name').value;
    let customerAddress = document.getElementById('address').value;

    // Save details to LocalStorage so Invoice page can read them
    let orderDetails = {
        name: customerName,
        address: customerAddress,
        date: new Date().toLocaleDateString(),
        orderId: Math.floor(Math.random() * 10000) // Generate random Order ID
    };

    localStorage.setItem('orderDetails', JSON.stringify(orderDetails));

    // Redirect to Invoice
    window.location.href = "invoice.html";
}
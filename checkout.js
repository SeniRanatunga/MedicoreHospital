
document.addEventListener("DOMContentLoaded", () => {
    // Retrieve the order summary from localStorage or initialize as an empty array
    const orderSummary = JSON.parse(localStorage.getItem("cart")) || [];

    // Get references to the DOM elements
    const summaryBody = document.getElementById("summary-body"); 
    const totalAmount = document.getElementById("total-amount"); 
    const checkoutForm = document.getElementById("checkout-form"); 
    const cardDetails = document.getElementById("card-details"); 
    const paymentMethod = document.getElementById("payment-method"); 

    let total = 0;

    // giving the order summary in the table
    if (orderSummary.length === 0) {
        summaryBody.innerHTML = '<tr><td colspan="3">No items in your cart.</td></tr>';
    } else {
        // Loop through each item in the order summary
        orderSummary.forEach(item => {
            const row = document.createElement("tr"); // Create a new row for the item
            row.innerHTML = `
                <td>${item.name}</td> <!-- Item name -->
                <td>${item.quantity}</td> <!-- Quantity -->
                <td>LKR ${(item.quantity * item.price).toFixed(2)}</td> <!-- Total price for the item -->
            `;
            summaryBody.appendChild(row);
            total += item.quantity * item.price; 
        });
    }
    totalAmount.textContent = `LKR ${total.toFixed(2)}`;

    // card payment's details
    paymentMethod.addEventListener("change", () => {
        if (paymentMethod.value === "card") {
            // Show card details if the payment method is 'card'
            cardDetails.classList.remove("hidden");
        } else {
            cardDetails.classList.add("hidden");
        }
    });

    
    checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent the default form submission

        // Get values from the form fields
        const name = document.getElementById("name").value.trim(); 
        const email = document.getElementById("email").value.trim(); 
        const address = document.getElementById("address").value.trim(); 
        const selectedPaymentMethod = paymentMethod.value; 

        // Validate required fields
        if (!name || !email || !address || !selectedPaymentMethod) {
            alert("Please fill out all required fields."); 
            return;
        }

        //Validation for card payment
        if (selectedPaymentMethod === "card") {
            const cardNumber = document.getElementById("card-number").value.trim(); 
            const expiryDate = document.getElementById("expiry-date").value.trim();
            const cvv = document.getElementById("cvv").value.trim(); 

            // Validate card details
            if (!cardNumber || !expiryDate || !cvv) {
                alert("Please complete all card details."); 
                return;
            }

            
            if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
                alert("Invalid card number."); 
                return;
            }

            
            if (cvv.length !== 3 || !/^\d+$/.test(cvv)) {
                alert("Invalid CVV."); 
                return;
            }
        }

        // Show a processing message
        alert("Processing your order...");
        setTimeout(() => {
            alert("Order placed successfully!");
            localStorage.removeItem("cart");
            checkoutForm.reset();
            cardDetails.classList.add("hidden");
        }, 1000); //Delay before confirmation
    });
});

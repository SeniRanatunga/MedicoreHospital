const medicineContainer = document.getElementById("medicine-container");
const cartTableBody = document.querySelector("tbody");
const totalCell = document.querySelector("tfoot td:last-child");
const favourites = []; // Array to store favourite items

// Load JSON data
fetch("order.json")
  .then(response => response.json())
  .then(data => renderMedicines(data.categories))
  .catch(error => console.error("Error loading JSON:", error));

// Function to render medicines dynamically based on categories
function renderMedicines(categories) {
  categories.forEach(category => {
    const section = document.createElement("section");
    section.innerHTML = `<h2>${category.name}</h2>`;
    category.items.forEach(medicine => {
      const medicineItem = document.createElement("div");
      medicineItem.className = "medicine-item";
      medicineItem.innerHTML = `
        <h3>${medicine.name}</h3>
        <img src="${medicine.img || 'images/placeholder.jpg'}" alt="${medicine.name}" />
        <p>Price: ${medicine.currency} ${medicine.price.toFixed(2)}</p>
        <input type="number" min="1" placeholder="Quantity">
        <button class="buttons add-to-cart">Add to Cart</button>
      `;
      // Template for each medicine item
      section.appendChild(medicineItem);

      medicineItem.querySelector(".add-to-cart").addEventListener("click", () => handleAddToCart(medicineItem, medicine));
    });
    // Append the category section to the container
    medicineContainer.appendChild(section);
  });
}

function handleAddToCart(medicineItem, medicine) {
  const itemName = medicineItem.querySelector("h3").innerText;
  const quantityInput = medicineItem.querySelector("input[type='number']");
  const quantity = parseInt(quantityInput.value);

  if (quantity > 0) {
    addItemToCart(itemName, quantity, medicine.price, medicine.currency);
    quantityInput.value = ""; // Clear input field
  } else {
    alert("Please enter a valid quantity.");
  }
}

function addItemToCart(itemName, quantity, price, currency) {
  const existingRow = Array.from(cartTableBody.rows).find(row => row.cells[0].innerText === itemName);

  if (existingRow) { // Update quantity and price for existing item
    const existingQuantity = parseInt(existingRow.cells[1].innerText);
    existingRow.cells[1].innerText = existingQuantity + quantity;
    existingRow.cells[2].innerText = (existingQuantity + quantity) * price;
  } else {
    const row = cartTableBody.insertRow();  // Add a new row for the item if it doesn't already exist
    row.innerHTML = `
      <td>${itemName}</td>
      <td>${quantity}</td>
      <td>${(quantity * price).toFixed(2)}</td>
      <td><button class="remove-btn">Remove</button></td>
    `;
    row.querySelector(".remove-btn").addEventListener("click", () => row.remove());
  }

  updateTotal(); // Recalculate total after adding an item
}

function updateTotal() {
  const total = Array.from(cartTableBody.rows).reduce((sum, row) => {
    return sum + parseFloat(row.cells[2].innerText);
  }, 0);
  totalCell.innerText = `LKR ${total.toFixed(2)}`;
}

// Add items in the cart to favourites
document.getElementById("add-to-favourites").addEventListener("click", () => {
  const cartItems = Array.from(cartTableBody.rows).map(row => {
    return {
      name: row.cells[0].innerText,
      quantity: parseInt(row.cells[1].innerText),
      price: parseFloat(row.cells[2].innerText) / parseInt(row.cells[1].innerText) // Save price per unit
    };
  });

  if (cartItems.length > 0) {
    favourites.push(cartItems); // Save both name and quantity to favourites
    alert("Items added to favourites.");
  } else {
    alert("Your cart is empty.");
  }
});

// Apply favourite items to the cart
document.getElementById("apply-favourite").addEventListener("click", () => {
  if (favourites.length > 0) {
    const lastFavourites = favourites[favourites.length - 1]; // Get the most recent favourite list
    lastFavourites.forEach(item => {
      const itemName = item.name;
      const quantity = item.quantity;
      const price = item.price; // Fetch the price per unit from the favourites list

      const medicineItem = Array.from(medicineContainer.getElementsByClassName("medicine-item")).find(item => item.querySelector("h3").innerText === itemName);
      if (medicineItem) {
        const quantityInput = medicineItem.querySelector("input[type='number']");
        quantityInput.value = quantity; // Set the correct quantity from favourites
        handleAddToCart(medicineItem, {
          name: itemName,
          price: price, // Use the price saved in favourites
          currency: 'LKR'
        });
      }
    });
  } else {
    alert("No favourite items available.");
  }
});

// Proceed to checkout and store the cart in localStorage
document.getElementById("buy-now-button").addEventListener("click", () => {
  const cartItems = Array.from(cartTableBody.rows).map(row => ({
    name: row.cells[0].innerText,
    quantity: parseInt(row.cells[1].innerText),
    price: parseFloat(row.cells[2].innerText) / parseInt(row.cells[1].innerText) // Unit price
  }));

  if (cartItems.length > 0) {
    localStorage.setItem("cart", JSON.stringify(cartItems)); // Save cart to localStorage
    window.location.href = "checkout.html"; // Navigate to checkout page
  } else {
    alert("Your cart is empty. Please add items before proceeding.");
  }
});

// Function to save item
function saveItem() {
    // Get values from form
    let itemId = $('#itemId').val();
    let itemName = $('#itemName').val();
    let itemPrice = parseFloat($('#itemPrice').val());
    let itemQuantity = parseInt($('#itemQuantity').val());
    let itemCost = parseFloat($('#itemCost').val()) || 0;
    let itemDescription = $('#itemDescription').val();

    // Validation
    if (!itemId || !itemName || !itemPrice || !itemQuantity) {
        alert("Please fill in all required fields!");
        return;
    }

    // Validate price and quantity are positive numbers
    if (itemPrice <= 0) {
        alert("Item price must be greater than 0!");
        return;
    }

    if (itemQuantity < 0) {
        alert("Item quantity cannot be negative!");
        return;
    }

    console.log("Saving item:", itemId, itemName, itemPrice, itemQuantity);

    $.ajax({
        url: "http://localhost:8080/api/v1/item",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            "itemId": itemId,
            "itemName": itemName,
            "itemPrice": itemPrice,
            "itemQuantity": itemQuantity,
            "itemCost": itemCost,
            "itemDescription": itemDescription
        }),
        success: function(response) {
            console.log("Item saved successfully!");
            alert("Item Saved!");
            // Clear form
            $('#itemForm')[0].reset();
            // Reload item list
            loadItems();
        },
        error: function(xhr, status, error) {
            console.error(xhr.responseText);
            alert("Error saving item: " + xhr.responseText);
        }
    });
}

// Function to update item
function updateItem() {
    let itemId = $('#itemId').val();
    let itemName = $('#itemName').val();
    let itemPrice = parseFloat($('#itemPrice').val());
    let itemQuantity = parseInt($('#itemQuantity').val());
    let itemCost = parseFloat($('#itemCost').val()) || 0;
    let itemDescription = $('#itemDescription').val();

    // Validation
    if (!itemId || !itemName || !itemPrice || !itemQuantity) {
        alert("Please fill in all required fields!");
        return;
    }

    if (itemPrice <= 0) {
        alert("Item price must be greater than 0!");
        return;
    }

    if (itemQuantity < 0) {
        alert("Item quantity cannot be negative!");
        return;
    }

    $.ajax({
        url: "http://localhost:8080/api/v1/item/" + itemId,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify({
            "itemId": itemId,
            "itemName": itemName,
            "itemPrice": itemPrice,
            "itemQuantity": itemQuantity,
            "itemCost": itemCost,
            "itemDescription": itemDescription
        }),
        success: function(response) {
            alert("Item Updated!");
            $('#itemForm')[0].reset();
            loadItems();
        },
        error: function(xhr, status, error) {
            console.error(xhr.responseText);
            alert("Error updating item: " + xhr.responseText);
        }
    });
}

// Function to delete item
function deleteItem() {
    let itemId = $('#itemId').val();

    if (!itemId) {
        alert("Please enter Item ID to delete!");
        return;
    }

    if (confirm("Are you sure you want to delete item " + itemId + "?")) {
        $.ajax({
            url: "http://localhost:8080/api/v1/item/" + itemId,
            method: "DELETE",
            success: function(response) {
                alert("Item Deleted!");
                $('#itemForm')[0].reset();
                loadItems();
            },
            error: function(xhr, status, error) {
                console.error(xhr.responseText);
                alert("Error deleting item: " + xhr.responseText);
            }
        });
    }
}

// Function to load all items
function loadItems() {
    $.ajax({
        url: "http://localhost:8080/api/v1/item",
        method: "GET",
        success: function(items) {
            let tbody = $('#itemTableBody');
            tbody.empty(); // Clear existing rows

            items.forEach(function(item) {
                let row = `<tr onclick="populateForm('${item.itemId}', '${item.itemName}', ${item.itemPrice}, ${item.itemQuantity}, ${item.itemCost}, '${item.itemDescription || ''}')">
                    <td>${item.itemId}</td>
                    <td>${item.itemName}</td>
                    <td>Rs. ${item.itemPrice.toFixed(2)}</td>
                    <td>${item.itemQuantity}</td>
                    <td>Rs. ${item.itemCost.toFixed(2)}</td>
                    <td>${item.itemDescription || '-'}</td>
                </tr>`;
                tbody.append(row);
            });
        },
        error: function(xhr, status, error) {
            console.error("Error loading items: " + xhr.responseText);
        }
    });
}

// Function to populate form when clicking on table row
function populateForm(id, name, price, quantity, cost, description) {
    $('#itemId').val(id);
    $('#itemName').val(name);
    $('#itemPrice').val(price);
    $('#itemQuantity').val(quantity);
    $('#itemCost').val(cost);
    $('#itemDescription').val(description);
}

// Load items when page loads
$(document).ready(function() {
    loadItems();

    // Add input validation for numeric fields
    $('#itemPrice, #itemCost').on('input', function() {
        // Allow only numbers and decimal point
        this.value = this.value.replace(/[^0-9.]/g, '');

        // Prevent multiple decimal points
        const parts = this.value.split('.');
        if (parts.length > 2) {
            this.value = parts[0] + '.' + parts.slice(1).join('');
        }
    });

    $('#itemQuantity').on('input', function() {
        // Allow only integers
        this.value = this.value.replace(/[^0-9]/g, '');
    });
});
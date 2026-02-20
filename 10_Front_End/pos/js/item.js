const BASE_URL = "http://localhost:8080/api/v1/item";

// ================= SAVE ITEM =================
function saveItem() {
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

    console.log("Saving item:", itemId, itemName, itemPrice, itemQuantity);

    $.ajax({
        url: BASE_URL,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            itemId,
            itemName,
            itemPrice,
            itemQuantity,
            itemCost,
            itemDescription
        }),
        success: function(response) {
            alert(response.message || "Item Saved!");
            $('#itemForm')[0].reset();
            loadItems();
        },
        error: function(xhr) {
            let msg = xhr.responseJSON?.message || xhr.responseText || "Error saving item!";
            console.error(msg);
            alert("Error: " + msg);
        }
    });
}

// ================= UPDATE ITEM =================
function updateItem() {
    let itemId = $('#itemId').val();
    let itemName = $('#itemName').val();
    let itemPrice = parseFloat($('#itemPrice').val());
    let itemQuantity = parseInt($('#itemQuantity').val());
    let itemCost = parseFloat($('#itemCost').val()) || 0;
    let itemDescription = $('#itemDescription').val();

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
        url: BASE_URL + "/" + itemId,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify({
            itemId,
            itemName,
            itemPrice,
            itemQuantity,
            itemCost,
            itemDescription
        }),
        success: function(response) {
            alert(response.message || "Item Updated!");
            $('#itemForm')[0].reset();
            loadItems();
        },
        error: function(xhr) {
            let msg = xhr.responseJSON?.message || xhr.responseText || "Error updating item!";
            console.error(msg);
            alert("Error: " + msg);
        }
    });
}

// ================= DELETE ITEM =================
function deleteItem() {
    let itemId = $('#itemId').val();
    if (!itemId) {
        alert("Please select an Item ID to delete!");
        return;
    }

    if (confirm("Are you sure you want to delete item " + itemId + "?")) {
        $.ajax({
            url: BASE_URL + "/" + itemId,
            method: "DELETE",
            success: function(response) {
                alert(response.message || "Item Deleted!");
                $('#itemForm')[0].reset();
                loadItems();
            },
            error: function(xhr) {
                let msg = xhr.responseJSON?.message || xhr.responseText || "Error deleting item!";
                console.error(msg);
                alert("Error: " + msg);
            }
        });
    }
}

// ================= LOAD ITEMS =================
function loadItems() {
    $.ajax({
        url: BASE_URL,
        method: "GET",
        success: function(response) {
            let items = response.data || []; // ✅ safe: get array from backend
            let tbody = $('#itemTableBody');
            tbody.empty();

            items.forEach(function(item) {
                let row = `<tr onclick="populateForm('${item.itemId}', '${item.itemName}', ${item.itemPrice}, ${item.itemQuantity}, ${item.itemCost || 0}, '${item.itemDescription || ''}')">
                    <td>${item.itemId}</td>
                    <td>${item.itemName}</td>
                    <td>Rs. ${item.itemPrice.toFixed(2)}</td>
                    <td>${item.itemQuantity}</td>
                    <td>Rs. ${item.itemCost?.toFixed(2) || '0.00'}</td>
                    <td>${item.itemDescription || '-'}</td>
                </tr>`;
                tbody.append(row);
            });
        },
        error: function(xhr) {
            let msg = xhr.responseJSON?.message || xhr.responseText || "Failed to load items!";
            console.error(msg);
            alert(msg);
        }
    });
}

// ================= POPULATE FORM =================
function populateForm(id, name, price, quantity, cost, description) {
    $('#itemId').val(id);
    $('#itemName').val(name);
    $('#itemPrice').val(price);
    $('#itemQuantity').val(quantity);
    $('#itemCost').val(cost);
    $('#itemDescription').val(description);
}

// ================= CLEAR FORM =================
function clearForm() {
    $('#itemForm')[0].reset();
    $('#itemId').val('');
}

// ================= PAGE LOAD =================
$(document).ready(function() {
    loadItems();

    // Input validation
    $('#itemPrice, #itemCost').on('input', function() {
        this.value = this.value.replace(/[^0-9.]/g, '');
        const parts = this.value.split('.');
        if (parts.length > 2) {
            this.value = parts[0] + '.' + parts.slice(1).join('');
        }
    });

    $('#itemQuantity').on('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
});


const BASE_URL = "http://localhost:8080/api/v1";


function saveOrder() {
    const orderId       = $('#orderId').val().trim();
    const customerId    = $('#customerId').val().trim();
    const itemId        = $('#itemId').val().trim();
    const itemName      = $('#itemName').val().trim();
    const quantity      = parseInt($('#quantity').val());
    const price         = parseFloat($('#price').val());
    const totalPrice    = parseFloat($('#totalPrice').val());

    // --- Validation ---
    if (!orderId || !customerId || !itemId || !itemName) {
        showAlert("danger", "Please fill in all required fields!");
        return;
    }
    if (isNaN(quantity) || quantity <= 0) {
        showAlert("danger", "Quantity must be greater than 0!");
        return;
    }
    if (isNaN(price) || price <= 0) {
        showAlert("danger", "Price must be greater than 0!");
        return;
    }

    $.ajax({
        url: BASE_URL + "/order",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            "orderId": orderId,
            "customerId": customerId,
            "itemId": itemId,
            "itemName": itemName,
            "quantity": quantity,
            "price": price,
            "totalPrice": totalPrice
        }),
        success: function () {
            showAlert("success", "Order placed successfully!");
            resetForm();
            loadOrders();
        },
        error: function (xhr) {
            showAlert("danger", xhr.responseText || "Error placing order!");
        }
    });
}


function updateOrder() {
    const orderId       = $('#orderId').val().trim();
    const customerId    = $('#customerId').val().trim();
    const itemId        = $('#itemId').val().trim();
    const itemName      = $('#itemName').val().trim();
    const quantity      = parseInt($('#quantity').val());
    const price         = parseFloat($('#price').val());
    const totalPrice    = parseFloat($('#totalPrice').val());

    if (!orderId || !customerId || !itemId || !itemName) {
        showAlert("danger", "Please fill in all required fields!");
        return;
    }
    if (isNaN(quantity) || quantity <= 0) {
        showAlert("danger", "Quantity must be greater than 0!");
        return;
    }
    if (isNaN(price) || price <= 0) {
        showAlert("danger", "Price must be greater than 0!");
        return;
    }

    $.ajax({
        url: BASE_URL + "/order/" + orderId,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify({
            "orderId": orderId,
            "customerId": customerId,
            "itemId": itemId,
            "itemName": itemName,
            "quantity": quantity,
            "price": price,
            "totalPrice": totalPrice
        }),
        success: function () {
            showAlert("success", "Order updated successfully!");
            resetForm();
            loadOrders();
        },
        error: function (xhr) {
            showAlert("danger", xhr.responseText || "Error updating order!");
        }
    });
}


function deleteOrder() {
    const orderId = $('#orderId').val().trim();

    if (!orderId) {
        showAlert("danger", "Please enter Order ID to delete!");
        return;
    }

    if (!confirm('Are you sure you want to delete order "' + orderId + '"?')) return;

    $.ajax({
        url: BASE_URL + "/order/" + orderId,
        method: "DELETE",
        success: function () {
            showAlert("success", "Order deleted successfully!");
            resetForm();
            loadOrders();
        },
        error: function (xhr) {
            showAlert("danger", xhr.responseText || "Error deleting order!");
        }
    });
}


function loadOrders() {
    $.ajax({
        url: BASE_URL + "/order",
        method: "GET",
        success: function (orders) {
            const tbody = $('#orderTableBody');
            tbody.empty();

            if (orders.length === 0) {
                tbody.append('<tr><td colspan="7" class="text-center text-muted">No orders found.</td></tr>');
                return;
            }

            orders.forEach(function (order) {
                const row = '<tr class="order-row" onclick="populateForm(\'' +
                    order.orderId + '\',\'' +
                    order.customerId + '\',\'' +
                    order.itemId + '\',\'' +
                    order.itemName + '\',' +
                    order.quantity + ',' +
                    order.price + ',' +
                    order.totalPrice + ')">' +
                    '<td>' + order.orderId + '</td>' +
                    '<td>' + order.customerId + '</td>' +
                    '<td>' + order.itemId + '</td>' +
                    '<td>' + order.itemName + '</td>' +
                    '<td>' + order.quantity + '</td>' +
                    '<td>Rs. ' + order.price.toFixed(2) + '</td>' +
                    '<td><strong>Rs. ' + order.totalPrice.toFixed(2) + '</strong></td>' +
                    '</tr>';
                tbody.append(row);
            });
        },
        error: function (xhr) {
            console.error("Error loading orders:", xhr.responseText);
        }
    });
}


function populateForm(orderId, customerId, itemId, itemName, quantity, price, totalPrice) {
    $('#orderId').val(orderId);
    $('#customerId').val(customerId);
    $('#itemId').val(itemId);
    $('#itemName').val(itemName);
    $('#quantity').val(quantity);
    $('#price').val(price);
    $('#totalPrice').val(totalPrice);
}


function resetForm() {
    $('#orderForm')[0].reset();
    $('#totalPrice').val('');
}

function showAlert(type, message) {
    var alertHtml = '<div class="alert alert-' + type +
        ' alert-dismissible fade show" role="alert">' +
        message +
        '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>' +
        '</div>';
    $('#alertBox').html(alertHtml);
    setTimeout(function() {
        $('#alertBox .alert').fadeOut(300, function() { $(this).remove(); });
    }, 3000);
}


$(document).ready(function () {
    loadOrders();

    // Auto-calculate total price
    $('#quantity, #price').on('input', function () {
        const quantity  = parseFloat($('#quantity').val()) || 0;
        const price     = parseFloat($('#price').val()) || 0;
        const total     = quantity * price;
        $('#totalPrice').val(total > 0 ? total.toFixed(2) : '');
    });

    // Only allow integers in quantity
    $('#quantity').on('input', function () {
        this.value = this.value.replace(/[^0-9]/g, '');
    });

    // Only allow numbers and one decimal in price
    $('#price').on('input', function () {
        this.value = this.value.replace(/[^0-9.]/g, '');
        const parts = this.value.split('.');
        if (parts.length > 2) this.value = parts[0] + '.' + parts.slice(1).join('');
    });
});
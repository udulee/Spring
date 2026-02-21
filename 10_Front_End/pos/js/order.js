
const BASE_URL = "http://localhost:8080/api/v1";

// itemId (integer) → { itemName, itemQuantity, itemPrice }
let itemMap = {};
let selectedItemStock = 0;

function showSpinner() { $('#loadingOverlay').addClass('show'); }
function hideSpinner() { $('#loadingOverlay').removeClass('show'); }

//   Alert helper
function showAlert(type, message) {
    const icon = type === 'success' ? 'fa-check-circle'
        : type === 'warning' ? 'fa-exclamation-triangle'
            : 'fa-times-circle';
    $('#alertBox').html(`
      <div class="alert alert-${type} alert-dismissible fade show shadow" role="alert">
        <i class="fas ${icon} me-2"></i>${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>`);
    setTimeout(() => $('#alertBox .alert').fadeOut(400, function(){ $(this).remove(); }), 4500);
}

// Load Customers

function loadCustomers() {
    $.ajax({
        url: BASE_URL + "/customer",
        method: "GET",
        success: function (res) {
            // res is APIResponse → unwrap res.data
            const customers = res.data;
            const $sel = $('#customerId');
            $sel.empty().append('<option value="">-- Select Customer --</option>');

            if (!customers || customers.length === 0) {
                $sel.append('<option disabled>No customers found</option>');
                return;
            }

            customers.forEach(function(c) {

                $sel.append(
                    $('<option>').val(c.cId).text(c.cId + ' — ' + c.cName)
                );
            });
        },
        error: function (xhr) {
            console.error("[ERROR] loadCustomers:", xhr.status, xhr.responseText);
            showAlert('danger', 'Failed to load customers. Is the server running?');
        }
    });
}

//  Load Items

function loadItems() {
    $.ajax({
        url: BASE_URL + "/item",
        method: "GET",
        success: function (res) {
            // res is APIResponse → unwrap res.data
            const items = res.data;
            const $sel = $('#itemId');
            $sel.empty().append('<option value="">-- Select Item --</option>');
            itemMap = {};

            if (!items || items.length === 0) {
                $sel.append('<option disabled>No items found</option>');
                return;
            }

            items.forEach(function(item) {

                itemMap[String(item.itemId)] = {
                    itemName:     item.itemName,
                    itemQuantity: item.itemQuantity,
                    itemPrice:    item.itemPrice
                };
                $sel.append(
                    $('<option>')
                        .val(item.itemId)
                        .text(item.itemId + ' — ' + item.itemName + ' (Stock: ' + item.itemQuantity + ')')
                );
            });
        },
        error: function () {
            showAlert('danger', 'Failed to load items. Is the server running?');
        }
    });
}

//  Item dropdown change → auto-fill name, price, stock
$(document).on('change', '#itemId', function() {
    const key = String($(this).val());
    if (key && itemMap[key]) {
        const item = itemMap[key];
        $('#itemName').val(item.itemName);
        // FIX #3: use item.itemPrice (not item.price)
        $('#price').val(item.itemPrice.toFixed(2));
        selectedItemStock = item.itemQuantity;

        $('#stockBadge').text(item.itemQuantity)
            .removeClass('bg-success bg-danger bg-warning text-dark')
            .addClass(
                item.itemQuantity > 10 ? 'bg-success text-white' :
                    item.itemQuantity > 0  ? 'bg-warning text-dark'  : 'bg-danger text-white'
            );
        $('#stockInfo').show();
        recalcTotal();
    } else {
        $('#itemName').val('');
        $('#price').val('');
        selectedItemStock = 0;
        $('#stockInfo').hide();
        $('#totalPrice').val('');
    }
});

//  Auto-calculate total
function recalcTotal() {
    const qty   = parseInt($('#quantity').val())   || 0;
    const price = parseFloat($('#price').val())    || 0;
    const total = qty * price;
    $('#totalPrice').val(total > 0 ? total.toFixed(2) : '');
}

$('#quantity').on('input', function() {
    // Only positive integers
    this.value = this.value.replace(/[^0-9]/g, '');
    if (this.value === '0') this.value = '';
    recalcTotal();
});

// SAVE ORDER
function saveOrder() {
    const customerId = String($('#customerId').val()).trim();
    const itemId     = String($('#itemId').val()).trim();
    const itemName   = $('#itemName').val().trim();
    const quantity   = parseInt($('#quantity').val());
    const price      = parseFloat($('#price').val());

    if (!customerId || customerId === 'undefined') {
        showAlert('warning', 'Please select a customer!'); return; }
    if (!itemId || itemId === 'undefined') {
        showAlert('warning', 'Please select an item!'); return; }
    if (!quantity || quantity < 1) {
        showAlert('warning', 'Quantity must be at least 1!'); return; }
    if (!price || price <= 0) {
        showAlert('warning', 'Item price is missing — please re-select the item.'); return; }
    if (quantity > selectedItemStock) {
        showAlert('warning', 'Insufficient stock! Only ' + selectedItemStock + ' available.'); return; }

    const payload = {
        orderId:    null,        // backend sets orderId to null anyway — auto-generated
        customerId: customerId,  // String e.g. "3"
        itemId:     itemId,      // String e.g. "2"
        itemName:   itemName,    // Service will overwrite with DB value
        quantity:   quantity,
        price:      price,
        totalPrice: price * quantity
    };

    showSpinner();
    $.ajax({
        url: BASE_URL + "/order",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(payload),
        success: function(res) {
            hideSpinner();
            showAlert('success', res.message || 'Order placed successfully!');
            resetForm();
            loadOrders();
            loadItems();  // refresh stock counts in dropdown
        },
        error: function(xhr) {
            hideSpinner();
            console.error("[saveOrder error]", xhr.status, xhr.responseText);
            const body = xhr.responseJSON;
            // Handle both plain message and validation error map
            let msg = 'Error placing order!';
            if (body) {
                if (body.message) msg = body.message;
                if (body.data && typeof body.data === 'object') {
                    // Validation errors: { fieldName: "message", ... }
                    msg = Object.values(body.data).join('<br>');
                }
            }
            showAlert('danger', msg);
        }
    });
}

//  UPDATE ORDER
function updateOrder() {
    const orderId    = parseInt($('#orderId').val());
    const customerId = String($('#customerId').val()).trim();
    const itemId     = String($('#itemId').val()).trim();
    const itemName   = $('#itemName').val().trim();
    const quantity   = parseInt($('#quantity').val());
    const price      = parseFloat($('#price').val());

    if (!orderId)    { showAlert('warning', 'Select an order row first!'); return; }
    if (!customerId) { showAlert('warning', 'Please select a customer!'); return; }
    if (!itemId)     { showAlert('warning', 'Please select an item!'); return; }
    if (!quantity || quantity < 1) { showAlert('warning', 'Quantity must be at least 1!'); return; }
    if (!price || price <= 0)     { showAlert('warning', 'Price must be greater than 0!'); return; }

    showSpinner();
    $.ajax({
        url: BASE_URL + "/order/" + orderId,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify({ orderId, customerId, itemId, itemName, quantity, price, totalPrice: price * quantity }),
        success: function(res) {
            hideSpinner();
            showAlert('success', res.message || 'Order updated successfully!');
            resetForm();
            loadOrders();
            loadItems();
        },
        error: function(xhr) {
            hideSpinner();
            const body = xhr.responseJSON;
            showAlert('danger', body ? body.message : 'Error updating order!');
        }
    });
}

//  DELETE ORDER
function deleteOrder() {
    const orderId = parseInt($('#orderId').val());
    if (!orderId) { showAlert('warning', 'Select an order row first!'); return; }
    if (!confirm('Delete order #' + orderId + '? Item stock will be restored.')) return;

    showSpinner();
    $.ajax({
        url: BASE_URL + "/order/" + orderId,
        method: "DELETE",
        success: function(res) {
            hideSpinner();
            showAlert('success', res.message || 'Order deleted!');
            resetForm();
            loadOrders();
            loadItems();
        },
        error: function(xhr) {
            hideSpinner();
            const body = xhr.responseJSON;
            showAlert('danger', body ? body.message : 'Error deleting order!');
        }
    });
}

//  LOAD ALL ORDERS
function loadOrders() {
    $.ajax({
        url: BASE_URL + "/order",
        method: "GET",
        success: function(res) {

            const orders = res.data;
            const $tbody = $('#orderTableBody');
            $tbody.empty();

            if (!orders || orders.length === 0) {
                $tbody.html('<tr><td colspan="6" class="text-center text-muted py-4">' +
                    '<i class="fas fa-inbox me-2"></i>No orders found.</td></tr>');
                return;
            }

            orders.forEach(function(o) {
                const $row = $('<tr>').attr('title', 'Click to edit').css('cursor', 'pointer');
                $row.append('<td><span class="order-id-badge">#' + o.orderId + '</span></td>');
                $row.append('<td>' + escHtml(o.customerId) + '</td>');
                $row.append('<td>' + escHtml(o.itemName)   + '</td>');
                $row.append('<td><span class="badge bg-primary">' + o.quantity + '</span></td>');
                $row.append('<td>Rs. ' + o.price.toFixed(2) + '</td>');
                $row.append('<td class="total-price">Rs. ' + o.totalPrice.toFixed(2) + '</td>');

                // Click row → populate form for edit/delete
                $row.on('click', function() {
                    populateForm(o.orderId, o.customerId, o.itemId, o.itemName, o.quantity, o.price, o.totalPrice);
                });

                $tbody.append($row);
            });
        },
        error: function(xhr) {
            console.error("[loadOrders error]", xhr.responseText);
            $('#orderTableBody').html('<tr><td colspan="6" class="text-center text-danger py-3">' +
                '<i class="fas fa-exclamation-triangle me-2"></i>Failed to load orders.</td></tr>');
        }
    });
}

//  Populate form from clicked row
function populateForm(orderId, customerId, itemId, itemName, quantity, price, totalPrice) {
    $('#orderId').val(orderId);
    $('#customerId').val(String(customerId));
    $('#itemId').val(String(itemId)).trigger('change');  // triggers auto-fill

    // Small delay to let the 'change' event finish filling in values
    setTimeout(function() {
        $('#itemName').val(itemName);    // ensure actual saved name shows
        $('#quantity').val(quantity);
        $('#price').val(price.toFixed(2));
        $('#totalPrice').val(totalPrice.toFixed(2));
    }, 60);
}

// Reset form
function resetForm() {
    $('#orderForm')[0].reset();
    $('#orderId, #itemName').val('');
    $('#totalPrice').val('');
    $('#stockInfo').hide();
    selectedItemStock = 0;
}


function escHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g,'&amp;').replace(/</g,'&lt;')
        .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}


$(document).ready(function() {
    loadCustomers();
    loadItems();
    loadOrders();
});

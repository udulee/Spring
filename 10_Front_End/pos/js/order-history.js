const HISTORY_BASE  = "http://localhost:8080/api/v1";
const ITEMS_PER_PAGE = 10;

let allOrders      = [];   // full list from server
let filteredOrders = [];   // after search / filter
let currentPage    = 1;

//  LOAD HISTORY
function loadHistory() {
    showTableLoading();

    $.ajax({
        url: HISTORY_BASE + "/order/history",
        method: "GET",
        success: function (res) {
            //         so we must unwrap .data — not use res directly
            var orders = res.data !== undefined ? res.data : res;

            allOrders      = orders || [];
            filteredOrders = allOrders;
            currentPage    = 1;

            updateStats(allOrders);
            renderTable();
        },
        error: function (xhr) {
            $('#historyTableBody').html(
                '<tr><td colspan="10" class="text-center text-danger py-4">' +
                '<i class="fas fa-exclamation-triangle me-2"></i>' +
                'Failed to load order history. Is the server running?' +
                '</td></tr>'
            );
            console.error("[loadHistory] Error:", xhr.status, xhr.responseText);
        }
    });
}

// LOADING STATE
function showTableLoading() {
    $('#historyTableBody').html(
        '<tr><td colspan="10" class="text-center text-muted py-4">' +
        '<div class="spinner-border spinner-border-sm text-secondary me-2" role="status"></div>' +
        'Loading...</td></tr>'
    );
}

//  UPDATE STATS CARDS
function updateStats(orders) {
    var totalOrders     = orders.length;
    var totalRevenue    = orders.reduce(function(sum, o) { return sum + (o.totalPrice || 0); }, 0);
    var uniqueCustomers = new Set(orders.map(function(o) { return o.customerId; })).size;
    var avgOrder        = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    $('#totalOrders').text(totalOrders);
    $('#totalRevenue').text('Rs. ' + totalRevenue.toLocaleString('en-US', {
        minimumFractionDigits: 2, maximumFractionDigits: 2
    }));
    $('#uniqueCustomers').text(uniqueCustomers);
    $('#avgOrderValue').text('Rs. ' + avgOrder.toLocaleString('en-US', {
        minimumFractionDigits: 2, maximumFractionDigits: 2
    }));
}

//  RENDER TABLE
function renderTable() {
    var tbody = $('#historyTableBody');
    tbody.empty();

    if (!filteredOrders || filteredOrders.length === 0) {
        tbody.html(
            '<tr><td colspan="10" class="text-center text-muted py-4">' +
            'No orders found.</td></tr>'
        );
        $('#recordCount').text('');
        $('#pagination').empty();
        return;
    }

    var totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
    var start      = (currentPage - 1) * ITEMS_PER_PAGE;
    var end        = Math.min(start + ITEMS_PER_PAGE, filteredOrders.length);
    var pageOrders = filteredOrders.slice(start, end);

    pageOrders.forEach(function(order, index) {
        var rowNum  = start + index + 1;

        //         Use String() conversion before any string operations
        var orderIdStr   = String(order.orderId   || '');
        var customerStr  = String(order.customerId || '');
        var itemIdStr    = String(order.itemId     || '');

        var dateStr = order.orderDate
            ? new Date(order.orderDate).toLocaleString('en-US', {
                year: 'numeric', month: 'short', day: '2-digit',
                hour: '2-digit', minute: '2-digit'
            })
            : '—';

        var priceStr = order.price      != null ? 'Rs. ' + order.price.toFixed(2)      : '—';
        var totalStr = order.totalPrice != null ? 'Rs. ' + order.totalPrice.toFixed(2) : '—';

        var row =
            '<tr class="history-row">' +
            '<td class="text-muted small">'          + rowNum                                    + '</td>' +
            '<td><span class="badge bg-secondary">'  + escHtml(orderIdStr)                       + '</span></td>' +
            '<td><span class="customer-badge">'      + escHtml(customerStr)                       + '</span></td>' +
            '<td class="text-muted small">'          + escHtml(itemIdStr)                         + '</td>' +
            '<td class="fw-semibold">'               + escHtml(order.itemName || '')               + '</td>' +
            '<td class="text-center">'               + (order.quantity != null ? order.quantity : '—') + '</td>' +
            '<td>'                                   + priceStr                                   + '</td>' +
            '<td class="total-cell">'                + totalStr                                   + '</td>' +
            '<td class="date-cell small text-muted">'+ escHtml(dateStr)                           + '</td>' +
            '<td><span class="badge bg-success">Completed</span></td>' +
            '</tr>';

        tbody.append(row);
    });

    $('#recordCount').text(
        'Showing ' + (start + 1) + ' – ' + end + ' of ' + filteredOrders.length + ' orders'
    );

    renderPagination(totalPages);
}

//  PAGINATION
function renderPagination(totalPages) {
    var pg = $('#pagination');
    pg.empty();
    if (totalPages <= 1) return;

    pg.append(
        '<button class="btn btn-sm btn-outline-secondary' + (currentPage === 1 ? ' disabled' : '') +
        '" onclick="changePage(' + (currentPage - 1) + ')">Prev</button>'
    );

    for (var i = 1; i <= totalPages; i++) {
        pg.append(
            '<button class="btn btn-sm ' + (i === currentPage ? 'btn-primary' : 'btn-outline-secondary') +
            '" onclick="changePage(' + i + ')">' + i + '</button>'
        );
    }

    pg.append(
        '<button class="btn btn-sm btn-outline-secondary' + (currentPage === totalPages ? ' disabled' : '') +
        '" onclick="changePage(' + (currentPage + 1) + ')">Next</button>'
    );
}

function changePage(page) {
    var totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderTable();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// SEARCH
function applySearch() {
    var term = $('#searchInput').val().toLowerCase().trim();

    if (!term) {
        filteredOrders = allOrders;
    } else {
        filteredOrders = allOrders.filter(function(o) {
            return String(o.orderId   || '').toLowerCase().includes(term) ||
                String(o.customerId|| '').toLowerCase().includes(term) ||
                String(o.itemId    || '').toLowerCase().includes(term) ||
                (o.itemName        || '').toLowerCase().includes(term);
        });
    }

    currentPage = 1;
    updateStats(filteredOrders);
    renderTable();
}

// FILTER BY CUSTOMER
function filterByCustomer() {
    var customerId = $('#customerFilter').val().trim();

    if (!customerId) {
        showToast('warning', 'Please enter a Customer ID to filter!');
        return;
    }

    $.ajax({
        url: HISTORY_BASE + "/order/customer/" + customerId,
        method: "GET",
        success: function(res) {

            var orders = res.data !== undefined ? res.data : res;
            filteredOrders = orders || [];
            currentPage    = 1;
            updateStats(filteredOrders);
            renderTable();

            if (filteredOrders.length === 0) {
                showToast('info', 'No orders found for customer: ' + customerId);
            } else {
                showToast('success', 'Found ' + filteredOrders.length + ' order(s) for customer ' + customerId);
            }
        },
        error: function(xhr) {
            console.error("[filterByCustomer] Error:", xhr.responseText);
            showToast('danger', 'Error filtering orders. Check console.');
        }
    });
}

//  SORT
function sortOrders() {
    var sortVal = $('#sortSelect').val();

    filteredOrders.sort(function(a, b) {
        if (sortVal === 'date-desc')  return new Date(b.orderDate)  - new Date(a.orderDate);
        if (sortVal === 'date-asc')   return new Date(a.orderDate)  - new Date(b.orderDate);
        if (sortVal === 'total-desc') return (b.totalPrice || 0)    - (a.totalPrice || 0);
        if (sortVal === 'total-asc')  return (a.totalPrice || 0)    - (b.totalPrice || 0);
        return 0;
    });

    currentPage = 1;
    renderTable();
}

//  CLEAR FILTERS
function clearFilters() {
    $('#searchInput').val('');
    $('#customerFilter').val('');
    $('#sortSelect').val('date-desc');
    filteredOrders = allOrders;
    currentPage    = 1;
    updateStats(allOrders);
    renderTable();
}

//  TOAST NOTIFICATION
function showToast(type, message) {
    // Remove any existing toast
    $('#liveToast').remove();

    var bg = type === 'success' ? 'bg-success'
        : type === 'warning' ? 'bg-warning text-dark'
            : type === 'info'    ? 'bg-info text-dark'
                : 'bg-danger';

    $('body').append(
        '<div id="liveToast" class="position-fixed top-0 end-0 m-3 p-3 rounded shadow ' + bg + ' text-white" ' +
        'style="z-index:9999;min-width:280px;font-weight:500;animation:slideIn .3s ease">' +
        message + '</div>'
    );

    setTimeout(function() {
        $('#liveToast').fadeOut(300, function() { $(this).remove(); });
    }, 3500);
}


function escHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

//  INIT
$(document).ready(function() {
    loadHistory();

    // Live search
    $('#searchInput').on('input', function() {
        applySearch();
    });

    // Inject toast slide-in animation
    $('<style>@keyframes slideIn{from{opacity:0;transform:translateX(60px)}to{opacity:1;transform:translateX(0)}}</style>')
        .appendTo('head');
});
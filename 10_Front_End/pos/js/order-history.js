const HISTORY_BASE = "http://localhost:8080/api/v1";
const ITEMS_PER_PAGE = 10;

let allOrders = [];          // Full data from backend
let filteredOrders = [];     // After search/filter
let currentPage = 1;


function loadHistory() {
    $('#historyTableBody').html(
        '<tr><td colspan="10" class="text-center text-muted py-4">' +
        '<div class="spinner-border spinner-border-sm text-secondary me-2"></div>' +
        'Loading...</td></tr>'
    );

    $.ajax({
        url: HISTORY_BASE + "/order/history",
        method: "GET",
        success: function (orders) {
            allOrders = orders;
            filteredOrders = orders;
            currentPage = 1;
            updateStats(orders);
            renderTable();
        },
        error: function (xhr) {
            $('#historyTableBody').html(
                '<tr><td colspan="10" class="text-center text-danger py-4">' +
                'Failed to load order history. Is the server running?' +
                '</td></tr>'
            );
            console.error("Error:", xhr.responseText);
        }
    });
}


function updateStats(orders) {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce(function(sum, o) { return sum + o.totalPrice; }, 0);
    const uniqueCustomers = new Set(orders.map(function(o) { return o.customerId; })).size;
    const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    $('#totalOrders').text(totalOrders);
    $('#totalRevenue').text('Rs. ' + totalRevenue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}));
    $('#uniqueCustomers').text(uniqueCustomers);
    $('#avgOrderValue').text('Rs. ' + avgOrder.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}));
}


function renderTable() {
    const tbody = $('#historyTableBody');
    tbody.empty();

    if (filteredOrders.length === 0) {
        tbody.append(
            '<tr><td colspan="10" class="text-center text-muted py-4">No orders found.</td></tr>'
        );
        $('#recordCount').text('');
        $('#pagination').empty();
        return;
    }

    // Pagination calculation
    const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
    const start      = (currentPage - 1) * ITEMS_PER_PAGE;
    const end        = Math.min(start + ITEMS_PER_PAGE, filteredOrders.length);
    const pageOrders = filteredOrders.slice(start, end);

    pageOrders.forEach(function (order, index) {
        const rowNum    = start + index + 1;
        const dateStr   = order.orderDate
            ? new Date(order.orderDate).toLocaleString('en-US', {
                year: 'numeric', month: 'short', day: '2-digit',
                hour: '2-digit', minute: '2-digit'
            })
            : '—';

        const row =
            '<tr class="history-row">' +
            '<td class="text-muted small">' + rowNum + '</td>' +
            '<td><span class="badge bg-secondary">' + order.orderId + '</span></td>' +
            '<td><span class="customer-badge">' + order.customerId + '</span></td>' +
            '<td class="text-muted small">' + order.itemId + '</td>' +
            '<td class="fw-semibold">' + order.itemName + '</td>' +
            '<td class="text-center">' + order.quantity + '</td>' +
            '<td>Rs. ' + order.price.toFixed(2) + '</td>' +
            '<td class="total-cell">Rs. ' + order.totalPrice.toFixed(2) + '</td>' +
            '<td class="date-cell small text-muted">' + dateStr + '</td>' +
            '<td><span class="badge bg-success">Completed</span></td>' +
            '</tr>';
        tbody.append(row);
    });

    // Record count
    $('#recordCount').text(
        'Showing ' + (start + 1) + ' - ' + end + ' of ' + filteredOrders.length + ' orders'
    );

    // Render pagination
    renderPagination(totalPages);
}


function renderPagination(totalPages) {
    const pg = $('#pagination');
    pg.empty();

    if (totalPages <= 1) return;

    // Previous
    var prevDisabled = currentPage === 1 ? ' disabled' : '';
    pg.append(
        '<button class="btn btn-sm btn-outline-secondary' + prevDisabled + '" onclick="changePage(' + (currentPage - 1) + ')">Prev</button>'
    );

    // Page numbers
    for (var i = 1; i <= totalPages; i++) {
        var active = i === currentPage ? ' btn-primary' : ' btn-outline-secondary';
        pg.append(
            '<button class="btn btn-sm' + active + '" onclick="changePage(' + i + ')">' + i + '</button>'
        );
    }

    // Next
    var nextDisabled = currentPage === totalPages ? ' disabled' : '';
    pg.append(
        '<button class="btn btn-sm btn-outline-secondary' + nextDisabled + '" onclick="changePage(' + (currentPage + 1) + ')">Next</button>'
    );
}

function changePage(page) {
    const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderTable();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


function applySearch() {
    const term = $('#searchInput').val().toLowerCase().trim();

    if (!term) {
        filteredOrders = allOrders;
    } else {
        filteredOrders = allOrders.filter(function (o) {
            return (o.orderId    || '').toLowerCase().includes(term) ||
                (o.customerId || '').toLowerCase().includes(term) ||
                (o.itemId     || '').toLowerCase().includes(term) ||
                (o.itemName   || '').toLowerCase().includes(term);
        });
    }

    currentPage = 1;
    updateStats(filteredOrders);
    renderTable();
}


function filterByCustomer() {
    const customerId = $('#customerFilter').val().trim();

    if (!customerId) {
        alert("Please enter a Customer ID to filter!");
        return;
    }

    $.ajax({
        url: HISTORY_BASE + "/order/customer/" + customerId,
        method: "GET",
        success: function (orders) {
            filteredOrders = orders;
            currentPage = 1;
            updateStats(orders);
            renderTable();
            if (orders.length === 0) {
                alert("No orders found for customer: " + customerId);
            }
        },
        error: function (xhr) {
            console.error("Filter error:", xhr.responseText);
            alert("Error filtering orders!");
        }
    });
}


function sortOrders() {
    const sortVal = $('#sortSelect').val();

    filteredOrders.sort(function (a, b) {
        if (sortVal === 'date-desc') return new Date(b.orderDate) - new Date(a.orderDate);
        if (sortVal === 'date-asc')  return new Date(a.orderDate) - new Date(b.orderDate);
        if (sortVal === 'total-desc') return b.totalPrice - a.totalPrice;
        if (sortVal === 'total-asc')  return a.totalPrice - b.totalPrice;
        return 0;
    });

    currentPage = 1;
    renderTable();
}


function clearFilters() {
    $('#searchInput').val('');
    $('#customerFilter').val('');
    $('#sortSelect').val('date-desc');
    filteredOrders = allOrders;
    currentPage = 1;
    updateStats(allOrders);
    renderTable();
}


$(document).ready(function () {
    loadHistory();

    // Live search
    $('#searchInput').on('input', function () {
        applySearch();
    });
});
// Function to save customer
function saveCustomer() {
    // Get values from form - fixed IDs to match HTML
    let cId = $('#customerId').val();
    let cName = $('#customerName').val();
    let cAddress = $('#customerAddress').val(); // Fixed typo: was "Adress"
    let cPhone = $('#customerPhone').val();

    // Validation
    if (!cId || !cName || !cAddress || !cPhone) {
        alert("Please fill in all fields!");
        return;
    }

    console.log(cId, cName, cAddress, cPhone);

    $.ajax({
        url: "http://localhost:8080/api/v1/customer",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            "cId": cId,
            "cName": cName,
            "cAddress": cAddress,
            "cPhone": cPhone
        }),
        success: function(response) {
            console.log("Customer saved successfully!");
            alert("Customer Saved!");
            // Clear form
            $('#customerForm')[0].reset();
            // Reload customer list
            loadCustomers();
        },
        error: function(xhr, status, error) {
            console.error(xhr.responseText);
            alert("Error saving customer: " + xhr.responseText);
        }
    });
}

// Function to update customer
function updateCustomer() {
    let cId = $('#customerId').val();
    let cName = $('#customerName').val();
    let cAddress = $('#customerAddress').val();
    let cPhone = $('#customerPhone').val();

    if (!cId || !cName || !cAddress || !cPhone) {
        alert("Please fill in all fields!");
        return;
    }

    $.ajax({
        url: "http://localhost:8080/api/v1/customer/" + cId,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify({
            "cId": cId,
            "cName": cName,
            "cAddress": cAddress,
            "cPhone": cPhone
        }),
        success: function(response) {
            alert("Customer Updated!");
            $('#customerForm')[0].reset();
            loadCustomers();
        },
        error: function(xhr, status, error) {
            console.error(xhr.responseText);
            alert("Error updating customer: " + xhr.responseText);
        }
    });
}

// Function to delete customer
function deleteCustomer() {
    let cId = $('#customerId').val();

    if (!cId) {
        alert("Please enter Customer ID to delete!");
        return;
    }

    if (confirm("Are you sure you want to delete customer " + cId + "?")) {
        $.ajax({
            url: "http://localhost:8080/api/v1/customer/" + cId,
            method: "DELETE",
            success: function(response) {
                alert("Customer Deleted!");
                $('#customerForm')[0].reset();
                loadCustomers();
            },
            error: function(xhr, status, error) {
                console.error(xhr.responseText);
                alert("Error deleting customer: " + xhr.responseText);
            }
        });
    }
}

// Function to load all customers
function loadCustomers() {
    $.ajax({
        url: "http://localhost:8080/api/v1/customer",
        method: "GET",
        success: function(customers) {
            let tbody = $('#customerTableBody');
            tbody.empty(); // Clear existing rows

            customers.forEach(function(customer) {
                let row = `<tr onclick="populateForm('${customer.cId}', '${customer.cName}', '${customer.cAddress}', '${customer.cPhone}')">
                    <td>${customer.cId}</td>
                    <td>${customer.cName}</td>
                    <td>${customer.cAddress}</td>
                    <td>${customer.cPhone}</td>
                </tr>`;
                tbody.append(row);
            });
        },
        error: function(xhr, status, error) {
            console.error("Error loading customers: " + xhr.responseText);
        }
    });
}

// Function to populate form when clicking on table row
function populateForm(id, name, address, phone) {
    $('#customerId').val(id);
    $('#customerName').val(name);
    $('#customerAddress').val(address);
    $('#customerPhone').val(phone);
}

// Load customers when page loads
$(document).ready(function() {
    loadCustomers();
});
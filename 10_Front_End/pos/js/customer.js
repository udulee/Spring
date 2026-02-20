const BASE_URL = "http://localhost:8080/api/v1/customer";

// ================= SAVE CUSTOMER =================
function saveCustomer() {

    let customerData = {
        cName: $('#customerName').val(),
        cAddress: $('#customerAddress').val(),
        cPhone: $('#customerPhone').val()
    };

    $.ajax({
        url: BASE_URL,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(customerData),

        success: function(res) {

            if(res && res.message){
                alert(res.message);
            }else{
                alert("Customer Saved Successfully!");
            }

            $('#customerForm')[0].reset();
            loadCustomers();
        },

        error: function(xhr) {

            if(xhr.status === 0){
                alert("Cannot connect to backend! Please start Spring Boot server.");
            }
            else if(xhr.responseJSON && xhr.responseJSON.message){
                alert("Error: " + xhr.responseJSON.message);
            }
            else{
                alert("Customer Save Failed!");
            }

        }
    });

}


// ================= LOAD CUSTOMERS =================
function loadCustomers() {

    $.ajax({
        url: BASE_URL,
        method: "GET",

        success: function(response) {

            let tbody = $('#customerTableBody');
            tbody.empty();

            if(response.data){

                response.data.forEach(function(customer){

                    let row = `<tr>
                        <td>${customer.cId}</td>
                        <td>${customer.cName}</td>
                        <td>${customer.cAddress}</td>
                        <td>${customer.cPhone}</td>
                    </tr>`;

                    let $row = $(row);

                    $row.click(function(){
                        populateForm(
                            customer.cId,
                            customer.cName,
                            customer.cAddress,
                            customer.cPhone
                        );
                    });

                    tbody.append($row);

                });

            }

        },

        error: function(xhr){

            if(xhr.status === 0){
                alert("Cannot connect to backend! Please start Spring Boot server.");
            }
            else{
                alert("Failed to load customers!");
            }

        }

    });

}


// ================= UPDATE CUSTOMER =================
function updateCustomer() {

    let id = $('#customerId').val();

    if(!id){
        alert("Please select a customer first!");
        return;
    }

    let customerData = {
        cId: parseInt(id),
        cName: $('#customerName').val(),
        cAddress: $('#customerAddress').val(),
        cPhone: $('#customerPhone').val()
    };

    $.ajax({

        url: BASE_URL + "/" + id,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(customerData),

        success: function(res){

            alert("Customer Updated Successfully!");

            loadCustomers();
            clearForm();

        },

        error: function(xhr){

            if(xhr.status === 0){
                alert("Cannot connect to backend!");
            }
            else if(xhr.responseJSON && xhr.responseJSON.message){
                alert(xhr.responseJSON.message);
            }
            else{
                alert("Update Failed!");
            }

        }

    });

}


// ================= DELETE CUSTOMER =================
function deleteCustomer() {

    let id = $('#customerId').val();

    if(!id){
        alert("Please select customer first!");
        return;
    }

    if(confirm("Are you sure you want to delete this customer?")){

        $.ajax({

            url: BASE_URL + "/" + id,
            method: "DELETE",

            success: function(){

                alert("Customer Deleted Successfully!");

                loadCustomers();
                clearForm();

            },

            error: function(xhr){

                if(xhr.status === 0){
                    alert("Cannot connect to backend!");
                }
                else{
                    alert("Delete Failed!");
                }

            }

        });

    }

}


// ================= POPULATE FORM =================
function populateForm(id, name, address, phone){

    $('#customerId').val(id);
    $('#customerName').val(name);
    $('#customerAddress').val(address);
    $('#customerPhone').val(phone);

}


// ================= CLEAR FORM =================
function clearForm(){

    $('#customerForm')[0].reset();
    $('#customerId').val('');

}


// ================= LOAD WHEN PAGE LOAD =================
$(document).ready(function(){

    loadCustomers();

});
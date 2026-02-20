package lk.ijse.backend.service.impl;

import lk.ijse.backend.dto.CustomerDTO;
import lk.ijse.backend.entity.Customer;
import lk.ijse.backend.exception.CustomException;
import lk.ijse.backend.repository.CustomerRepository;
import lk.ijse.backend.service.custom.CustomerService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public void saveCustomer(CustomerDTO customerDTO) {
        customerRepository.save(modelMapper.map(customerDTO,Customer.class));
//        throw new CustomException("Customer's data format issue");
//        customerRepository.save(
//                new Customer(
//                        customerDTO.getCId(),
//                        customerDTO.getCName(),
//                        customerDTO.getCAddress(),
//                        customerDTO.getCPhone()));
    }

    @Override
    public List<CustomerDTO> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(customer -> modelMapper.map(customer, CustomerDTO.class))
                .collect(Collectors.toList());
//                .map(customer -> new CustomerDTO(
//                        customer.getCId(),
//                        customer.getCName(),
//                        customer.getCAddress(),
//                        customer.getCPhone()))
//                .collect(Collectors.toList());
    }

    @Override
    public CustomerDTO getCustomerById(String id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
//        return new CustomerDTO(
//                customer.getCId(),
//                customer.getCName(),
//                customer.getCAddress(),
//                customer.getCPhone());
        return modelMapper.map(customer, CustomerDTO.class);
    }

    @Override
    public void updateCustomer(String id, CustomerDTO customerDTO) {
        if (!customerRepository.existsById(id)) {
            throw new RuntimeException("Customer not found with id: " + id);
        }
        modelMapper.map(customerDTO, Customer.class);
        customerRepository.save(modelMapper.map(customerDTO, Customer.class));
//        customerRepository.save(
//                new Customer(
//                        customerDTO.getCId(),
//                        customerDTO.getCName(),
//                        customerDTO.getCAddress(),
//                        customerDTO.getCPhone()));
    }

    @Override
    public void deleteCustomer(String id) {
        if (!customerRepository.existsById(id)) {
            throw new RuntimeException("Customer not found with id: " + id);
        }
        customerRepository.deleteById(id);

    }
}
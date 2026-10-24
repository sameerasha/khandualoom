package com.vastraloom.microservice.auth.repository;

import com.vastraloom.microservice.auth.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
}


package com.khandualoom.microservice.user.domain.repository;

import com.khandualoom.microservice.user.domain.model.Address;

import java.util.List;
import java.util.Optional;

public interface AddressRepository {
    Address save(Address address);
    Optional<Address> findById(Long id);
    List<Address> findByUserId(Long userId);
    void deleteById(Long id);
    void resetPrimaryForUser(Long userId);
}

package com.khandualoom.microservice.user.infrastructure.persistence.adapter;

import com.khandualoom.microservice.user.domain.model.Address;
import com.khandualoom.microservice.user.domain.repository.AddressRepository;
import com.khandualoom.microservice.user.infrastructure.persistence.entity.AddressJpaEntity;
import com.khandualoom.microservice.user.infrastructure.persistence.repository.SpringDataAddressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class AddressPersistenceAdapter implements AddressRepository {

    private final SpringDataAddressRepository repository;

    @Override
    public Address save(Address address) {
        AddressJpaEntity entity = toEntity(address);
        AddressJpaEntity saved = repository.save(entity);
        return toDomain(saved);
    }

    @Override
    public Optional<Address> findById(Long id) {
        return repository.findById(id).map(this::toDomain);
    }

    @Override
    public List<Address> findByUserId(Long userId) {
        return repository.findByUserId(userId).stream().map(this::toDomain).toList();
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    @Override
    @Transactional
    public void resetPrimaryForUser(Long userId) {
        repository.resetPrimaryForUser(userId);
    }

    private Address toDomain(AddressJpaEntity entity) {
        return Address.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .addressType(entity.getAddressType())
                .fullName(entity.getFullName())
                .streetAddress(entity.getStreetAddress())
                .landmark(entity.getLandmark())
                .city(entity.getCity())
                .state(entity.getState())
                .pincode(entity.getPincode())
                .country(entity.getCountry())
                .phone(entity.getPhone())
                .isPrimary(entity.getIsPrimary())
                .build();
    }

    private AddressJpaEntity toEntity(Address domain) {
        return AddressJpaEntity.builder()
                .id(domain.getId())
                .userId(domain.getUserId())
                .addressType(domain.getAddressType())
                .fullName(domain.getFullName())
                .streetAddress(domain.getStreetAddress())
                .landmark(domain.getLandmark())
                .city(domain.getCity())
                .state(domain.getState())
                .pincode(domain.getPincode())
                .country(domain.getCountry())
                .phone(domain.getPhone())
                .isPrimary(domain.getIsPrimary() != null ? domain.getIsPrimary() : false)
                .build();
    }
}

package com.khandualoom.microservice.user.application.service;

import com.khandualoom.microservice.common.exception.ResourceNotFoundException;
import com.khandualoom.microservice.user.application.dto.*;
import com.khandualoom.microservice.user.domain.model.Address;
import com.khandualoom.microservice.user.domain.model.UserProfile;
import com.khandualoom.microservice.user.domain.repository.AddressRepository;
import com.khandualoom.microservice.user.domain.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {

    private final UserProfileRepository userProfileRepository;
    private final AddressRepository addressRepository;

    @Transactional(readOnly = true)
    public UserProfileResponse getProfileByUserId(Long userId) {
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found for user ID: " + userId));
        List<Address> addresses = addressRepository.findByUserId(userId);
        profile.setAddresses(addresses);
        return toProfileResponse(profile);
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getProfileByEmail(String email) {
        UserProfile profile = userProfileRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found for email: " + email));
        List<Address> addresses = addressRepository.findByUserId(profile.getUserId());
        profile.setAddresses(addresses);
        return toProfileResponse(profile);
    }

    @Transactional
    public UserProfileResponse updateProfile(Long userId, ProfileUpdateRequest request) {
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found for user ID: " + userId));

        if (request.getFirstName() != null && !request.getFirstName().isBlank()) {
            profile.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null && !request.getLastName().isBlank()) {
            profile.setLastName(request.getLastName());
        }
        if (request.getPhone() != null && !request.getPhone().isBlank()) {
            profile.setPhone(request.getPhone());
        }

        UserProfile saved = userProfileRepository.save(profile);
        List<Address> addresses = addressRepository.findByUserId(userId);
        saved.setAddresses(addresses);
        return toProfileResponse(saved);
    }

    @Transactional
    public UserProfile createOrUpdateProfile(Long userId, String email, String firstName, String lastName, String phone, String role) {
        return userProfileRepository.findByUserId(userId)
                .map(existing -> {
                    existing.setFirstName(firstName);
                    existing.setLastName(lastName);
                    if (phone != null) existing.setPhone(phone);
                    if (role != null) existing.setRole(role);
                    return userProfileRepository.save(existing);
                })
                .orElseGet(() -> {
                    UserProfile newProfile = UserProfile.builder()
                            .userId(userId)
                            .email(email)
                            .firstName(firstName)
                            .lastName(lastName)
                            .phone(phone)
                            .role(role != null ? role : "ROLE_CUSTOMER")
                            .build();
                    return userProfileRepository.save(newProfile);
                });
    }

    @Transactional(readOnly = true)
    public List<AddressDto> getUserAddresses(Long userId) {
        return addressRepository.findByUserId(userId).stream()
                .map(this::toAddressDto)
                .toList();
    }

    @Transactional
    public AddressDto addAddress(Long userId, AddressRequest request) {
        if (Boolean.TRUE.equals(request.getIsPrimary())) {
            addressRepository.resetPrimaryForUser(userId);
        }

        Address address = Address.builder()
                .userId(userId)
                .addressType(request.getAddressType() != null ? request.getAddressType() : "HOME")
                .fullName(request.getFullName())
                .streetAddress(request.getStreetAddress())
                .landmark(request.getLandmark())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .country(request.getCountry() != null ? request.getCountry() : "India")
                .phone(request.getPhone())
                .isPrimary(Boolean.TRUE.equals(request.getIsPrimary()))
                .build();

        Address saved = addressRepository.save(address);
        return toAddressDto(saved);
    }

    @Transactional
    public AddressDto updateAddress(Long userId, Long addressId, AddressRequest request) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with ID: " + addressId));

        if (!address.getUserId().equals(userId)) {
            throw new ResourceNotFoundException("Address not found for user ID: " + userId);
        }

        if (Boolean.TRUE.equals(request.getIsPrimary())) {
            addressRepository.resetPrimaryForUser(userId);
            address.setIsPrimary(true);
        }

        address.setFullName(request.getFullName());
        address.setStreetAddress(request.getStreetAddress());
        address.setLandmark(request.getLandmark());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPincode(request.getPincode());
        if (request.getAddressType() != null) address.setAddressType(request.getAddressType());
        if (request.getCountry() != null) address.setCountry(request.getCountry());
        if (request.getPhone() != null) address.setPhone(request.getPhone());

        return toAddressDto(addressRepository.save(address));
    }

    @Transactional
    public void deleteAddress(Long userId, Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with ID: " + addressId));
        if (!address.getUserId().equals(userId)) {
            throw new ResourceNotFoundException("Address not found for user ID: " + userId);
        }
        addressRepository.deleteById(addressId);
    }

    @Transactional
    public AddressDto setPrimaryAddress(Long userId, Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with ID: " + addressId));
        if (!address.getUserId().equals(userId)) {
            throw new ResourceNotFoundException("Address not found for user ID: " + userId);
        }
        addressRepository.resetPrimaryForUser(userId);
        address.setIsPrimary(true);
        return toAddressDto(addressRepository.save(address));
    }

    @Transactional(readOnly = true)
    public List<UserProfileResponse> getAllProfiles() {
        return userProfileRepository.findAll().stream()
                .map(this::toProfileResponse)
                .toList();
    }

    private UserProfileResponse toProfileResponse(UserProfile profile) {
        List<AddressDto> addressDtos = profile.getAddresses() != null
                ? profile.getAddresses().stream().map(this::toAddressDto).toList()
                : List.of();

        return UserProfileResponse.builder()
                .id(profile.getId())
                .userId(profile.getUserId())
                .email(profile.getEmail())
                .firstName(profile.getFirstName())
                .lastName(profile.getLastName())
                .phone(profile.getPhone())
                .role(profile.getRole())
                .addresses(addressDtos)
                .build();
    }

    private AddressDto toAddressDto(Address address) {
        return AddressDto.builder()
                .id(address.getId())
                .userId(address.getUserId())
                .addressType(address.getAddressType())
                .fullName(address.getFullName())
                .streetAddress(address.getStreetAddress())
                .landmark(address.getLandmark())
                .city(address.getCity())
                .state(address.getState())
                .pincode(address.getPincode())
                .country(address.getCountry())
                .phone(address.getPhone())
                .isPrimary(address.getIsPrimary())
                .build();
    }
}

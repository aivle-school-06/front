package com.sentinel.repository;

import com.sentinel.domain.Company;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    List<Company> findByNameContainingIgnoreCaseOrCompanyCodeContainingIgnoreCase(String name, String companyCode);
    boolean existsByCompanyCode(String companyCode);
}

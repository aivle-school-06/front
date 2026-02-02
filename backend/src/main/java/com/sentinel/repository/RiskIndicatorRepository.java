package com.sentinel.repository;

import com.sentinel.domain.Company;
import com.sentinel.domain.RiskIndicator;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RiskIndicatorRepository extends JpaRepository<RiskIndicator, Long> {
    List<RiskIndicator> findTop4ByCompanyOrderByQuarterDesc(Company company);
    Optional<RiskIndicator> findTopByCompanyOrderByQuarterDesc(Company company);
    List<RiskIndicator> findTop12ByOrderByQuarterDesc();
}

package com.sentinel.dto.response;

import com.sentinel.domain.Company;
import com.sentinel.domain.CompanyStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CompanyResponse {
    private Long id;
    private String companyCode;
    private String name;
    private String industry;
    private CompanyStatus status;
    private LocalDateTime createdAt;

    public static CompanyResponse from(Company company) {
        return CompanyResponse.builder()
            .id(company.getId())
            .companyCode(company.getCompanyCode())
            .name(company.getName())
            .industry(company.getIndustry())
            .status(company.getStatus())
            .createdAt(company.getCreatedAt())
            .build();
    }
}

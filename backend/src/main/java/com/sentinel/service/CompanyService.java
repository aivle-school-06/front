package com.sentinel.service;

import com.sentinel.common.CustomException;
import com.sentinel.common.ErrorCode;
import com.sentinel.domain.Company;
import com.sentinel.domain.CompanyStatus;
import com.sentinel.domain.RiskIndicator;
import com.sentinel.dto.request.CreateCompanyRequest;
import com.sentinel.dto.response.CompanyOverviewResponse;
import com.sentinel.dto.response.CompanyResponse;
import com.sentinel.dto.response.RiskIndicatorResponse;
import com.sentinel.repository.CompanyRepository;
import com.sentinel.repository.RiskIndicatorRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final RiskIndicatorRepository riskIndicatorRepository;

    public CompanyService(CompanyRepository companyRepository,
                          RiskIndicatorRepository riskIndicatorRepository) {
        this.companyRepository = companyRepository;
        this.riskIndicatorRepository = riskIndicatorRepository;
    }

    public List<CompanyResponse> getCompanies(String keyword) {
        List<Company> companies;
        if (keyword == null || keyword.isBlank()) {
            companies = companyRepository.findAll();
        } else {
            companies = companyRepository
                .findByNameContainingIgnoreCaseOrCompanyCodeContainingIgnoreCase(keyword, keyword);
        }
        return companies.stream().map(CompanyResponse::from).toList();
    }

    public CompanyResponse createCompany(CreateCompanyRequest request) {
        if (companyRepository.existsByCompanyCode(request.getCompanyCode())) {
            throw new CustomException(ErrorCode.INVALID_REQUEST, "Company code already exists");
        }
        Company company = Company.builder()
            .companyCode(request.getCompanyCode())
            .name(request.getName())
            .industry(request.getIndustry())
            .status(CompanyStatus.ACTIVE)
            .build();
        return CompanyResponse.from(companyRepository.save(company));
    }

    public CompanyResponse getCompany(Long id) {
        return CompanyResponse.from(findCompany(id));
    }

    public CompanyOverviewResponse getCompanyOverview(Long id) {
        Company company = findCompany(id);
        Optional<RiskIndicator> latest = riskIndicatorRepository.findTopByCompanyOrderByQuarterDesc(company);

        Integer overallScore = latest.map(RiskIndicator::getOverallScore).orElse(null);
        String riskSummary = latest.map(this::evaluateRiskSummary).orElse("NO_DATA");
        List<RiskIndicatorResponse> indicators = riskIndicatorRepository
            .findTop4ByCompanyOrderByQuarterDesc(company)
            .stream()
            .sorted(Comparator.comparing(RiskIndicator::getQuarter))
            .map(RiskIndicatorResponse::from)
            .toList();

        return CompanyOverviewResponse.builder()
            .companyInfo(CompanyResponse.from(company))
            .overallScore(overallScore)
            .riskSummary(riskSummary)
            .keyIndicators(indicators)
            .aiComment("AI 분석 코멘트는 현재 준비 중입니다. 곧 고도화된 분석으로 업데이트됩니다.")
            .build();
    }

    private Company findCompany(Long id) {
        return companyRepository.findById(id)
            .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND, "Company not found"));
    }

    private String evaluateRiskSummary(RiskIndicator indicator) {
        if (indicator.getLiquidityRatio() != null && indicator.getLiquidityRatio() < 100) {
            return "WARNING";
        }
        if (indicator.getDebtRatio() != null && indicator.getDebtRatio() > 200) {
            return "WARNING";
        }
        if (indicator.getOverallScore() != null && indicator.getOverallScore() < 60) {
            return "WARNING";
        }
        return "STABLE";
    }
}

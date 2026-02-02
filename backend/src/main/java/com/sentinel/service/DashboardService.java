package com.sentinel.service;

import com.sentinel.domain.Company;
import com.sentinel.domain.CompanyStatus;
import com.sentinel.domain.RiskIndicator;
import com.sentinel.dto.response.DashboardOverviewResponse;
import com.sentinel.repository.CompanyRepository;
import com.sentinel.repository.RiskIndicatorRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final CompanyRepository companyRepository;
    private final RiskIndicatorRepository riskIndicatorRepository;

    public DashboardService(CompanyRepository companyRepository,
                            RiskIndicatorRepository riskIndicatorRepository) {
        this.companyRepository = companyRepository;
        this.riskIndicatorRepository = riskIndicatorRepository;
    }

    public DashboardOverviewResponse getOverview() {
        List<Company> companies = companyRepository.findAll();
        long activePartners = companies.stream()
            .filter(company -> company.getStatus() == CompanyStatus.ACTIVE)
            .count();

        double avgScore = companies.stream()
            .map(company -> riskIndicatorRepository.findTopByCompanyOrderByQuarterDesc(company))
            .flatMap(Optional::stream)
            .map(RiskIndicator::getOverallScore)
            .filter(score -> score != null)
            .mapToInt(Integer::intValue)
            .average()
            .orElse(0);
        int riskScore = (int) Math.round(100 - avgScore);

        List<RiskIndicator> allIndicators = riskIndicatorRepository.findAll();
        Map<String, Double> avgByQuarter = allIndicators.stream()
            .filter(indicator -> indicator.getOverallScore() != null)
            .collect(Collectors.groupingBy(
                RiskIndicator::getQuarter,
                Collectors.averagingInt(RiskIndicator::getOverallScore)
            ));

        List<Integer> trend = avgByQuarter.entrySet().stream()
            .sorted(Map.Entry.comparingByKey(Comparator.reverseOrder()))
            .limit(4)
            .sorted(Map.Entry.comparingByKey())
            .map(entry -> (int) Math.round(entry.getValue()))
            .toList();

        return DashboardOverviewResponse.builder()
            .activePartners(activePartners)
            .riskScore(riskScore)
            .riskStayDays(14)
            .networkStatus("STABLE")
            .trend(trend)
            .build();
    }
}

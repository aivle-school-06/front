package com.sentinel.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class CompanyOverviewResponse {
    private CompanyResponse companyInfo;
    private Integer overallScore;
    private String riskSummary;
    private List<RiskIndicatorResponse> keyIndicators;
    private String aiComment;
}

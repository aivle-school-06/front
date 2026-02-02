package com.sentinel.dto.response;

import com.sentinel.domain.RiskIndicator;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RiskIndicatorResponse {
    private String quarter;
    private Double liquidityRatio;
    private Double quickRatio;
    private Double cfoChangeRate;
    private Double debtRatio;
    private Integer overallScore;

    public static RiskIndicatorResponse from(RiskIndicator indicator) {
        return RiskIndicatorResponse.builder()
            .quarter(indicator.getQuarter())
            .liquidityRatio(indicator.getLiquidityRatio())
            .quickRatio(indicator.getQuickRatio())
            .cfoChangeRate(indicator.getCfoChangeRate())
            .debtRatio(indicator.getDebtRatio())
            .overallScore(indicator.getOverallScore())
            .build();
    }
}

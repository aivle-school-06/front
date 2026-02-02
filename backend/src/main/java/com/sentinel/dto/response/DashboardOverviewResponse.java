package com.sentinel.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class DashboardOverviewResponse {
    private long activePartners;
    private int riskScore;
    private int riskStayDays;
    private String networkStatus;
    private List<Integer> trend;
}

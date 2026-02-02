package com.sentinel.controller;

import com.sentinel.common.ApiResponse;
import com.sentinel.dto.request.CreateCompanyRequest;
import com.sentinel.dto.response.CompanyOverviewResponse;
import com.sentinel.dto.response.CompanyResponse;
import com.sentinel.service.CompanyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
@Tag(name = "Companies", description = "Company API")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @Operation(summary = "기업 목록/검색")
    @GetMapping
    public ApiResponse<List<CompanyResponse>> getCompanies(@RequestParam(required = false) String keyword) {
        return ApiResponse.success(companyService.getCompanies(keyword));
    }

    @Operation(summary = "기업 추가")
    @PostMapping
    public ApiResponse<CompanyResponse> createCompany(@Valid @RequestBody CreateCompanyRequest request) {
        return ApiResponse.success(companyService.createCompany(request));
    }

    @Operation(summary = "기업 기본 정보")
    @GetMapping("/{id}")
    public ApiResponse<CompanyResponse> getCompany(@PathVariable Long id) {
        return ApiResponse.success(companyService.getCompany(id));
    }

    @Operation(summary = "기업 상세 Overview")
    @GetMapping("/{id}/overview")
    public ApiResponse<CompanyOverviewResponse> getCompanyOverview(@PathVariable Long id) {
        return ApiResponse.success(companyService.getCompanyOverview(id));
    }
}

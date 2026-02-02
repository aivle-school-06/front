package com.sentinel.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateCompanyRequest {
    @NotBlank
    private String companyCode;

    @NotBlank
    private String name;

    @NotBlank
    private String industry;
}

package com.sentinel.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class QnaPostRequest {
    @NotBlank
    private String title;

    @NotBlank
    private String content;
}

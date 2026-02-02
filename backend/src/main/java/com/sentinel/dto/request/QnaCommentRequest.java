package com.sentinel.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class QnaCommentRequest {
    @NotBlank
    private String content;
}

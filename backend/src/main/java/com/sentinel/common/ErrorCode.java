package com.sentinel.common;

import lombok.Getter;

@Getter
public enum ErrorCode {
    INVALID_REQUEST("Invalid request"),
    NOT_FOUND("Resource not found"),
    UNAUTHORIZED("Unauthorized"),
    FORBIDDEN("Forbidden"),
    INTERNAL_ERROR("Internal server error");

    private final String message;

    ErrorCode(String message) {
        this.message = message;
    }
}

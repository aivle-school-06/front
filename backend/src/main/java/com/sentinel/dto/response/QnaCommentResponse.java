package com.sentinel.dto.response;

import com.sentinel.domain.QnaComment;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class QnaCommentResponse {
    private Long id;
    private String content;
    private String authorName;
    private LocalDateTime createdAt;

    public static QnaCommentResponse from(QnaComment comment) {
        return QnaCommentResponse.builder()
            .id(comment.getId())
            .content(comment.getContent())
            .authorName(comment.getAuthor().getName())
            .createdAt(comment.getCreatedAt())
            .build();
    }
}

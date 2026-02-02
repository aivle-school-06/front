package com.sentinel.dto.response;

import com.sentinel.domain.QnaPost;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class QnaPostResponse {
    private Long id;
    private String title;
    private String content;
    private String authorName;
    private LocalDateTime createdAt;

    public static QnaPostResponse from(QnaPost post) {
        return QnaPostResponse.builder()
            .id(post.getId())
            .title(post.getTitle())
            .content(post.getContent())
            .authorName(post.getAuthor().getName())
            .createdAt(post.getCreatedAt())
            .build();
    }
}

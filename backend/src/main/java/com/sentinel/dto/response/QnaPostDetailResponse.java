package com.sentinel.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class QnaPostDetailResponse {
    private QnaPostResponse post;
    private List<QnaCommentResponse> comments;
}

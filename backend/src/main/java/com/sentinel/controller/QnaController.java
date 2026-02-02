package com.sentinel.controller;

import com.sentinel.common.ApiResponse;
import com.sentinel.dto.request.QnaCommentRequest;
import com.sentinel.dto.request.QnaPostRequest;
import com.sentinel.dto.response.QnaCommentResponse;
import com.sentinel.dto.response.QnaPostDetailResponse;
import com.sentinel.dto.response.QnaPostResponse;
import com.sentinel.security.UserPrincipal;
import com.sentinel.service.QnaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/qna")
@Tag(name = "QnA", description = "QnA API")
public class QnaController {

    private final QnaService qnaService;

    public QnaController(QnaService qnaService) {
        this.qnaService = qnaService;
    }

    @Operation(summary = "QnA 게시글 목록")
    @GetMapping
    public ApiResponse<List<QnaPostResponse>> getPosts() {
        return ApiResponse.success(qnaService.getPosts());
    }

    @Operation(summary = "QnA 게시글 생성")
    @PostMapping
    public ApiResponse<QnaPostResponse> createPost(@Valid @RequestBody QnaPostRequest request,
                                                   @AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.success(qnaService.createPost(request, principal));
    }

    @Operation(summary = "QnA 게시글 상세")
    @GetMapping("/{id}")
    public ApiResponse<QnaPostDetailResponse> getPost(@PathVariable Long id) {
        return ApiResponse.success(qnaService.getPost(id));
    }

    @Operation(summary = "QnA 댓글 생성")
    @PostMapping("/{id}/comments")
    public ApiResponse<QnaCommentResponse> createComment(@PathVariable Long id,
                                                         @Valid @RequestBody QnaCommentRequest request,
                                                         @AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.success(qnaService.createComment(id, request, principal));
    }
}

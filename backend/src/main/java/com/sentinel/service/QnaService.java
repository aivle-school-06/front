package com.sentinel.service;

import com.sentinel.common.CustomException;
import com.sentinel.common.ErrorCode;
import com.sentinel.domain.QnaComment;
import com.sentinel.domain.QnaPost;
import com.sentinel.domain.User;
import com.sentinel.dto.request.QnaCommentRequest;
import com.sentinel.dto.request.QnaPostRequest;
import com.sentinel.dto.response.QnaCommentResponse;
import com.sentinel.dto.response.QnaPostDetailResponse;
import com.sentinel.dto.response.QnaPostResponse;
import com.sentinel.repository.QnaCommentRepository;
import com.sentinel.repository.QnaPostRepository;
import com.sentinel.security.UserPrincipal;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QnaService {

    private final QnaPostRepository qnaPostRepository;
    private final QnaCommentRepository qnaCommentRepository;

    public QnaService(QnaPostRepository qnaPostRepository,
                      QnaCommentRepository qnaCommentRepository) {
        this.qnaPostRepository = qnaPostRepository;
        this.qnaCommentRepository = qnaCommentRepository;
    }

    public List<QnaPostResponse> getPosts() {
        return qnaPostRepository.findAll().stream()
            .map(QnaPostResponse::from)
            .toList();
    }

    public QnaPostResponse createPost(QnaPostRequest request, UserPrincipal principal) {
        User user = principal.getUser();
        QnaPost post = QnaPost.builder()
            .title(request.getTitle())
            .content(request.getContent())
            .author(user)
            .build();
        return QnaPostResponse.from(qnaPostRepository.save(post));
    }

    public QnaPostDetailResponse getPost(Long id) {
        QnaPost post = qnaPostRepository.findById(id)
            .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND, "Post not found"));
        List<QnaCommentResponse> comments = qnaCommentRepository.findByPostOrderByCreatedAtAsc(post)
            .stream()
            .map(QnaCommentResponse::from)
            .toList();
        return QnaPostDetailResponse.builder()
            .post(QnaPostResponse.from(post))
            .comments(comments)
            .build();
    }

    public QnaCommentResponse createComment(Long postId, QnaCommentRequest request, UserPrincipal principal) {
        QnaPost post = qnaPostRepository.findById(postId)
            .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND, "Post not found"));
        QnaComment comment = QnaComment.builder()
            .post(post)
            .content(request.getContent())
            .author(principal.getUser())
            .build();
        return QnaCommentResponse.from(qnaCommentRepository.save(comment));
    }
}

package com.sentinel.repository;

import com.sentinel.domain.QnaComment;
import com.sentinel.domain.QnaPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QnaCommentRepository extends JpaRepository<QnaComment, Long> {
    List<QnaComment> findByPostOrderByCreatedAtAsc(QnaPost post);
}

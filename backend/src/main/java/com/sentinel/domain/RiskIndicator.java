package com.sentinel.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "risk_indicators")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RiskIndicator {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private Company company;

    @Column(nullable = false)
    private String quarter;

    private Double liquidityRatio;

    private Double quickRatio;

    private Double cfoChangeRate;

    private Double debtRatio;

    private Integer overallScore;

    @CreationTimestamp
    private LocalDateTime createdAt;
}

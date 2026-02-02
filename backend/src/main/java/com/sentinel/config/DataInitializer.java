package com.sentinel.config;

import com.sentinel.domain.*;
import com.sentinel.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner seedData(UserRepository userRepository,
                                      CompanyRepository companyRepository,
                                      RiskIndicatorRepository riskIndicatorRepository,
                                      QnaPostRepository qnaPostRepository,
                                      QnaCommentRepository qnaCommentRepository,
                                      PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                User admin = User.builder()
                    .email("admin@test.com")
                    .password(passwordEncoder.encode("password"))
                    .name("Admin")
                    .role(UserRole.ADMIN)
                    .build();
                userRepository.save(admin);

                List<Company> companies = List.of(
                    Company.builder().companyCode("CMP-001").name("Sentinel Tech").industry("IT").status(CompanyStatus.ACTIVE).build(),
                    Company.builder().companyCode("CMP-002").name("Nova Logistics").industry("Logistics").status(CompanyStatus.RISK).build(),
                    Company.builder().companyCode("CMP-003").name("Blue Finance").industry("Finance").status(CompanyStatus.ACTIVE).build(),
                    Company.builder().companyCode("CMP-004").name("Green Energy").industry("Energy").status(CompanyStatus.INACTIVE).build(),
                    Company.builder().companyCode("CMP-005").name("Atlas Retail").industry("Retail").status(CompanyStatus.ACTIVE).build()
                );

                companyRepository.saveAll(companies);

                companies.forEach(company -> {
                    riskIndicatorRepository.save(RiskIndicator.builder()
                        .company(company)
                        .quarter("2024-Q4")
                        .liquidityRatio(120.0)
                        .quickRatio(85.0)
                        .cfoChangeRate(5.2)
                        .debtRatio(150.0)
                        .overallScore(72)
                        .build());
                    riskIndicatorRepository.save(RiskIndicator.builder()
                        .company(company)
                        .quarter("2025-Q1")
                        .liquidityRatio(110.0)
                        .quickRatio(90.0)
                        .cfoChangeRate(3.1)
                        .debtRatio(160.0)
                        .overallScore(68)
                        .build());
                    riskIndicatorRepository.save(RiskIndicator.builder()
                        .company(company)
                        .quarter("2025-Q2")
                        .liquidityRatio(95.0)
                        .quickRatio(80.0)
                        .cfoChangeRate(-2.4)
                        .debtRatio(210.0)
                        .overallScore(58)
                        .build());
                });

                QnaPost post = qnaPostRepository.save(QnaPost.builder()
                    .title("첫 번째 QnA 게시글")
                    .content("샘플 QnA 게시글입니다.")
                    .author(admin)
                    .build());

                qnaCommentRepository.save(QnaComment.builder()
                    .post(post)
                    .content("샘플 댓글입니다.")
                    .author(admin)
                    .build());
            }
        };
    }
}

# Company 3 Factors API Summary

This document summarizes the API endpoints and required response fields for:
- 협력사 디렉토리 (Company Directory)
- 퀵뷰 (Quick View)
- 기업 상세 (Company Detail)

---

## 1) 협력사 디렉토리 (Company Directory)

**Endpoint**
- `GET /api/companies`

**Response Fields (CompanySummary[])**
```ts
type CompanySummary = {
  id: string;
  name: string;
  sector: {
    key: string;
    label: string;
  };
  overallScore: number;
  riskLevel: 'SAFE' | 'WARN' | 'RISK';
  lastUpdatedAt?: string;
  kpi?: {
    networkHealth?: number;
    reputationScore?: number;
  };
}
```

---

## 2) 퀵뷰 (Quick View)

**Endpoints**
- `GET /api/companies/{companyId}/overview`
- `GET /api/companies/{companyId}/insights`

**Response Fields (overview)**
```ts
type CompanyOverview = {
  company: {
    id: string;
    name: string;
    sector: { key: string; label: string };
    overallScore: number;
    riskLevel: 'SAFE' | 'WARN' | 'RISK';
    kpi?: { networkHealth?: number; reputationScore?: number };
  };
}
```

**Response Fields (insights)**
```ts
type CompanyInsightItem = {
  id: string | number;
  type: 'REPORT' | 'NEWS';
  title: string;
  publishedAt?: string;
}
```

Quick View uses only `type === 'NEWS'` and displays the **title + publishedAt**.

---

## 3) 기업 상세 (Company Detail)

**Endpoints**
- `GET /api/companies/{companyId}/overview`
- `GET /api/companies/{companyId}/insights`

**Response Fields (overview)**
```ts
type CompanyOverview = {
  company: {
    id: string;
    name: string;
    sector: { key: string; label: string };
    overallScore: number;
    riskLevel: 'SAFE' | 'WARN' | 'RISK';
    kpi?: { networkHealth?: number; reputationScore?: number };
  };
  forecast?: {
    latestActualQuarter: string;
    nextQuarter: string;
    metricSeries: Array<{
      key: string;
      label: string;
      unit?: string | null;
      points: Array<{ quarter: string; value: number; type: 'ACTUAL' | 'PRED' }>;
    }>;
  };
  keyMetrics?: Array<{
    key: string;
    label: string;
    value: number | null;
    unit?: string | null;
    tooltip?: { description: string; interpretation?: string; actionHint?: string };
  }>;
  signals?: Array<{
    key: string;
    label: string;
    level: 'GREEN' | 'YELLOW' | 'RED' | 'UNKNOWN';
    value?: number | null;
    unit?: string | null;
    tooltip?: { description: string; interpretation?: string; actionHint?: string };
  }>;
  aiComment?: string;
  externalReputationRisk?: {
    score?: number;
    label?: 'SAFE' | 'WARN' | 'RISK';
    topKeywords?: string[];
  };
  modelStatus: 'EXISTING' | 'PROCESSING' | 'COMPLETED';
}
```

**Response Fields (insights)**
```ts
type CompanyInsightItem = {
  id: string | number;
  type: 'REPORT' | 'NEWS';
  title: string;
  body?: string;
  content?: string;
  source?: string;
  publishedAt?: string;
  url?: string;
}
```

Company Detail uses:
- `type === 'REPORT'` → 사업보고서 설명 카드
- `type === 'NEWS'` → 뉴스 버튼/모달 (최대 10개)

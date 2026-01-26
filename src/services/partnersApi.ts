import { INITIAL_PARTNERS, getMockPartnerDetail, getMockUploadResult } from '../mocks/partners.mock';
import { Partner, PartnerDetail, UploadResult } from '../types/partner';

const simulateDelay = async (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchPartners = async (): Promise<Partner[]> => {
  // TODO: 실제 API 연동 시 이 부분을 fetch/axios 호출로 교체하세요.
  await simulateDelay();
  return INITIAL_PARTNERS;
};

export const fetchPartnerDetail = async (id: string): Promise<PartnerDetail> => {
  // TODO: 실제 API 연동 시 이 부분을 fetch/axios 호출로 교체하세요.
  await simulateDelay();
  return getMockPartnerDetail(id);
};

export const uploadPartnerFile = async (formData: FormData): Promise<UploadResult> => {
  // TODO: 실제 API 연동 시 이 부분을 fetch/axios 파일 업로드로 교체하세요.
  await simulateDelay(900);
  const name = String(formData.get('companyName') ?? '신규 파트너');
  const industry = String(formData.get('industry') ?? '기타');
  return getMockUploadResult({ name, industry });
};

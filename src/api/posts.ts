import { apiDelete, apiGet, apiPatch, apiPost, apiPostForm } from './client';
import {
  PostCreateRequest,
  PostFileItem,
  PostItem,
  PostListData,
  PostListParams,
  PostUpdateRequest,
} from '../types/post';

export const listPosts = async (params?: PostListParams): Promise<PostListData> => {
  return apiGet<PostListData>('/api/posts', params);
};

export const getPost = async (postId: number | string): Promise<PostItem> => {
  return apiGet<PostItem>(`/api/posts/${postId}`);
};

export const createPost = async (payload: PostCreateRequest): Promise<PostItem> => {
  return apiPost<PostItem, PostCreateRequest>('/api/posts', payload);
};

export const updatePost = async (
  postId: number | string,
  payload: PostUpdateRequest,
): Promise<PostItem> => {
  return apiPatch<PostItem, PostUpdateRequest>(`/api/posts/${postId}`, payload);
};

export const deletePost = async (postId: number | string): Promise<string> => {
  return apiDelete<string>(`/api/posts/${postId}`);
};

export const listPostFiles = async (postId: number | string): Promise<PostFileItem[]> => {
  return apiGet<PostFileItem[]>(`/api/posts/${postId}/files`);
};

export const uploadPostFiles = async (
  postId: number | string,
  files: File[],
): Promise<PostFileItem[] | string> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });
  return apiPostForm<PostFileItem[] | string>(`/api/posts/${postId}/files`, formData);
};

export const getFileDownloadUrl = async (fileId: number | string): Promise<{ url: string }> => {
  return apiGet<{ url: string }>(`/api/files/${fileId}/url`);
};

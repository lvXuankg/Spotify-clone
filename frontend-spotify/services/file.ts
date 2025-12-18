import api from "@/lib/axios";

import {
  FolderType,
  GeneratePresignedUrlDto,
  ResourceType,
  ResponsePresignedUrl,
  UploadFileMetadataDto,
  UploadResponseDto,
} from "@/interfaces/file";
import axios from "axios";

const FILE_URL = "/file";

const getPresignedUrl = (data: GeneratePresignedUrlDto) => {
  return api.post<ResponsePresignedUrl>(`${FILE_URL}/presignedUrl`, data);
};

const uploadFileToCloudinary = (file: File, dto: ResponsePresignedUrl) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("api_key", dto.apiKey);
  formData.append("timestamp", dto.timestamp.toString());
  formData.append("signature", dto.signature);
  formData.append("folder", dto.folder);
  formData.append("public_id", dto.publicId);

  // Add eager transformations if present (for images)
  if ((dto as any).eager) {
    formData.append("eager", (dto as any).eager);
    formData.append("eager_async", "true");
  }

  return axios.post(dto.uploadUrl, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const saveMetadata = (dto: UploadFileMetadataDto) => {
  return api.post<UploadResponseDto>(`${FILE_URL}/saveMetadata`, dto);
};

const deleteFile = (publicId: string) => {
  return api.delete(`${FILE_URL}`, {
    data: { publicId },
  });
};

export const FileService = {
  getPresignedUrl,
  uploadFileToCloudinary,
  saveMetadata,
  deleteFile,
};

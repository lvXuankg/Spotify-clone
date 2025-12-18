import { useState } from "react";
import { useToast } from "@/hooks/useToast";
import {
  FolderType,
  ResourceType,
  UploadFileMetadataDto,
} from "@/interfaces/file";
import { FileService } from "@/services/file";

interface UploadOptions {
  folder: FolderType;
  resourceType?: ResourceType;
}

export function useUploadFile() {
  const { success, error: showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (
    file: File,
    options: UploadOptions
  ): Promise<UploadFileMetadataDto | null> => {
    try {
      setLoading(true);
      setError(null);

      // 1. Xin địa chỉ upload
      const presignedRes = await FileService.getPresignedUrl({
        folder: options.folder,
        resourceType: options.resourceType,
      });

      if (!presignedRes.data) {
        throw new Error("Không thể lấy presigned URL");
      }

      const presigned = presignedRes.data;

      // 2. Upload trực tiếp lên Cloudinary
      const cloudinaryRes = await FileService.uploadFileToCloudinary(
        file,
        presigned
      );

      if (!cloudinaryRes.data) {
        throw new Error("Upload lên Cloudinary thất bại");
      }

      console.log(cloudinaryRes);

      const cloudinaryData = cloudinaryRes.data;

      // 3. Lưu metadata vào backend
      const metadata: UploadFileMetadataDto = {
        publicId: cloudinaryData.public_id,
        url: cloudinaryData.url,
        secureUrl: cloudinaryData.secure_url,
        format: cloudinaryData.format,
        resourceType: cloudinaryData.resource_type,
        bytes: cloudinaryData.bytes,
        width: cloudinaryData.width,
        height: cloudinaryData.height,
        duration: cloudinaryData.duration,
        createdAt: cloudinaryData.created_at,
      };

      const saveRes = await FileService.saveMetadata(metadata);

      if (!saveRes.data?.success || !saveRes.data?.data) {
        throw new Error(
          saveRes.data?.error || "Lỗi khi lưu metadata vào database"
        );
      }

      // 4. Hiển thị success toast
      success(`${file.name} đã upload thành công`);

      return saveRes.data.data;
    } catch (err: any) {
      const errorMessage =
        err?.message || "Có lỗi xảy ra trong quá trình upload";
      setError(errorMessage);

      // Hiển thị error toast
      showError("Upload thất bại", errorMessage);

      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    upload,
    loading,
    error,
  };
}

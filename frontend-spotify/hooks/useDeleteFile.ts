import { useState } from "react";
import { FileService } from "@/services/file";
import { toast } from "sonner";

export function useDeleteFile() {
  const [loading, setLoading] = useState(false);

  const deleteFile = async (publicId: string) => {
    try {
      setLoading(true);
      await FileService.deleteFile(publicId);
      toast.success("Xóa file thành công!");
      return true;
    } catch (error) {
      console.error("Delete file error:", error);
      toast.error("Lỗi khi xóa file");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteFile,
    loading,
  };
}

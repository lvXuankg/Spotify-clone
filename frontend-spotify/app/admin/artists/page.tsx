"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Form } from "antd";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  fetchArtists,
  createArtist,
  updateArtist,
  deleteArtist,
  clearError,
} from "@/store/slices/artist";
import type {
  CreateArtistDto,
  UpdateArtistDto,
  Artist,
} from "@/interfaces/artist";
import { ArtistsHeader, ArtistsTable, CreateEditModal } from "./components";

type ModalType = "create" | "edit" | null;

export default function ArtistsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { listArtists, loading, error, currentPage, pageLimit, total } =
    useAppSelector((state) => state.artist);

  const [form] = Form.useForm();
  const [modalType, setModalType] = useState<ModalType>(null);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20 });

  // ==================== EFFECTS ====================

  // Lấy danh sách nghệ sĩ
  useEffect(() => {
    dispatch(fetchArtists({ page: pagination.page, limit: pagination.limit }));
  }, [dispatch, pagination]);

  // Xóa error message
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // ==================== HANDLERS ====================

  const handleOpenCreateModal = () => {
    console.log("✨ handleOpenCreateModal called");
    setModalType("create");
    form.resetFields();
  };

  const handleOpenEditModal = (artist: Artist) => {
    console.log("📝 handleOpenEditModal called with artist:", artist);
    setModalType("edit");
    setEditingArtist(artist);
  };

  const handleOpenViewModal = (artist: Artist) => {
    // Navigate tới trang chi tiết nghệ sĩ
    router.push(`/admin/artists/${artist.id}`);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setEditingArtist(null);
    form.resetFields();
  };

  const handleFormSubmit = async (values: any) => {
    try {
      if (modalType === "create") {
        await dispatch(createArtist(values as CreateArtistDto)).unwrap();
        toast.success("Tạo nghệ sĩ thành công!");
      } else if (modalType === "edit" && editingArtist) {
        await dispatch(
          updateArtist({
            artistId: editingArtist.id,
            dto: values as UpdateArtistDto,
          })
        ).unwrap();
        toast.success("Cập nhật thành công!");
      }
      handleCloseModal();
    } catch (err: any) {
      toast.error(err?.message || "Có lỗi xảy ra");
    }
  };

  const handleDeleteArtist = async (artistId: string) => {
    try {
      await dispatch(deleteArtist(artistId)).unwrap();
      toast.success("Xóa thành công!");
    } catch (err: any) {
      toast.error(err?.message || "Lỗi xóa nghệ sĩ");
    }
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination({ page, limit: pageSize });
  };

  // ==================== RENDER ====================

  return (
    <div style={{ padding: "0 12px" }}>
      {/* Header */}
      <ArtistsHeader total={total} onCreateClick={handleOpenCreateModal} />

      {/* Table Card */}
      <Card
        style={{
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
          borderRadius: "8px",
        }}
      >
        <ArtistsTable
          loading={loading}
          data={listArtists}
          currentPage={currentPage}
          pageLimit={pageLimit}
          total={total}
          onPageChange={handlePageChange}
          onEdit={handleOpenEditModal}
          onView={handleOpenViewModal}
          onDelete={handleDeleteArtist}
        />
      </Card>

      {/* Modals */}
      <CreateEditModal
        isOpen={modalType === "create" || modalType === "edit"}
        isLoading={loading}
        isEdit={modalType === "edit"}
        editingArtist={editingArtist}
        form={form}
        onSubmit={handleFormSubmit}
        onCancel={handleCloseModal}
      />
    </div>
  );
}

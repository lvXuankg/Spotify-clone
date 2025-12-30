"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, Button, Space, Spin, Empty, Image } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { AlbumServices } from "@/services/album";
import { AlbumWithArtist } from "@/interfaces/albums";
import { toast } from "sonner";
import { SongsSection } from "../../../components/SongsSection";

export default function AlbumDetailPage() {
  const router = useRouter();
  const params = useParams();
  const artistId = params.id as string;
  const albumId = params.albumId as string;
  const [album, setAlbum] = useState<AlbumWithArtist | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (albumId) {
      fetchAlbum();
    }
  }, [albumId]);

  const fetchAlbum = async () => {
    try {
      setLoading(true);
      const response = await AlbumServices.getAlbum(albumId);
      console.log(response.data);
      if (response.data) {
        setAlbum(response.data);
      }
    } catch (error) {
      console.error("Error fetching album:", error);
      toast.error("Lỗi khi tải thông tin album");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "24px 0" }}>
      {/* Header với nút quay lại */}
      <div style={{ marginBottom: "24px" }}>
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={() => router.back()}
        >
          Quay lại
        </Button>
      </div>

      {loading ? (
        <Spin size="large" fullscreen tip="Đang tải thông tin album..." />
      ) : !album ? (
        <Card>
          <Empty description="Không tìm thấy album" />
        </Card>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "300px 1fr",
            gap: "32px",
          }}
        >
          {/* Album Info - Left */}
          <Card
            style={{
              borderRadius: "12px",
              textAlign: "center",
              height: "fit-content",
            }}
          >
            {/* Cover Image */}
            <Image
              src={
                album.cover_url ||
                album.coverUrl ||
                "https://via.placeholder.com/300x300?text=Album"
              }
              alt={album.title}
              style={{
                width: "100%",
                height: "300px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "16px",
              }}
              preview={{
                mask: "Xem",
              }}
            />

            {/* Album Title */}
            <h2 style={{ margin: "12px 0", fontSize: "20px", fontWeight: 700 }}>
              {album.title}
            </h2>

            {/* Artist */}
            <p style={{ color: "#999", marginBottom: "8px", fontSize: "14px" }}>
              {album.artists?.display_name || "Unknown Artist"}
            </p>

            {/* Release Date */}
            {(album.release_date || album.releaseDate) && (
              <p
                style={{
                  color: "#999",
                  marginBottom: "16px",
                  fontSize: "12px",
                }}
              >
                {new Date(
                  album.release_date || album.releaseDate!
                ).toLocaleDateString("vi-VN")}
              </p>
            )}

            {/* Type */}
            <p
              style={{
                color: "#667eea",
                marginBottom: "16px",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              {album.type || "ALBUM"}
            </p>

            {/* Action Button */}
            <Button type="primary" block>
              Chỉnh sửa
            </Button>
          </Card>

          {/* Songs List - Right */}
          <div>
            <SongsSection albumId={albumId} />
          </div>
        </div>
      )}
    </div>
  );
}

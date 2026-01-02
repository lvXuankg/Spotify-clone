"use client";

import { memo, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Row,
  Col,
  Button,
  Table,
  Empty,
  Skeleton,
  Image,
  Dropdown,
  Modal,
} from "antd";
import type { MenuProps, TableColumnsType } from "antd";
import {
  PlayCircleFilled,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  MoreOutlined,
  ClockCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  playlistActions,
  selectCurrentPlaylist,
  selectCurrentPlaylistLoading,
  selectPlaylistOperationLoading,
} from "@/store/slices/playlist";
import { yourLibraryActions } from "@/store/slices/yourLibrary";
import { useUploadFile } from "@/hooks/useUploadFile";
import { useToast } from "@/hooks/useToast";
import { useAudioPlayerContext } from "@/components/providers/AudioPlayerProvider";
import PageHeader from "@/components/layout/PageHeader";
import { AddSongModal } from "./components/AddSongModal";
import { EditPlaylistModal } from "./components/EditPlaylistModal";
import type { PlaylistSong, UpdatePlaylist } from "@/interfaces/playlists";
import type { SongWithAlbum } from "@/interfaces/song";
import { FolderType, ResourceType } from "@/interfaces/file";
import styles from "./page.module.css";

// Default playlist cover
const DEFAULT_COVER = "https://misc.scdn.co/liked-songs/liked-songs-640.png";

// Format duration from seconds to mm:ss
const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const PlaylistDetailPage = memo(() => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const playlistId = params.id as string;

  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [addSongModalVisible, setAddSongModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  // Selectors
  const playlist = useAppSelector(selectCurrentPlaylist);
  const loading = useAppSelector(selectCurrentPlaylistLoading);
  const operationLoading = useAppSelector(selectPlaylistOperationLoading);
  const currentUserId = useAppSelector((state) => state.auth.user?.id);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // Hooks
  const { upload, loading: uploadLoading } = useUploadFile();
  const { success, error: showError } = useToast();
  const { playSong, playSongs } = useAudioPlayerContext();

  // Check if current user owns this playlist
  // Debug: log để xem giá trị
  // console.log("Debug playlist owner:", {
  //   currentUserId,
  //   playlistUserId: playlist?.user_id,
  //   isAuthenticated,
  // });
  const isOwner = isAuthenticated && playlist?.user_id === currentUserId;

  // Convert PlaylistSong to SongWithAlbum format
  const convertToSongWithAlbum = (song: PlaylistSong): SongWithAlbum => ({
    id: song.id,
    album_id: "",
    title: song.title,
    duration_seconds: song.duration,
    audio_url: song.audio_url,
    disc_number: 1,
    is_explicit: false,
    play_count: 0,
    created_at: "",
    updated_at: "",
    albums: {
      id: "",
      title: playlist?.title || "Playlist",
      cover_url: playlist?.cover_url || undefined,
      artists: {
        id: song.artist?.id || "",
        display_name: song.artist?.display_name || "Unknown Artist",
      },
    },
  });

  // Handle play all songs
  const handlePlayAll = () => {
    if (playlist?.songs && playlist.songs.length > 0) {
      const songs = playlist.songs.map(convertToSongWithAlbum);
      playSongs(songs, 0);
    }
  };

  // Handle play single song
  const handlePlaySong = (record: PlaylistSong, index: number) => {
    if (playlist?.songs && playlist.songs.length > 0) {
      const songs = playlist.songs.map(convertToSongWithAlbum);
      playSongs(songs, index);
    }
  };

  // Fetch playlist detail
  useEffect(() => {
    if (playlistId) {
      dispatch(playlistActions.fetchPlaylistDetail(playlistId));
    }
    return () => {
      dispatch(playlistActions.clearCurrentPlaylist());
    };
  }, [playlistId, dispatch]);

  // Handle cover image upload
  const handleCoverImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !playlist) return;

    try {
      const result = await upload(file, {
        folder: FolderType.PLAYLISTS,
        resourceType: ResourceType.IMAGE,
      });

      if (result?.secureUrl) {
        await dispatch(
          playlistActions.updatePlaylistImage({
            playlistId: playlist.id,
            coverUrl: result.secureUrl,
          })
        ).unwrap();

        // Update library
        dispatch(
          yourLibraryActions.updatePlaylistInLibrary({
            id: playlist.id,
            cover_url: result.secureUrl,
          })
        );

        success("Cover image updated successfully");
      }
    } catch (err) {
      showError("Failed to update cover image");
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle delete playlist
  const handleDeletePlaylist = async () => {
    if (!playlist) return;

    try {
      await dispatch(playlistActions.deletePlaylist(playlist.id)).unwrap();
      dispatch(yourLibraryActions.removePlaylistFromLibrary(playlist.id));
      success("Playlist deleted successfully");
      router.push("/");
    } catch (err) {
      showError("Failed to delete playlist");
    }
    setDeleteModalVisible(false);
  };

  // Handle edit playlist
  const handleEditPlaylist = async (values: UpdatePlaylist) => {
    if (!playlist) return;

    try {
      await dispatch(
        playlistActions.updatePlaylist({
          playlistId: playlist.id,
          dto: values,
        })
      ).unwrap();

      // Update library
      dispatch(
        yourLibraryActions.updatePlaylistInLibrary({
          id: playlist.id,
          title: values.title,
        })
      );

      success("Playlist updated successfully");
      setEditModalVisible(false);
    } catch (err) {
      showError("Failed to update playlist");
    }
  };

  // Handle remove song from playlist
  const handleRemoveSong = async (songId: string) => {
    if (!playlist) return;

    try {
      await dispatch(
        playlistActions.removeSongFromPlaylist({
          playlistId: playlist.id,
          songId,
        })
      ).unwrap();
      success("Song removed from playlist");
    } catch (err) {
      showError("Failed to remove song from playlist");
    }
  };

  // Table columns
  const columns: TableColumnsType<PlaylistSong> = [
    {
      title: "#",
      dataIndex: "position",
      key: "position",
      width: 50,
      render: (_, __, index) => (
        <span className={styles.trackNumber}>{index + 1}</span>
      ),
    },
    {
      title: "Title",
      key: "title",
      render: (_, record) => (
        <div className={styles.trackInfo}>
          <span className={styles.trackTitle}>{record.title}</span>
          <span className={styles.trackArtist}>
            {record.artist?.display_name || "Unknown Artist"}
          </span>
        </div>
      ),
    },
    {
      title: <ClockCircleOutlined />,
      dataIndex: "duration",
      key: "duration",
      width: 80,
      align: "right",
      render: (duration: number) => (
        <span className={styles.duration}>{formatDuration(duration)}</span>
      ),
    },
    ...(isOwner
      ? [
          {
            title: "",
            key: "actions",
            width: 50,
            render: (_: any, record: PlaylistSong) => (
              <Button
                type="text"
                icon={<DeleteOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveSong(record.id);
                }}
                className={styles.removeButton}
                loading={operationLoading.removeSong}
              />
            ),
          },
        ]
      : []),
  ];

  // Dropdown menu items
  const moreMenuItems: MenuProps["items"] = isOwner
    ? [
        {
          key: "edit",
          icon: <EditOutlined />,
          label: "Edit details",
          onClick: () => setEditModalVisible(true),
        },
        {
          key: "add-songs",
          icon: <PlusOutlined />,
          label: "Add songs",
          onClick: () => setAddSongModalVisible(true),
        },
        { type: "divider" },
        {
          key: "delete",
          icon: <DeleteOutlined />,
          label: "Delete playlist",
          danger: true,
          onClick: () => setDeleteModalVisible(true),
        },
      ]
    : [];

  // Loading state
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Skeleton active avatar paragraph={{ rows: 4 }} />
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  // Not found state
  if (!playlist) {
    return (
      <div className={styles.emptyContainer}>
        <Empty description="Playlist not found" />
        <Button type="primary" onClick={() => router.push("/")}>
          Go Home
        </Button>
      </div>
    );
  }

  const dominantColor = "#1a1a2e";
  const coverUrl = playlist.cover_url || DEFAULT_COVER;
  const totalDuration = playlist.songs?.reduce(
    (acc: number, song: PlaylistSong) => acc + song.duration,
    0
  );

  return (
    <div ref={containerRef} className={styles.container}>
      <PageHeader
        color={dominantColor}
        container={containerRef}
        sectionContainer={sectionRef}
      >
        <Row gutter={[24, 24]} align="bottom">
          <Col xs={24} sm={6}>
            <div className={styles.coverWrapper}>
              <Image
                src={coverUrl}
                alt={playlist.title}
                preview={false}
                className={styles.coverImage}
                fallback={DEFAULT_COVER}
              />
              {isOwner && (
                <>
                  <div
                    className={styles.coverOverlay}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <EditOutlined className={styles.editIcon} />
                    <span>Choose photo</span>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleCoverImageChange}
                  />
                </>
              )}
            </div>
          </Col>
          <Col xs={24} sm={18}>
            <div className={styles.playlistInfo}>
              <span className={styles.playlistType}>Playlist</span>
              <h1 className={styles.title}>{playlist.title}</h1>
              {playlist.description && (
                <p className={styles.description}>{playlist.description}</p>
              )}
              <div className={styles.meta}>
                <span>{playlist.songs?.length || 0} songs</span>
                {totalDuration && totalDuration > 0 && (
                  <span>
                    , about {Math.floor(totalDuration / 60)} min{" "}
                    {Math.floor(totalDuration % 60)} sec
                  </span>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </PageHeader>

      <div ref={sectionRef} className={styles.content}>
        <div className={styles.actions}>
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<PlayCircleFilled />}
            className={styles.playButton}
            onClick={handlePlayAll}
          />

          {isOwner && (
            <>
              <Button
                type="text"
                icon={<PlusOutlined />}
                onClick={() => setAddSongModalVisible(true)}
                className={styles.actionButton}
              >
                Add songs
              </Button>

              <Dropdown
                menu={{ items: moreMenuItems }}
                trigger={["click"]}
                placement="bottomLeft"
              >
                <Button
                  type="text"
                  icon={<MoreOutlined />}
                  className={styles.actionButton}
                />
              </Dropdown>
            </>
          )}
        </div>

        {playlist.songs && playlist.songs.length > 0 ? (
          <Table
            columns={columns}
            dataSource={playlist.songs}
            rowKey="id"
            pagination={false}
            className={styles.table}
            onRow={(record, index) => ({
              onClick: () => handlePlaySong(record, index || 0),
              style: { cursor: "pointer" },
            })}
          />
        ) : (
          <div className={styles.emptyTracks}>
            <Empty description="No songs in this playlist" />
            {isOwner && (
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={() => setAddSongModalVisible(true)}
              >
                Find songs to add
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Add Song Modal */}
      <AddSongModal
        open={addSongModalVisible}
        onClose={() => setAddSongModalVisible(false)}
        playlistId={playlist.id}
      />

      {/* Edit Playlist Modal */}
      <EditPlaylistModal
        open={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        playlist={playlist}
        onSubmit={handleEditPlaylist}
        loading={operationLoading.update}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Playlist"
        open={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onOk={handleDeletePlaylist}
        okText="Delete"
        okButtonProps={{
          danger: true,
          loading: operationLoading.delete,
        }}
      >
        <p>
          Are you sure you want to delete <strong>{playlist.title}</strong>?
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
});

PlaylistDetailPage.displayName = "PlaylistDetailPage";
export default PlaylistDetailPage;

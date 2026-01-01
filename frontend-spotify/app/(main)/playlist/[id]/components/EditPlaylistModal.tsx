"use client";

import { memo, useEffect } from "react";
import { Modal, Form, Input, Switch } from "antd";
import type { PlaylistDetail, UpdatePlaylist } from "@/interfaces/playlists";
import styles from "./EditPlaylistModal.module.css";

interface EditPlaylistModalProps {
  open: boolean;
  onClose: () => void;
  playlist: PlaylistDetail;
  onSubmit: (values: UpdatePlaylist) => void;
  loading: boolean;
}

export const EditPlaylistModal = memo(
  ({ open, onClose, playlist, onSubmit, loading }: EditPlaylistModalProps) => {
    const [form] = Form.useForm();

    // Reset form when playlist changes
    useEffect(() => {
      if (open && playlist) {
        form.setFieldsValue({
          title: playlist.title,
          description: playlist.description || "",
          isPublic: playlist.is_public,
        });
      }
    }, [open, playlist, form]);

    const handleSubmit = async () => {
      try {
        const values = await form.validateFields();
        onSubmit(values);
      } catch (error) {
        console.error("Validation failed:", error);
      }
    };

    return (
      <Modal
        title="Edit details"
        open={open}
        onCancel={onClose}
        onOk={handleSubmit}
        okText="Save"
        okButtonProps={{ loading }}
        className={styles.modal}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          className={styles.form}
          initialValues={{
            title: playlist?.title,
            description: playlist?.description || "",
            isPublic: playlist?.is_public,
          }}
        >
          <Form.Item
            name="title"
            label="Name"
            rules={[
              { required: true, message: "Please enter playlist name" },
              { max: 100, message: "Name must be less than 100 characters" },
            ]}
          >
            <Input
              placeholder="Add a name"
              className={styles.input}
              maxLength={100}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[
              {
                max: 300,
                message: "Description must be less than 300 characters",
              },
            ]}
          >
            <Input.TextArea
              placeholder="Add an optional description"
              className={styles.textarea}
              rows={4}
              maxLength={300}
              showCount
            />
          </Form.Item>

          <Form.Item
            name="isPublic"
            label="Public playlist"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <p className={styles.disclaimer}>
            By proceeding, you agree to give Spotify access to the image you
            choose to upload. Please make sure you have the right to upload the
            image.
          </p>
        </Form>
      </Modal>
    );
  }
);

EditPlaylistModal.displayName = "EditPlaylistModal";

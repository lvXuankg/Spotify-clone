"use client";

import { memo, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { updateProfile } from "@/store/slices/profile";
import { Button, Form, Input, Row, Col, Card, Select, App } from "antd";
import { useRouter } from "next/navigation";
import { getCountriesList } from "@/constants/countries";

const EditProfilePage = memo(() => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { message } = App.useApp();
  const user = useAppSelector((state) => state.profile?.profile);
  const profileLoading = useAppSelector((state) => state.profile.loading);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  if (!user) {
    return <div>Loading...</div>;
  }

  const countriesList = getCountriesList();
  const countryOptions = countriesList.map((country) => ({
    label: country.name,
    value: country.code,
  }));

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // Update profile qua Redux thunk
      await dispatch(
        updateProfile({
          ...values,
          // Country value đã là code từ Select
        })
      ).unwrap();

      message.success("Profile updated successfully!");
      router.push("/user/profile");
    } catch (error: any) {
      message.error(error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "600px", margin: "0 auto" }}>
      <h1
        style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "30px" }}
      >
        Edit Profile
      </h1>

      <Card style={{ backgroundColor: "#282828", border: "none" }}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            name: user.name,
            username: user.username,
            email: user.email,
            bio: user.bio,
            country: user.country,
            facebookUrl: user.facebook_url,
            zaloPhone: user.zalo_phone,
          }}
          onFinish={handleSubmit}
        >
          <Form.Item
            label={<span style={{ color: "#fff" }}>Tên Hiển Thị</span>}
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên hiển thị" },
              {
                min: 2,
                message: "Tên hiển thị phải có ít nhất 2 ký tự",
              },
            ]}
          >
            <Input
              style={{
                backgroundColor: "#404040",
                border: "1px solid #535353",
                color: "#ffffff",
              }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: "#fff" }}>Username</span>}
            name="username"
            rules={[
              { required: true, message: "Please enter username" },
              {
                min: 3,
                message: "Username must be at least 3 characters",
              },
            ]}
          >
            <Input
              style={{
                backgroundColor: "#404040",
                border: "1px solid #535353",
                color: "#ffffff",
              }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: "#fff" }}>Email</span>}
            name="email"
            rules={[{ type: "email", message: "Invalid email" }]}
          >
            <Input
              disabled
              style={{
                backgroundColor: "#404040",
                border: "1px solid #535353",
                color: "#b3b3b3",
              }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: "#fff" }}>Bio</span>}
            name="bio"
          >
            <Input.TextArea
              rows={4}
              style={{
                backgroundColor: "#404040",
                border: "1px solid #535353",
                color: "#ffffff",
              }}
              maxLength={500}
              placeholder="Tell us about yourself..."
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: "#fff" }}>Country</span>}
            name="country"
          >
            <Select
              placeholder="Select your country"
              options={countryOptions}
              style={{ backgroundColor: "#404040" }}
              optionLabelProp="label"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: "#fff" }}>Facebook URL</span>}
            name="facebookUrl"
          >
            <Input
              style={{
                backgroundColor: "#404040",
                border: "1px solid #535353",
                color: "#ffffff",
              }}
              placeholder="https://facebook.com/..."
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: "#fff" }}>Zalo Phone</span>}
            name="zaloPhone"
          >
            <Input
              style={{
                backgroundColor: "#404040",
                border: "1px solid #535353",
                color: "#ffffff",
              }}
              placeholder="Your Zalo phone number"
            />
          </Form.Item>

          <Form.Item>
            <Row gutter={[16, 16]}>
              <Col>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                >
                  Save Changes
                </Button>
              </Col>
              <Col>
                <Button onClick={() => router.back()} size="large">
                  Cancel
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
});

EditProfilePage.displayName = "EditProfilePage";
export default EditProfilePage;

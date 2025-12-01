"use client";

import { memo, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { browseActions } from "@/store/slices/browse";
import { Col, Row, Card, Image } from "antd";
import { useRouter } from "next/navigation";

const BrowsePage = memo(() => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const categories = useAppSelector((state) => state.browse.categories);

  useEffect(() => {
    dispatch(browseActions.fetchCategories());
  }, [dispatch]);

  if (!categories || categories.length === 0) {
    return (
      <div style={{ padding: "30px", textAlign: "center" }}>
        <p style={{ color: "#b3b3b3" }}>Loading categories...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          marginBottom: "30px",
          color: "#ffffff",
        }}
      >
        Browse All
      </h1>

      <Row gutter={[16, 16]}>
        {categories.map((category: any) => (
          <Col key={category.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              onClick={() => router.push(`/genre/${category.id}`)}
              cover={
                <Image
                  src={category.icons[0]?.url}
                  alt={category.name}
                  style={{
                    height: "200px",
                    objectFit: "cover",
                  }}
                  preview={false}
                />
              }
              style={{
                backgroundColor: "#282828",
                borderColor: "#404040",
              }}
            >
              <Card.Meta
                title={
                  <span style={{ color: "#ffffff" }}>{category.name}</span>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
});

BrowsePage.displayName = "BrowsePage";
export default BrowsePage;

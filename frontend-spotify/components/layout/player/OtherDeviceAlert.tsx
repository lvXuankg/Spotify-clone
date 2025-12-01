"use client";

import { Alert } from "antd";
import { useAppSelector } from "@/store/store";
import { isActiveOnOtherDevice } from "@/store/slices/spotify";
import { memo } from "react";

export const OtherDeviceAlert = memo(() => {
  const activeOnOtherDevice = useAppSelector(isActiveOnOtherDevice);

  if (!activeOnOtherDevice) {
    return null;
  }

  return (
    <Alert
      message="Playing on another device"
      description="To resume playback here, switch to this device"
      type="info"
      showIcon
      style={{
        width: "100%",
        borderRadius: 0,
        marginBottom: 0,
      }}
    />
  );
});

OtherDeviceAlert.displayName = "OtherDeviceAlert";

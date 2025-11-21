"use client";

import React, { useState, useEffect } from "react";
import { clickPayConfig } from "../lib/clickpay/config";

const ClickPayIntegrationStatus: React.FC = () => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [configStatus, setConfigStatus] = useState<{
    profileId: boolean;
    serverKey: boolean;
    clientKey: boolean;
    baseUrl: boolean;
  }>({
    profileId: false,
    serverKey: false,
    clientKey: false,
    baseUrl: false,
  });

  useEffect(() => {
    // Check if ClickPay is properly configured
    const checkConfiguration = () => {
      const status = {
        profileId:
          !!clickPayConfig.profileId && clickPayConfig.profileId !== "",
        serverKey:
          !!clickPayConfig.serverKey && clickPayConfig.serverKey !== "",
        clientKey:
          !!clickPayConfig.clientKey && clickPayConfig.clientKey !== "",
        baseUrl: !!clickPayConfig.baseUrl && clickPayConfig.baseUrl !== "",
      };

      setConfigStatus(status);
      setIsConfigured(Object.values(status).every(Boolean));
    };

    checkConfiguration();
  }, []);

  if (process.env.NODE_ENV === "production") {
    return null; // Don't show in production
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-900">ClickPay Status</h3>
        <div
          className={`w-3 h-3 rounded-full ${
            isConfigured ? "bg-green-500" : "bg-red-500"
          }`}
        ></div>
      </div>

      <div className="space-y-1 text-xs">
        <div className="flex items-center">
          <div
            className={`w-2 h-2 rounded-full mr-2 ${
              configStatus.profileId ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <span
            className={
              configStatus.profileId ? "text-green-700" : "text-red-700"
            }
          >
            Profile ID: {configStatus.profileId ? "Configured" : "Missing"}
          </span>
        </div>

        <div className="flex items-center">
          <div
            className={`w-2 h-2 rounded-full mr-2 ${
              configStatus.serverKey ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <span
            className={
              configStatus.serverKey ? "text-green-700" : "text-red-700"
            }
          >
            Server Key: {configStatus.serverKey ? "Configured" : "Missing"}
          </span>
        </div>

        <div className="flex items-center">
          <div
            className={`w-2 h-2 rounded-full mr-2 ${
              configStatus.clientKey ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <span
            className={
              configStatus.clientKey ? "text-green-700" : "text-red-700"
            }
          >
            Client Key: {configStatus.clientKey ? "Configured" : "Missing"}
          </span>
        </div>

        <div className="flex items-center">
          <div
            className={`w-2 h-2 rounded-full mr-2 ${
              configStatus.baseUrl ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <span
            className={configStatus.baseUrl ? "text-green-700" : "text-red-700"}
          >
            Base URL: {configStatus.baseUrl ? "Configured" : "Missing"}
          </span>
        </div>
      </div>

      {!isConfigured && (
        <div className="mt-2 text-xs text-red-600">
          <p>Please configure ClickPay environment variables.</p>
          <p>See CLICKPAY_SETUP.md for details.</p>
        </div>
      )}
    </div>
  );
};

export default ClickPayIntegrationStatus;

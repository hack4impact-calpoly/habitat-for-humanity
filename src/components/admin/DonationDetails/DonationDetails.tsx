"use client";

import React, { useEffect, useState } from "react";
import { Item, getItemsByStatus } from "api/item";
import { getClerkUser } from "api/user";
import moment from "moment";

export default function DonationDetails(): React.ReactNode {
  const [items, setItems] = useState<Item[]>([]);
  const [donorInfoMap, setDonorInfoMap] = useState<
    Record<string, { firstName: string; lastName: string }>
  >({});

  useEffect(() => {
    const fetchCompletedDonations = async () => {
      const res = await getItemsByStatus("Completed");
      setItems(res || []);
    };

    fetchCompletedDonations();
  }, []);

  useEffect(() => {
    const fetchDonorNames = async () => {
      const uniqueDonorIds = Array.from(new Set(items.map((item) => item.donorId)));
      const map: Record<string, { firstName: string; lastName: string }> = {};

      await Promise.all(
        uniqueDonorIds.map(async (id) => {
          try {
            const donor = await getClerkUser(id);
            map[id] = donor;
          } catch (error) {
            console.error("Failed to fetch donor for id:", id, error);
          }
        }),
      );

      setDonorInfoMap(map);
    };

    if (items.length > 0) {
      fetchDonorNames();
    }
  }, [items]);

  const getDonorName = (id: string) => {
    const donor = donorInfoMap[id];
    return donor ? `${donor.firstName} ${donor.lastName}` : "Loading...";
  };

  return (
  <div style={{ padding: "32px" }}>
    <h1 style={{ fontSize: "32px", fontWeight: 600, marginBottom: "24px" }}>
      Donation Details
    </h1>

    <div
      style={{
        backgroundColor: "#f5f5f5",
        borderRadius: "16px 16px 0 0",
        display: "grid",
        gridTemplateColumns: "1.2fr 1.8fr 1fr 1fr",
        padding: "16px 24px",
        fontWeight: 600,
      }}
    >
      <div>Item</div>
      <div>Location</div>
      <div>Donor</div>
      <div>Date - Time</div>
    </div>

    {items.length === 0 ? (
  <div style={{ padding: "24px", color: "#777" }}>
    No completed donations
  </div>
) : (
  items.map((item) => (
      <div
        key={item._id}
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1.8fr 1fr 1fr",
          padding: "20px 24px",
          borderBottom: "1px solid #e5e5e5",
          alignItems: "start",
        }}
      >
        <div>{item.name?.join(", ") || "N/A"}</div>

        <div>
          <div>{item.address}</div>
          <div>
            {item.city}, {item.state} {item.zipCode}
          </div>
        </div>

        <div>{getDonorName(item.donorId)}</div>

        <div>{moment(item.timeSubmitted).format("MM.DD.YYYY - h:mm A")}</div>
      </div>
      ))
)}
  </div>
);
}
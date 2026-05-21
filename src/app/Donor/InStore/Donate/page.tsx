"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { addItem } from "../../../../api/item";
import {
  updateInStoreName,
  updateInStoreEmail,
  updateInStorePhone,
  updateInStoreAddress,
  updateInStoreCity,
  updateInStoreState,
  updateInStoreZipCode,
  updateInStoreCategories,
  updateInStoreItemDetails,
  updateInStoreEstimatedValue,
  updateInStoreItemId,
  clearInStoreAll,
} from "../../../../redux/inStoreDonorSlice";

require("../../../../App.css");

const ITEM_CATEGORIES = [
  "Appliances",
  "Building Materials",
  "Cabinets",
  "Doors",
  "Electrical & Lighting",
  "Flooring",
  "Furniture",
  "Garden & Outdoor",
  "Hardware",
  "Houseware",
  "Paint",
  "Plumbing",
  "Tile",
  "Tools",
  "Windows",
];

function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0,
  );
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return width;
}

function InStoreDonatePage(): React.ReactNode {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(clearInStoreAll());
  }, []);

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("CA");
  const [zipCode, setZipCode] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [itemDetails, setItemDetails] = useState<string>("");
  const [estimatedValue, setEstimatedValue] = useState<string>("");

  const [nameError, setNameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");
  const [addressError, setAddressError] = useState<string>("");
  const [cityError, setCityError] = useState<string>("");
  const [stateError, setStateError] = useState<string>("");
  const [zipCodeError, setZipCodeError] = useState<string>("");
  const [categoriesError, setCategoriesError] = useState<string>("");
  const [estimatedValueError, setEstimatedValueError] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const toggleCategory = (category: string) => {
    setCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const updateStore = () => {
    dispatch(updateInStoreName(name));
    dispatch(updateInStoreEmail(email));
    dispatch(updateInStorePhone(phone));
    dispatch(updateInStoreAddress(address));
    dispatch(updateInStoreCity(city));
    dispatch(updateInStoreState(state));
    dispatch(updateInStoreZipCode(zipCode));
    dispatch(updateInStoreCategories(categories));
    dispatch(updateInStoreItemDetails(itemDetails));
    dispatch(updateInStoreEstimatedValue(estimatedValue));
  };

  const validInput = (): boolean => {
    let valid = true;
    setNameError("");
    setEmailError("");
    setPhoneError("");
    setAddressError("");
    setCityError("");
    setStateError("");
    setZipCodeError("");
    setCategoriesError("");
    setEstimatedValueError("");

    if (!name.match(/\S/)) {
      setNameError("Please enter your name");
      valid = false;
    }
    if (!email.match(/\S/)) {
      setEmailError("Please enter your email");
      valid = false;
    }
    if (!phone.match(/\S/)) {
      setPhoneError("Please enter your phone number");
      valid = false;
    }
    if (!address.match(/\S/)) {
      setAddressError("Please enter your address");
      valid = false;
    }
    if (!city.match(/\S/)) {
      setCityError("Please enter your city");
      valid = false;
    }
    if (!state.match(/\S/)) {
      setStateError("Please enter your state");
      valid = false;
    }
    if (!zipCode.match(/\S/)) {
      setZipCodeError("Please enter your ZIP code");
      valid = false;
    }
    if (categories.length === 0) {
      setCategoriesError("Please select at least one category");
      valid = false;
    }
    if (!estimatedValue.match(/\S/)) {
      setEstimatedValueError("Please enter an estimated value");
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async () => {
    if (validInput()) {
      setIsSubmitting(true);
      updateStore();
      try {
        const itemId = await addItem({
          name: categories,
          size: [],
          images: [],
          address,
          city,
          state,
          zipCode,
          scheduling: "InStore",
          timeAvailability: [],
          timeSubmitted: new Date(),
          status: "Completed",
          donorId: "",
          donorName: name,
          donorEmail: email,
          donorPhone: phone,
          estimatedValue,
          itemDetails,
        });
        if (itemId) {
          dispatch(updateInStoreItemId(itemId));
          router.replace("/Donor/InStore/Receipt");
        } else {
          alert(
            "Something went wrong submitting your donation. Please try again.",
          );
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const width = useWindowWidth();
  const isTablet = width >= 768 && width < 1024;

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: isTablet ? "44px" : "29.32px",
    border: "1px solid #005B99",
    borderRadius: "12px",
    padding: isTablet ? "0px 14px" : "0px 9.26px",
    boxSizing: "border-box",
    fontFamily: "Inter, sans-serif",
    fontSize: isTablet ? "15px" : "10.8px",
    color: "#0A0A0A",
    background: "#FFFFFF",
    outline: "none",
  };

  const sectionHeadingStyle: React.CSSProperties = {
    fontFamily: "Inter, sans-serif",
    fontWeight: 600,
    fontSize: isTablet ? "20px" : "13.89px",
    letterSpacing: "-0.34px",
    color: "#0A0A0A",
    margin: isTablet ? "0 0 14px 0" : "0 0 9.26px 0",
  };

  const subLabelStyle: React.CSSProperties = {
    fontFamily: "Inter, sans-serif",
    fontWeight: 400,
    fontSize: isTablet ? "14px" : "10.03px",
    letterSpacing: "-0.06px",
    color: "#4A5565",
    margin: isTablet ? "0 0 10px 0" : "0 0 6.17px 0",
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: isTablet ? "90vw" : "574px",
    width: "100%",
    margin: "0 auto",
    background: "#FFFFFF",
    boxShadow:
      "0px 8px 10px -6px rgba(0,0,0,0.25), 0px 20px 25px -5px rgba(0,0,0,0.1)",
    paddingBottom: "2rem",
  };

  return (
    <div style={containerStyle}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "32px 0 0",
        }}
      >
        <Image
          src="/images/logo.png"
          alt="ReStore Logo"
          width={isTablet ? 400 : 220}
          height={60}
          style={{ objectFit: "contain" }}
        />
      </div>

      {/* Items Section */}
      <div style={{ padding: isTablet ? "40px 48px 0" : "27.7px 24.69px 0" }}>
        <h2 style={sectionHeadingStyle}>Items</h2>
        <p style={subLabelStyle}>Select recommended items:</p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: isTablet ? "10px" : "6px",
            marginBottom: isTablet ? "14px" : "9.26px",
          }}
        >
          {ITEM_CATEGORIES.map((category) => {
            const selected = categories.includes(category);
            return (
              <button
                key={category}
                type="button"
                onClick={() => toggleCategory(category)}
                style={{
                  padding: isTablet ? "8px 16px" : "6px 10.8px",
                  border: selected
                    ? "1.54px solid #005B99"
                    : "1.54px solid #99A1AF",
                  borderRadius: "9999px",
                  background: selected ? "#005B99" : "#FFFFFF",
                  color: selected ? "#FFFFFF" : "#364153",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: isTablet ? "14px" : "10.03px",
                  letterSpacing: "-0.06px",
                  cursor: "pointer",
                }}
              >
                {category}
              </button>
            );
          })}
        </div>
        <div className="inputError" style={{ marginBottom: "6px" }}>
          {categoriesError}
        </div>

        <textarea
          placeholder="Add additional items or provide more details..."
          value={itemDetails}
          onChange={(e) => setItemDetails(e.target.value)}
          rows={4}
          style={{
            width: "100%",
            border: "1px solid #005B99",
            borderRadius: "12px",
            padding: isTablet ? "14px" : "9.26px",
            boxSizing: "border-box",
            fontFamily: "Inter, sans-serif",
            fontSize: isTablet ? "15px" : "10.8px",
            color: "#0A0A0A",
            resize: "none",
            outline: "none",
            marginBottom: isTablet ? "14px" : "9.26px",
          }}
        />

        <div style={{ marginBottom: isTablet ? "14px" : "9.26px" }}>
          <p style={subLabelStyle}>Estimated Value</p>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span
              style={{
                padding: isTablet ? "0px 14px" : "0px 9.26px",
                height: isTablet ? "44px" : "29.32px",
                display: "flex",
                alignItems: "center",
                border: "1px solid #005B99",
                borderRight: "none",
                borderRadius: "12px 0 0 12px",
                background: "#F6F7F8",
                fontFamily: "Inter, sans-serif",
                fontSize: isTablet ? "15px" : "10.8px",
              }}
            >
              $
            </span>
            <input
              type="text"
              value={estimatedValue}
              onChange={(e) => setEstimatedValue(e.target.value)}
              style={{ ...inputStyle, borderRadius: "0 12px 12px 0" }}
            />
          </div>
          <div className="inputError">{estimatedValueError}</div>
        </div>
      </div>

      {/* Donor Information Section */}
      <div style={{ padding: isTablet ? "40px 48px 0" : "27.7px 24.69px 0" }}>
        <h2 style={sectionHeadingStyle}>Donor Information</h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: isTablet ? "14px" : "9.26px",
          }}
        >
          <div>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
            />
            <div className="inputError">{nameError}</div>
          </div>
          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
            <div className="inputError">{emailError}</div>
          </div>
          <div>
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={inputStyle}
            />
            <div className="inputError">{phoneError}</div>
          </div>
          <div>
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={inputStyle}
            />
            <div className="inputError">{addressError}</div>
          </div>
          <div style={{ display: "flex", gap: isTablet ? "14px" : "9.26px" }}>
            <div style={{ flex: 1 }}>
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={inputStyle}
              />
              <div className="inputError">{cityError}</div>
            </div>
            <div style={{ flex: 1 }}>
              <input
                type="text"
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                style={inputStyle}
              />
              <div className="inputError">{stateError}</div>
            </div>
          </div>
          <div style={{ width: "50%" }}>
            <input
              type="text"
              placeholder="ZIP Code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              style={inputStyle}
            />
            <div className="inputError">{zipCodeError}</div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div style={{ padding: isTablet ? "40px 48px 0" : "27.7px 24.69px 0" }}>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          style={{
            width: "100%",
            height: isTablet ? "48px" : "29.32px",
            background: isSubmitting ? "#3A8FC7" : "#005B99",
            border: "none",
            borderRadius: "12px",
            color: "#FFFFFF",
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: isTablet ? "18px" : "13.89px",
            letterSpacing: "-0.34px",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "background 0.2s",
            opacity: isSubmitting ? 0.85 : 1,
          }}
        >
          {isSubmitting && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{ animation: "spin 0.75s linear infinite" }}
            >
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          )}
          {isSubmitting ? "Submitting..." : "Submit Form"}
        </button>
      </div>
    </div>
  );
}

export default InStoreDonatePage;

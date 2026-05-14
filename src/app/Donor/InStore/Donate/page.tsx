"use client";

import React, { useEffect, useState } from "react";
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

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: "29.32px",
  border: "1px solid #005B99",
  borderRadius: "12px",
  padding: "0px 9.26px",
  boxSizing: "border-box",
  fontFamily: "Inter, sans-serif",
  fontSize: "10.8px",
  color: "#0A0A0A",
  background: "#FFFFFF",
  outline: "none",
};

const sectionHeadingStyle: React.CSSProperties = {
  fontFamily: "Inter, sans-serif",
  fontWeight: 600,
  fontSize: "13.89px",
  letterSpacing: "-0.34px",
  color: "#0A0A0A",
  margin: "0 0 9.26px 0",
};

const subLabelStyle: React.CSSProperties = {
  fontFamily: "Inter, sans-serif",
  fontWeight: 400,
  fontSize: "10.03px",
  letterSpacing: "-0.06px",
  color: "#4A5565",
  margin: "0 0 6.17px 0",
};

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
  const [state, setState] = useState<string>("");
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

  const toggleCategory = (category: string) => {
    setCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
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

    if (!name.match(/\S/)) { setNameError("Please enter your name"); valid = false; }
    if (!email.match(/\S/)) { setEmailError("Please enter your email"); valid = false; }
    if (!phone.match(/\S/)) { setPhoneError("Please enter your phone number"); valid = false; }
    if (!address.match(/\S/)) { setAddressError("Please enter your address"); valid = false; }
    if (!city.match(/\S/)) { setCityError("Please enter your city"); valid = false; }
    if (!state.match(/\S/)) { setStateError("Please enter your state"); valid = false; }
    if (!zipCode.match(/\S/)) { setZipCodeError("Please enter your ZIP code"); valid = false; }
    if (categories.length === 0) { setCategoriesError("Please select at least one category"); valid = false; }
    if (!estimatedValue.match(/\S/)) { setEstimatedValueError("Please enter an estimated value"); valid = false; }

    return valid;
  };

  const handleSubmit = async () => {
    if (validInput()) {
      updateStore();
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
        status: "needs approval",
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
        alert("Something went wrong submitting your donation. Please try again.");
      }
    }
  };

  return (
    <div style={{
      maxWidth: "574px",
      margin: "0 auto",
      background: "#FFFFFF",
      boxShadow: "0px 8px 10px -6px rgba(0,0,0,0.25), 0px 20px 25px -5px rgba(0,0,0,0.1)",
      paddingBottom: "2rem",
    }}>

      {/* Items Section */}
      <div style={{ padding: "27.7px 24.69px 0" }}>
        <h2 style={sectionHeadingStyle}>Items</h2>
        <p style={subLabelStyle}>Select recommended items:</p>

        {/* Category Pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "9.26px" }}>
          {ITEM_CATEGORIES.map((category) => {
            const selected = categories.includes(category);
            return (
              <button
                key={category}
                type="button"
                onClick={() => toggleCategory(category)}
                style={{
                  padding: "6px 10.8px",
                  border: selected ? "1.54px solid #005B99" : "1.54px solid #99A1AF",
                  borderRadius: "9999px",
                  background: selected ? "#005B99" : "#FFFFFF",
                  color: selected ? "#FFFFFF" : "#364153",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: "10.03px",
                  letterSpacing: "-0.06px",
                  cursor: "pointer",
                }}
              >
                {category}
              </button>
            );
          })}
        </div>
        <div className="inputError" style={{ marginBottom: "6px" }}>{categoriesError}</div>

        {/* Additional Details Textarea */}
        <textarea
          placeholder="Add additional items or provide more details..."
          value={itemDetails}
          onChange={(e) => setItemDetails(e.target.value)}
          rows={4}
          style={{
            width: "100%",
            border: "1px solid #005B99",
            borderRadius: "12px",
            padding: "9.26px",
            boxSizing: "border-box",
            fontFamily: "Inter, sans-serif",
            fontSize: "10.8px",
            color: "#0A0A0A",
            resize: "none",
            outline: "none",
            marginBottom: "9.26px",
          }}
        />

        {/* Estimated Value */}
        <div style={{ marginBottom: "9.26px" }}>
          <p style={subLabelStyle}>Estimated Value</p>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{
              padding: "0px 9.26px",
              height: "29.32px",
              display: "flex",
              alignItems: "center",
              border: "1px solid #005B99",
              borderRight: "none",
              borderRadius: "12px 0 0 12px",
              background: "#F6F7F8",
              fontFamily: "Inter, sans-serif",
              fontSize: "10.8px",
            }}>$</span>
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
      <div style={{ padding: "27.7px 24.69px 0" }}>
        <h2 style={sectionHeadingStyle}>Donor Information</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "9.26px" }}>
          <div>
            <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
            <div className="inputError">{nameError}</div>
          </div>

          <div>
            <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
            <div className="inputError">{emailError}</div>
          </div>

          <div>
            <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} />
            <div className="inputError">{phoneError}</div>
          </div>

          <div>
            <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} style={inputStyle} />
            <div className="inputError">{addressError}</div>
          </div>

          <div style={{ display: "flex", gap: "9.26px" }}>
            <div style={{ flex: 1 }}>
              <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} style={inputStyle} />
              <div className="inputError">{cityError}</div>
            </div>
            <div style={{ flex: 1 }}>
              <input type="text" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} style={inputStyle} />
              <div className="inputError">{stateError}</div>
            </div>
          </div>

          <div style={{ width: "50%" }}>
            <input type="text" placeholder="ZIP Code" value={zipCode} onChange={(e) => setZipCode(e.target.value)} style={inputStyle} />
            <div className="inputError">{zipCodeError}</div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div style={{ padding: "27.7px 24.69px 0" }}>
        <button
          type="button"
          onClick={handleSubmit}
          style={{
            width: "100%",
            height: "29.32px",
            background: "#005B99",
            border: "none",
            color: "#FFFFFF",
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: "13.89px",
            letterSpacing: "-0.34px",
            cursor: "pointer",
          }}
        >
          submit form
        </button>
      </div>
    </div>
  );
}

export default InStoreDonatePage;

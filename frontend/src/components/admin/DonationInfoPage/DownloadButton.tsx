import React from "react";
import DownloadArrow from "../../../images/DownloadArrow.svg";

interface DownloadButtonProps {
  onClick: () => void;
  label?: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  onClick,
  label = "Export to CSV",
}) => {
  const styles: React.CSSProperties = {
    backgroundColor: "#d3d3d3", // light gray
    color: "#000",
    padding: "10px 20px",
    fontSize: "0.95rem",
    fontWeight: 500,
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s ease-in-out",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const [hover, setHover] = React.useState(false);

  return (
    <button
      onClick={onClick}
      style={{
        ...styles,
        backgroundColor: hover ? "#c0c0c0" : styles.backgroundColor,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {label}
      <img src={DownloadArrow.src} alt="Download icon" style={{ width: "18px", height: "18px" }} />
    </button>
  );
};

export default DownloadButton;

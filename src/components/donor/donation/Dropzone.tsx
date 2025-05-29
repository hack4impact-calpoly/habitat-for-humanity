// Dropzone.tsx
import React, {
  MutableRefObject,
  useCallback,
  useRef,
  useState,
  useEffect,
} from "react";
import styled from "styled-components";
import { getFiles } from "../../../../utils/FileStore";

type DropZoneProps = {
  setFiles: (files: File[]) => void;
  clearFiles: () => void;
};

const DropContainer = styled.div`
  height: 275px;
  border: 1px dashed var(--dashed-box);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  background-color: var(--background);
  &:hover {
    cursor: pointer;
  }
`;

const UploadIcon = styled.div`
  width: 50px;
  height: 50px;
  background: url(https://img.icons8.com/pastel-glyph/64/000000/upload--v1.png)
    no-repeat center center;
  background-size: 100%;
  text-align: center;
  margin: 0 auto;
  margin-top: 1em;
  padding-top: 30px;
`;

const DropMessage = styled.div`
  text-align: center;
  color: var(--primary);
  font-size: 23px;
  font-weight: 500;
  margin-top: 1.2em;
`;

const Message = styled.h1`
  font-size: 15px;
  line-height: 25px;
  color: var(--black);
  text-align: center;
`;

const ImageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  background-color: var(--background);
  border: 1px dashed var(--dashed-box);
`;

const ClearMessage = styled.div`
  text-align: left;
  color: var(--secondary);
  font-size: 15px;
  font-weight: 500;
  &:hover {
    cursor: pointer;
    color: var(--red);
  }
`;

async function compressImage(file: Blob, quality: number): Promise<Blob> {
  const image = new Image();
  image.src = URL.createObjectURL(file);
  await new Promise((resolve) => {
    image.onload = resolve;
  });

  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext("2d");
  ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob as Blob), "image/jpeg", quality / 100);
  });
}

const Dropzone: React.FC<DropZoneProps> = ({ setFiles, clearFiles }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dropPhotos, setDropPhotos] = useState<File[]>(getFiles());
  const [preview, setPreview] = useState<string[]>([]);

  const MAX_IMAGE_SIZE = 5_000_000; // 5MB
  const MAX_IMAGE_COUNT = 10;
  const COMPRESSED_IMAGE_QUALITY = 40;

  // build previews on dropPhotos change
  useEffect(() => {
    const urls = dropPhotos.map((f) => URL.createObjectURL(f));
    setPreview(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [dropPhotos]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    processFilesInput(e.dataTransfer.files);
  }, []);

  const clearImages = async () => {
    setDropPhotos([]);
    clearFiles();
  };

  const processFilesInput = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);

    if (arr.some((f) => f.size > MAX_IMAGE_SIZE)) {
      alert("Some files exceed 5MB. Please choose smaller images.");
      return;
    }
    if (arr.length + dropPhotos.length > MAX_IMAGE_COUNT) {
      alert(`You can only upload up to ${MAX_IMAGE_COUNT} images.`);
      return;
    }

    Promise.all(arr.map((f) => compressImage(f, COMPRESSED_IMAGE_QUALITY)))
      .then((blobs) => {
        const compressedFiles = blobs.map(
          (b, i) => new File([b], arr[i].name, { type: b.type }),
        );
        const combinedFiles = [...dropPhotos, ...compressedFiles];
        setFiles(combinedFiles);
        setDropPhotos(combinedFiles);
      })
      .catch((err) => {
        console.error("Image processing error:", err);
        alert("Error processing images. Please try again.");
      });
  };

  return (
    <div>
      {preview.length ? (
        <>
          <ClearMessage onClick={clearImages}>Clear Images</ClearMessage>
          <ImageContainer
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className="cursor-pointer"
          >
            {preview.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`preview-${i}`}
                style={{
                  maxWidth: "20%",
                  margin: "10px",
                  objectFit: "cover",
                }}
              />
            ))}
          </ImageContainer>
        </>
      ) : (
        <DropContainer
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <DropMessage>
            Upload Your Images
            <UploadIcon />
            <Message>
              drop your image files or <br />
              <span style={{ color: "var(--secondary)" }}>browse</span> to
              choose
              <br />
              <span style={{ color: "silver" }}>
                max {Math.floor(MAX_IMAGE_SIZE / 1e6)}MB, up to{" "}
                {MAX_IMAGE_COUNT} files
              </span>
            </Message>
          </DropMessage>
        </DropContainer>
      )}
      <input
        type="file"
        hidden
        multiple
        accept="image/*"
        ref={inputRef}
        onChange={(e) => processFilesInput(e.target.files)}
      />
    </div>
  );
};

export default Dropzone;

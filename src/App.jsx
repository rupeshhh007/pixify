import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

const App = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [pixelSize, setPixelSize] = useState(10);
  const canvasRef = useRef(null);
  const dropRef = useRef(null);

  const loadImage = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      loadImage(file);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      loadImage(file);
    }
  }, []);

  const handleDragOver = (e) => e.preventDefault();

  useEffect(() => {
    const dropArea = dropRef.current;
    if (dropArea) {
      dropArea.addEventListener("dragover", handleDragOver);
      dropArea.addEventListener("drop", handleDrop);
    }
    return () => {
      if (dropArea) {
        dropArea.removeEventListener("dragover", handleDragOver);
        dropArea.removeEventListener("drop", handleDrop);
      }
    };
  }, [handleDrop]);

  useEffect(() => {
    if (!imageSrc) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      const { width, height } = img;
      canvas.width = width;
      canvas.height = height;

      const scaledW = Math.ceil(width / pixelSize);
      const scaledH = Math.ceil(height / pixelSize);

      // Use an off-screen canvas
      const offCanvas = document.createElement("canvas");
      offCanvas.width = scaledW;
      offCanvas.height = scaledH;
      const offCtx = offCanvas.getContext("2d");

      offCtx.imageSmoothingEnabled = false;
      offCtx.drawImage(img, 0, 0, scaledW, scaledH);

      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(offCanvas, 0, 0, scaledW, scaledH, 0, 0, width, height);
    };

    img.src = imageSrc;
  }, [imageSrc, pixelSize]);

  const downloadImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "pixelated.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white px-6 py-14 flex flex-col items-center">
      <motion.h1
        className="text-7xl font-extrabold text-yellow-400 mb-14 text-center drop-shadow-lg"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        🎨 Pixify
      </motion.h1>

      <motion.div
        ref={dropRef}
        className="w-full max-w-3xl border-4 border-dashed border-gray-600 p-10 rounded-3xl text-center mb-10 cursor-pointer hover:border-yellow-400 transition-all duration-300 bg-gray-800 bg-opacity-60"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-2xl text-gray-300 font-medium">Drag & drop an image here</p>
        <p className="text-xl text-gray-400 mt-2 mb-6">or click below to upload</p>

        <label className="inline-block bg-yellow-400 text-black text-2xl font-bold px-8 py-4 rounded-xl shadow-xl hover:bg-yellow-300 transition cursor-pointer">
          Choose File
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      </motion.div>

      {imageSrc && (
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <label className="text-2xl font-semibold mt-4 text-gray-300 mb-6">
            Pixel Size:
            <input
              type="range"
              min="2"
              max="50"
              value={pixelSize}
              onChange={(e) => setPixelSize(Number(e.target.value))}
              className="w-96 ml-6 accent-yellow-400"
            />
            <span className="ml-4 text-yellow-300 text-2xl font-bold">{pixelSize}px</span>
          </label>

          <canvas
            ref={canvasRef}
            className="mt-10 border-4 border-yellow-500 rounded-xl shadow-2xl max-w-full"
          />

          <button
            onClick={downloadImage}
            className="mt-12 bg-yellow-400 hover:bg-yellow-300 text-black text-2xl font-bold px-10 py-4 rounded-2xl shadow-xl transition-all"
          >
            ⬇ Download Pixelated Image
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default App;

import { useRef, useState } from "react";
import { Button } from "./components/ui/button";

const App = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [convertedImage, setConvertedImage] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const canvasRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImageSrc(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const convertImage = (format) => {
    setIsConverting(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = imageSrc;

    img.onload = async () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const newImage = await canvas.toDataURL(format);
      setConvertedImage(newImage);
      setIsConverting(false);
    };
  };

  return (
    <div className="bg-black p-4 pt-2 text-white absolute inset-0 grid grid-rows-[60px_1fr]">
      <header className="flex justify-between items-center">
        <span className="text-[20px] font-bold">Convertbomb</span>
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setConvertedImage(null);
              setImageSrc(null);
              handleImageUpload(e);
            }}
            id="file-upload"
            className="hidden"
          />
          <Button
            onClick={() => {
              document.getElementById("file-upload").click();
            }}
            className="m-auto"
          >
            Upload image
          </Button>
        </div>
      </header>
      <main>
        {imageSrc && (
          <div className="flex flex-col gap-4 justify-center items-center">
            {convertedImage ? (
              <div>
                <img
                  src={convertedImage}
                  alt="Converted"
                  className="max-w-full max-h-[calc(80vh-60px)] rounded-lg shadow-lg"
                />
              </div>
            ) : (
              <div>
                <img
                  src={imageSrc}
                  alt="Original"
                  className="max-w-full max-h-[calc(80vh-60px)] rounded-lg shadow-lg"
                />
              </div>
            )}
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <div className="flex gap-4 items-center">
              {convertedImage == null ? (
                isConverting ? (
                  <>Hang on while we convert your file...</>
                ) : (
                  <>
                    Convert to
                    <Button onClick={() => convertImage("image/png")}>
                      PNG
                    </Button>
                    <Button onClick={() => convertImage("image/jpeg")}>
                      JPEG
                    </Button>
                    <Button onClick={() => convertImage("image/webp")}>
                      WEBP
                    </Button>
                  </>
                )
              ) : (
                <a href={convertedImage} download="converted-image">
                  <Button onClick={() => convertImage("image/png")}>
                    Download as{" "}
                    {convertedImage
                      .split(",")[0]
                      .split(";")[0]
                      .split(":")[1]
                      .split("/")[1]
                      .toUpperCase()}
                  </Button>
                </a>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;

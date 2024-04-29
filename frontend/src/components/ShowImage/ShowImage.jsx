import { useEffect, useState } from "react";
import "./ShowImage.css";

const ShowImage = ({ url, type, style }) => {
  const [showImage, setShowImage] = useState(false);

  const onError = () => {
    setShowImage(false);
  };

  useEffect(() => {
    if (url) setShowImage(true);
  }, [url]);

  return (
    <div className={`${type}-image${showImage ? " hide-overflow" : ""}`}>
      {showImage && showImage ? (
        <img style={style} onError={onError} src={url} />
      ) : (
        <div className="no-image">
          <h2>Image couldn&apos;t be loaded</h2>
        </div>
      )}
    </div>
  );
};

export default ShowImage;

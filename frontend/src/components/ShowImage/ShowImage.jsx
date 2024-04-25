import { useEffect, useState } from "react";
import "./ShowImage.css";

const ShowImage = ({ url, type }) => {
  const [showImage, setShowImage] = useState(false);

  const onError = () => {
    setShowImage(false);
  };

  console.log(url);

  useEffect(() => {
    if (url) setShowImage(true);
    console.log(url);
  }, [url]);

  return (
    <div className={`${type}-image${showImage ? " hide-overflow" : ""}`}>
      {showImage && showImage ? (
        <img
          onError={onError}
          src={"https://picsum.photos/seed/picsum/200/300"}
        />
      ) : (
        <div className="no-image">
          <h2>Image couldn&apos;t be loaded</h2>
        </div>
      )}
    </div>
  );
};

export default ShowImage;

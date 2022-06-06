import { useEffect, useState } from "react";
import ImageCarousel from "./ImageCarousel/ImageCarousel";
import "./styles.css";

interface PicsumImage {
  url: string;
  author: string;
}

export default function App() {
  const [images, setImages] = useState([]);

  const getImages = async () => {
    const randomImages = await fetch("https://picsum.photos/v2/list?limit=20");
    const resultImages: Array<PicsumImage> = await randomImages.json();

    console.log(resultImages);
    return resultImages;
  };

  useEffect(() => {
    const getAndSetImages = async () => {
      if (images.length === 0) {
        const resultImages = await getImages();
        setImages(
          resultImages.map((image) => ({
            url: `https://picsum.photos/id/${image.id}/1000/500`,
            altText: `Photo by ${image.author}`
          }))
        );
      }
    };

    getAndSetImages();
  }, [images]);

  return (
    <div className="App">
      <h1>Image Carousel</h1>
      <ImageCarousel images={images} />
    </div>
  );
}

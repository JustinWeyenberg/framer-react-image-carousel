import { useState } from "react";
import ImageCarousel from "./ImageCarousel/ImageCarousel";
import "./styles.css";

export default function App() {
  const [images] = useState(
    Array.from(Array(20).keys()).map((id) => ({
      altText: "Random Image",
      url: `https://picsum.photos/1000/500?random=${id}`
    }))
  );
  //images.forEach((x) => (x.url = `http://picsum.photos/1000}`));

  return (
    <div className="App">
      <h1>Image Carousel</h1>
      <ImageCarousel images={images} />
    </div>
  );
}

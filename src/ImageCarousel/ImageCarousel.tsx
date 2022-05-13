import { animate, motion, useMotionValue } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

export interface ImageCarouselImage {
  url: string;
  altText: string;
}

export interface ImageCarouselProps {
  images: ImageCarouselImage[];
  thumbnailWidth?: number;
}

const ImageCarousel = ({
  images,
  thumbnailWidth = 150
}: ImageCarouselProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  let selectedImage = images?.[selectedImageIndex];
  const carouselItemsRef = useRef<HTMLDivElement[] | null[]>([]);
  const x = useMotionValue(0);
  const thumbnailWidthWithPadding = thumbnailWidth + 10;

  const carouselElementRef = useRef<HTMLDivElement>();
  const carouselWidth = images.length * thumbnailWidthWithPadding - 10;

  const handleSelectedImageChange = (newIndex: number) => {
    if (images && images.length > 0) {
      setSelectedImageIndex(newIndex);

      if (carouselItemsRef?.current[newIndex]) {
        const carouselMiddle =
          carouselElementRef.current.clientWidth / 2 - thumbnailWidth / 2;
        const offsetLeft =
          carouselMiddle - newIndex * thumbnailWidthWithPadding;

        // We want to contain the bounds of the draggable area
        let newX = offsetLeft;
        if (newX >= 0) {
          newX = 0;
        } else if (
          newX <= -(carouselWidth - carouselElementRef.current.clientWidth)
        ) {
          newX = -(carouselWidth - carouselElementRef.current.clientWidth);
        }

        animate(x, newX);
      }
    }
  };

  /*useEffect(() => {
    handleSelectedImageChange(0);
  }, []);*/

  const [dragEnd, setDragEnd] = useState<number>();

  // Handle an issue with initial load and making sure dragContraints are updated
  useEffect(() => {
    setDragEnd(-(carouselWidth - carouselElementRef?.current?.clientWidth));
  }, [carouselWidth, carouselElementRef?.current?.clientWidth]);

  if (!selectedImage) return null;

  return (
    <>
      <div className="selected-image-container">
        <img
          //key={selectedImage.url}
          className="selected-image"
          src={selectedImage.url}
          alt={selectedImage.altText}
        />
      </div>
      <div
        className="carousel"
        style={images?.length < 2 ? { display: "none" } : undefined}
      >
        <div className="carousel-images">
          <motion.div
            ref={carouselElementRef}
            drag="x"
            dragConstraints={{
              left: dragEnd,
              right: 0
            }}
            style={{ display: "flex", maxWidth: "100%", x }}
          >
            {images &&
              images.map((image, index) => (
                <motion.div
                  onTap={() => handleSelectedImageChange(index)}
                  key={image.url}
                  style={{ minWidth: thumbnailWidth }}
                  className={`carousel-image-container ${
                    selectedImageIndex === index
                      ? "carousel-image-selected"
                      : ""
                  }`}
                  ref={(el) => (carouselItemsRef.current[index] = el)}
                >
                  <img
                    style={{ maxWidth: thumbnailWidth }}
                    className="carousel-image"
                    src={image.url}
                    alt={image.altText}
                    draggable="false"
                  />
                </motion.div>
              ))}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ImageCarousel;

import { animate, motion, useMotionValue } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import useWindowSize from "../hooks/useWindowsSize";

export interface ImageCarouselImage {
  url: string;
  altText: string;
}

export interface ImageCarouselProps {
  images: ImageCarouselImage[];
  thumbnailWidth?: number;
  thumbnailPadding?: number;
}

const ImageCarousel = ({
  images,
  thumbnailWidth = 150,
  thumbnailPadding = 10
}: ImageCarouselProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  let selectedImage = images?.[selectedImageIndex];
  const carouselItemsRef = useRef<HTMLDivElement[] | null[]>([]);
  const x = useMotionValue(0);
  const size = useWindowSize();
  const thumbnailWidthWithPadding = thumbnailWidth + thumbnailPadding;

  const carouselElementRef = useRef<HTMLDivElement>();
  const carouselWidth = images.length * thumbnailWidthWithPadding;
  const carouselDragCorrection = 7;

  const handleSelectedImageChange = (newIndex: number) => {
    if (images && images.length > 0) {
      setSelectedImageIndex(newIndex);

      if (carouselItemsRef?.current[newIndex]) {
        const carouselMiddle = size.width / 2 - thumbnailWidth / 2;
        const offsetLeft =
          carouselMiddle -
          newIndex * thumbnailWidthWithPadding -
          carouselDragCorrection;

        // We want to contain the bounds of the draggable area
        let newX = offsetLeft;
        if (newX >= 0) {
          newX = 0;
        } else if (
          newX <= -(carouselWidth - size.width + carouselDragCorrection)
        ) {
          newX = -(carouselWidth - size.width + carouselDragCorrection);
        }

        animate(x, newX);
      }
    }
  };

  /*useEffect(() => {
    handleSelectedImageChange(0);
  }, []);*/

  // Fix for on load x.current / x.get() changes to NaN and breaks animation
  useEffect(() => {
    if (isNaN(x.get())) x.set(0);
  }, [x.get()]);

  const [dragEnd, setDragEnd] = useState<number>();

  // Keep dragContraints updated on load and resize (otherwise you can drag outside of bounds)
  useEffect(() => {
    setDragEnd(-(carouselWidth - size.width + carouselDragCorrection));
    //handleSelectedImageChange(selectedImageIndex);
  }, [carouselWidth, size.width]);

  // Keep selected thumbnail centered on browser resize
  useEffect(() => {
    //if (isNaN(x.get())) x.set(0);
    //setDragEnd(-(carouselWidth - size.width));
    handleSelectedImageChange(selectedImageIndex);
  }, [dragEnd, selectedImageIndex]);

  if (!selectedImage) return null;

  return (
    <>
      <div className="selected-image-container">
        <img
          key={selectedImage.url}
          className="selected-image"
          s
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
            key={dragEnd} // Fixes an issue where boundaries are not respected on resize
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
                  style={{
                    minWidth: thumbnailWidth,
                    marginRight:
                      index === images.length - 1 ? 0 : thumbnailPadding
                  }}
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

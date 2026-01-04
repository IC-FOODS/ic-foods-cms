"use client";

import { useState } from "react";

interface VideoThumbnailProps {
  src: string;
  alt: string;
  className?: string;
}

export function VideoThumbnail({ src, alt, className }: VideoThumbnailProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => {
        setImgSrc("/assets/video-placeholder.jpg");
      }}
    />
  );
}

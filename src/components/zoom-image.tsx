"use client";

import Image, { type ImageProps } from "next/image";

export function ZoomImage({
  alt,
  className = "",
  style,
  ...props
}: ImageProps) {
  return (
    <Image
      {...props}
      alt={alt}
      className={`${className} cursor-zoom-in transition-transform duration-500 ease-out hover:scale-[1.06] motion-reduce:transition-none`}
      style={{ ...style, transformOrigin: "center center" }}
      onPointerMove={(event) => {
        if (event.pointerType === "touch") return;
        const bounds = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width) * 100;
        const y = ((event.clientY - bounds.top) / bounds.height) * 100;
        event.currentTarget.style.transformOrigin = `${x}% ${y}%`;
      }}
      onPointerLeave={(event) => {
        event.currentTarget.style.transformOrigin = "center center";
      }}
    />
  );
}

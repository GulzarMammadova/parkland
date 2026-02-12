import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { testimonials } from "./data";
import { TestimonialCard } from "./TestimonialCard";

export function SliderSection() {
  const [emblaRef] = useEmblaCarousel({
    loop: true,
    align: "start",
  });

  return (
    <div className="rl-slider">
      <div className="rl-viewport" ref={emblaRef}>
        <div className="rl-track">
          {testimonials.map((item) => (
            <TestimonialCard key={item.id} data={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
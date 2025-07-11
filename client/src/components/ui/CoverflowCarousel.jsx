// src/components/CoverflowCarousel.jsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";

import "./CoverflowCarousel.css"; // Custom styles

const images = [
  "./pirate.jpeg",
  "./img1.png",
  "/img2.jpeg",
  "/img3.jpeg",
  "/img4.jpeg",
  "/horn.png",
  "/img5.jpeg",
  "/moon.jpeg",
  '/elephant.jpeg'
];

function CoverflowCarousel() {
  return (
    <div className="carousel" style={{ position: 'relative', zIndex: '9999' }}>
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        loop={true}
        autoplay={{
          delay: 1000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        speed={800}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 200,
          modifier: 2.5,
          slideShadows: false,
        }}
        modules={[EffectCoverflow, Autoplay]}
        className="mySwipers"
        breakpoints={{
          320: {
            slidesPerView: 2,
            spaceBetween: 20,
            coverflowEffect: {
              rotate: 10,
              stretch: 0,
              depth: 100,
              modifier: 1.5,
              slideShadows: false,
            },
          },
          480: {
            slidesPerView: 2,
            spaceBetween: 50,
            coverflowEffect: {
              rotate: 0,
              stretch: 0,
              depth: 150,
              modifier: 2,
              slideShadows: false,
            },
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 40,
            coverflowEffect: {
              rotate: 0,
              stretch: 0,
              depth: 200,
              modifier: 2.5,
              slideShadows: false,
            },
          },
          1024: {
            slidesPerView: "auto",
            spaceBetween: 100,
            coverflowEffect: {
              rotate: 10,
              stretch: 0,
              depth: 200,
              modifier: 2.5,
              slideShadows: false,
            },
          },
        }}
      >
        {images.map((img, index) => (
          <SwiperSlide key={index} className="swiper-slide_coverflow">
            <img src={img} alt={`Slide ${index}`} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default CoverflowCarousel;


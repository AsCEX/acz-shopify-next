"use client";

import type {ProductCard} from '@/lib/types';
import Image from 'next/image';

import {useRef, useState} from "react";
import {Swiper, SwiperSlide} from "swiper/react";
import type {Swiper as SwiperInstance} from "swiper";

import "swiper/css";

const tabs = [
  {
    id: "overview",
    label: "Overview",
    content: (
      <div>
        <h2 className="text-2xl font-bold">Overview</h2>
        <p className="mt-3 text-gray-600">
          This is the overview content.
        </p>
      </div>
    ),
  },
  {
    id: "features",
    label: "Features",
    content: (
      <div>
        <h2 className="text-2xl font-bold">Features</h2>
        <p className="mt-3 text-gray-600">
          These are the available features.
        </p>
      </div>
    ),
  },
  {
    id: "reviews",
    label: "Reviews",
    content: (
      <div>
        <h2 className="text-2xl font-bold">Reviews</h2>
        <p className="mt-3 text-gray-600">
          This is the reviews section.
        </p>
      </div>
    ),
  },
];

function shouldShowComparePrice(productId: string) {
  const hash = Array.from(productId).reduce(
    (total, char) => total + char.charCodeAt(0),
    0,
  );

  return hash % 2 === 0;
}

export default function SwipeTabs({ products }: { products: ProductCard[] }) {
  const swiperRef = useRef<SwiperInstance | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleMenuClick = (index: number) => {
    swiperRef.current?.slideTo(index);
  };

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-4xl flex-col">
      {/* Synchronized menu */}
      <div className="sticky top-0 z-20 bg-white">
        <div className="flex overflow-x-auto border-b border-gray-200">
            {tabs.map((tab, index) => {
            const isActive = activeIndex === index;

            return (
                <button
                key={tab.id}
                type="button"
                onClick={() => handleMenuClick(index)}
                className={[
                    "relative shrink-0 px-5 py-3 text-sm font-semibold transition",
                    isActive
                    ? "text-[var(--color-primary)]"
                    : "text-gray-500 hover:text-gray-800",
                ].join(" ")}
                >
                {tab.label}

                {isActive && (
                    <span className="absolute inset-x-0 bottom-1 h-0.5 bg-[var(--color-primary)] w-1/2 mx-auto max-w-[24px]" />
                )}
                </button>
            );
            })}
        </div>
      </div>

      {/* Swipeable content */}
      <Swiper
        className="min-h-0 w-full flex-1"
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.activeIndex);
        }}
        slidesPerView={1}
        spaceBetween={24}
      >
        {tabs.map((tab) => (
          <SwiperSlide key={tab.id} className="min-h-0">
            <div className="h-full min-h-0 overflow-y-auto overscroll-contain p-2">
                <section className="columns-2 gap-4 md:columns-4">
                    {products.map((product: ProductCard) => {
                      const showComparePrice = shouldShowComparePrice(product.id);

                      return (
                    <a key={product.id} href={`/products/${product.handle}`} className="mb-4 block break-inside-avoid bg-gray-100 rounded-md hover:shadow-md transition-shadow shadow">
                        {product.featuredImage ? (
                        <Image
                            src={product.featuredImage.url}
                            alt={product.featuredImage.altText || product.title}
                            width={product.featuredImage.width || 600}
                            height={product.featuredImage.height || 600}
                            className="w-full aspect-square object-cover rounded"
                        />
                        ) : null}
                        <div className="p-2">
                            <h2 className={'truncate text-sm'}>{product.title}</h2>
                            {showComparePrice && (
                                <span className="flex w-full text-sm text-red-500 font-semibold line-through">
                                    {product.priceRange.maxVariantPrice.amount}{' '}
                                </span>
                            )}
                            <span className="text-sm text-[var(--color-primary)] font-semibold" >
                            {product.priceRange.minVariantPrice.amount}{' '}
                            {product.priceRange.minVariantPrice.currencyCode}
                            </span>
                        </div>
                    </a>
                      );
                    })}
                </section>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

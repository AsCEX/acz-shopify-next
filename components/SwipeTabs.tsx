"use client";

import {shopifyFetch} from '@/lib/shopify';
import {PRODUCTS_QUERY} from '@/lib/queries/products';
import type {ProductCard, ProductsQuery} from '@/lib/types';
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

export default function SwipeTabs({ products }: { products: ProductCard[] }) {
  const swiperRef = useRef<SwiperInstance | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleMenuClick = (index: number) => {
    swiperRef.current?.slideTo(index);
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* Synchronized menu */}
      <div className="flex overflow-x-auto border-b border-gray-200">
        {tabs.map((tab, index) => {
          const isActive = activeIndex === index;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleMenuClick(index)}
              className={[
                "relative shrink-0 px-5 py-3 text-sm font-medium transition",
                isActive
                  ? "text-black"
                  : "text-gray-500 hover:text-gray-800",
              ].join(" ")}
            >
              {tab.label}

              {isActive && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-black" />
              )}
            </button>
          );
        })}
      </div>

      {/* Swipeable content */}
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.activeIndex);
        }}
        slidesPerView={1}
        spaceBetween={24}
        autoHeight
      >
        {tabs.map((tab) => (
          <SwiperSlide key={tab.id}>
            <div className="min-h-0 p-2">
                <section className="columns-2 gap-4 md:grid-cols-4">
                    {products.map((product: ProductCard) => (
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
                            {(Math.floor(Math.random() * 100) + 1) % 2 === 0 && (
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
                    ))}
                </section>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
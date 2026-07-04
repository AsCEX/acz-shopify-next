"use client";
import type {CollectionsQuery, ProductCard} from '@/lib/types';
import Image from 'next/image';

import {useEffect, useMemo, useRef, useState} from "react";
import {Swiper, SwiperSlide} from "swiper/react";
import type {Swiper as SwiperInstance} from "swiper";

import "swiper/css";

type CollectionTab = CollectionsQuery["collections"]["nodes"][number];

const fallbackTabs: CollectionTab[] = [
  {
    id: "overview",
    title: "Overview",
    handle: "overview",
    description: "",
    image: null,
    products: {
      nodes: [],
    },
  },
  {
    id: "features",
    title: "Features",
    handle: "features",
    description: "",
    image: null,
    products: {
      nodes: [],
    },
  },
  {
    id: "reviews",
    title: "Reviews",
    handle: "reviews",
    description: "",
    image: null,
    products: {
      nodes: [],
    },
  },
];

function shouldShowComparePrice(productId: string) {
  const hash = Array.from(productId).reduce(
    (total, char) => total + char.charCodeAt(0),
    0,
  );

  return hash % 2 === 0;
}

export default function SwipeTabs({
  allProducts,
  collections,
}: {
  allProducts: ProductCard[];
  collections: CollectionTab[];
}) {
  const swiperRef = useRef<SwiperInstance | null>(null);
  const tabsNavRef = useRef<HTMLDivElement | null>(null);
  const tabButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const tabs = useMemo(
    () => (collections.length > 0 ? collections : fallbackTabs),
    [collections],
  );

  useEffect(() => {
    const activeButton = tabButtonRefs.current[activeIndex];
    const tabsNav = tabsNavRef.current;

    if (!activeButton || !tabsNav) {
      return;
    }

    const buttonCenter = activeButton.offsetLeft + activeButton.offsetWidth / 2;
    const navCenter = tabsNav.clientWidth / 2;

    tabsNav.scrollTo({
      left: buttonCenter - navCenter,
      behavior: "smooth",
    });
  }, [activeIndex]);

  const handleMenuClick = (index: number) => {
    setActiveIndex(index);
    swiperRef.current?.slideTo(index);
  };

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-4xl flex-col">
      {/* Synchronized menu */}
      <div className="sticky top-0 z-20 bg-white">
        <div
          ref={tabsNavRef}
          className="flex overflow-x-auto border-b border-gray-200 scrollbar-none"
        >
          <button
            type="button"
            onClick={() => handleMenuClick(0)}
            className={[
                "relative shrink-0 px-5 py-3 text-sm font-semibold transition",
                activeIndex === 0
                ? "text-[var(--color-primary)]"
                : "text-gray-500 hover:text-gray-800",
            ].join(" ")}
            >
              All
              {activeIndex === 0 && (
                  <span className="absolute inset-x-0 bottom-1 h-0.5 bg-[var(--color-primary)] w-1/2 mx-auto max-w-[24px]" />
              )}
          </button>
            {tabs.map((tab, i) => {
                const index = i + 1; // Offset by 1 for the "All" tab
                const isActive = activeIndex === index;

                return (
                    <button
                    key={tab.id}
                    ref={(button) => {
                      tabButtonRefs.current[index] = button;
                    }}
                    type="button"
                    onClick={() => handleMenuClick(index)}
                    className={[
                        "relative shrink-0 px-5 py-3 text-sm font-semibold transition",
                        isActive
                        ? "text-[var(--color-primary)]"
                        : "text-gray-500 hover:text-gray-800",
                    ].join(" ")}
                    >
                    {tab.title}

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

          <SwiperSlide className="min-h-0">
            <div className="h-full min-h-0 overflow-y-auto overscroll-contain p-2">
              {allProducts.length > 0 ? (
                <section className="columns-2 gap-4 md:columns-4 pb-26">
                    {allProducts.map((product: ProductCard) => {
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
              ) : (
                <p className="px-3 py-8 text-center text-sm text-gray-500">
                  No products found in this collection.
                </p>
              )}
            </div>
          </SwiperSlide>

        {tabs.map((tab) => {
          const products = tab.products.nodes;

          return (
          <SwiperSlide key={tab.id} className="min-h-0">
            <div className="h-full min-h-0 overflow-y-auto overscroll-contain p-2">
              {products.length > 0 ? (
                <section className="columns-2 gap-4 md:columns-4 pb-26">
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
                                    {new Intl.NumberFormat('en-PH', {
                                      style: 'currency',
                                      currency: 'USD',
                                    }).format(Number(product.priceRange.maxVariantPrice.amount))}
                                </span>
                            )}
                            <span className="text-sm text-[var(--color-primary)] font-semibold" >
                              {new Intl.NumberFormat('en-PH', {
                                style: 'currency',
                                currency: 'USD',
                              }).format(Number(product.priceRange.minVariantPrice.amount))}
                            </span>
                        </div>
                    </a>
                      );
                    })}
                </section>
              ) : (
                <p className="px-3 py-8 text-center text-sm text-gray-500">
                  No products found in this collection.
                </p>
              )}
            </div>
          </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}

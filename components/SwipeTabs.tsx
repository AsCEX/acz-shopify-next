"use client";
import type {CollectionsQuery, ProductCard} from '@/lib/types';
import Image from 'next/image';

import {useEffect, useMemo, useRef, useState, useSyncExternalStore} from "react";
import {createPortal} from "react-dom";
import {Swiper, SwiperSlide} from "swiper/react";
import type {Swiper as SwiperInstance} from "swiper";
import {Autoplay, Pagination} from "swiper/modules";
import clsx from 'clsx';

import "swiper/css";
import "swiper/css/pagination";

type CollectionTab = CollectionsQuery["collections"]["nodes"][number];

const subscribeToClient = () => () => {};

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
    collectionSlider: null,
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
    collectionSlider: null,
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
    collectionSlider: null,
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
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const isClient = useSyncExternalStore(
    subscribeToClient,
    () => true,
    () => false,
  );

  const tabs = useMemo(
    () => (collections.length > 0 ? collections : fallbackTabs),
    [collections],
  );

  const bannerSlides = useMemo(() => {
    const activeCollection = collections[activeIndex - 1];

    if (!activeCollection) {
      return [];
    }

    return (activeCollection.collectionSlider?.references.nodes ?? []).flatMap(
      (slider) => {
        const image = slider.imageField?.reference?.image;

        return image
          ? [{
              id: slider.id,
              title: activeCollection.title,
              tabIndex: activeIndex,
              textColor: slider.textColor?.value || '#c1c1d1',
              activeTextColor: slider.activeTextColor?.value || '#14b8a6',
              backgroundColor: slider.backgroundColor?.value || '#0f172a',
              image,
            }]
          : [];
      },
    );
  }, [activeIndex, collections]);

  const bannerBackgroundColor =
    bannerSlides[activeBannerIndex]?.backgroundColor ?? '#14b8a6';


  const textColor =
    bannerSlides[activeBannerIndex]?.textColor ?? '#c1c1c1';
  const activeTextColor =
    bannerSlides[activeBannerIndex]?.activeTextColor ?? '#14b8a6';

  const headerOverlayTarget = isClient
    ? document.getElementById('header-overlay-portal')
    : null;

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
    setActiveBannerIndex(0);
    swiperRef.current?.slideTo(index);
  };

  return (
    <>
      {headerOverlayTarget && bannerSlides.length > 0
        ? createPortal(
            <div
              className="h-full w-full transition-colors duration-300"
              style={{backgroundColor: bannerBackgroundColor}}
            />,
            headerOverlayTarget,
          )
        : null}
      <div className="mx-auto flex h-full min-h-0 w-full flex-col">

        {/* Synchronized menu */}
        <div className="sticky top-0 z-20">
          <div
            ref={tabsNavRef}
            className="flex overflow-x-auto xborder-b xborder-gray-200 scrollbar-none"
          >
            <button
              type="button"
              onClick={() => handleMenuClick(0)}
              className={[
                  "relative shrink-0 px-5 py-1 text-xs font-semibold transition",
                  activeIndex === 0
                  ? "text-white hover:text-gray-800 xtext-[var(--color-primary)]"
                  : "text-white hover:text-gray-800",
              ].join(" ")}
              style={{color: activeIndex === 0 ? activeTextColor: textColor}}
              >
                All
                {activeIndex === 0 && (
                    <span 
                      className="absolute inset-x-0 bottom-1 h-0.5 bg-[var(--color-primary)] w-1/2 mx-auto max-w-[24px]"
                      style={{color: activeIndex === 0 ? activeTextColor: textColor}}
                    />
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
                          "relative shrink-0 px-3 py-2 text-xs font-semibold transition",
                          isActive
                          ? "text-white hover:text-gray-800 xtext-[var(--color-primary)]"
                          : "text-white hover:text-gray-800",
                      ].join(" ")}
                      style={{color: !isActive ? textColor: activeTextColor}}
                      >
                      {tab.title}

                      {isActive && (
                          <span 
                          className="absolute inset-x-0 bottom-1 h-0.5 xbg-[var(--color-primary)] w-1/2 mx-auto max-w-[24px]" 
                          style={{background: !isActive ? textColor: activeTextColor}}
                          />
                      )}
                      </button>
                  );
              })}
          </div>
        </div>

        {/* Swipeable content */}
        <Swiper
          className={clsx(
            "min-h-0 w-full flex-1 !pt-2",
            bannerSlides.length > 0 && ""
          )}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.activeIndex);
            setActiveBannerIndex(0);
          }}
          slidesPerView={1}
          spaceBetween={24}
        >

            <SwiperSlide className="min-h-0">
              <div className="h-full min-h-0 overflow-y-auto overscroll-contain">

              <div className={clsx(
                "top-0 flex items-end w-full h-[160px] transition-colors duration-300",
                bannerSlides.length === 0 && ' hidden'
                )}
                style={{backgroundColor: bannerBackgroundColor}}
              >
                <div className="slider h-[164px] w-full overflow-hidden bg-slate-900">
                  {bannerSlides.length > 0 ? (
                    <Swiper
                      key={`banner-${activeIndex}`}
                      className="h-full w-full [&_.swiper-pagination-bullet]:!bg-white [&_.swiper-pagination-bullet-active]:!bg-white"
                      modules={[Autoplay, Pagination]}
                      autoplay={{delay: 4000, disableOnInteraction: false}}
                      pagination={{clickable: true}}
                      loop={bannerSlides.length > 1}
                      nested
                      onSlideChange={(swiper) => setActiveBannerIndex(swiper.realIndex)}
                      aria-label="Featured collections"
                    >
                      {bannerSlides.map((slide, index) => {
                        const content = (
                          <>
                            <Image
                              src={slide.image.url}
                              alt={slide.image.altText || slide.title}
                              fill
                              priority={index === 0}
                              sizes="100vw"
                              className="object-cover"
                            />
                            <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                          </>
                        );

                        return (
                          <SwiperSlide
                            key={slide.id}
                            style={{backgroundColor: slide.backgroundColor}}
                          >
                            <button
                              type="button"
                              onClick={() => handleMenuClick(slide.tabIndex)}
                              className="relative block h-full w-full text-left"
                              aria-label={`View ${slide.title} collection`}
                            >
                              {content}
                            </button>
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-white/70">
                      Featured products
                    </div>
                  )}
                </div>
              </div>
                {allProducts.length > 0 ? (
                  <section className="columns-2 gap-4 md:columns-4 p-2 pb-26">
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
              <div className="h-full min-h-0 overflow-y-auto overscroll-contain">

                <div className={clsx(
                  "top-0 flex items-end w-full h-[160px] transition-colors duration-300",
                  bannerSlides.length === 0 && ' hidden'
                  )}
                  style={{backgroundColor: bannerBackgroundColor}}
                >
                  <div className="slider h-[164px] w-full overflow-hidden bg-slate-900">
                    {bannerSlides.length > 0 ? (
                      <Swiper
                        key={`banner-${activeIndex}`}
                        className="h-full w-full [&_.swiper-pagination-bullet]:!bg-white [&_.swiper-pagination-bullet-active]:!bg-white"
                        modules={[Autoplay, Pagination]}
                        autoplay={{delay: 4000, disableOnInteraction: false}}
                        pagination={{clickable: true}}
                        loop={bannerSlides.length > 1}
                        nested
                        onSlideChange={(swiper) => setActiveBannerIndex(swiper.realIndex)}
                        aria-label="Featured collections"
                      >
                        {bannerSlides.map((slide, index) => {
                          const content = (
                            <>
                              <Image
                                src={slide.image.url}
                                alt={slide.image.altText || slide.title}
                                fill
                                priority={index === 0}
                                sizes="100vw"
                                className="object-cover"
                              />
                              <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                            </>
                          );

                          return (
                            <SwiperSlide
                              key={slide.id}
                              style={{backgroundColor: slide.backgroundColor}}
                            >
                              <button
                                type="button"
                                onClick={() => handleMenuClick(slide.tabIndex)}
                                className="relative block h-full w-full text-left"
                                aria-label={`View ${slide.title} collection`}
                              >
                                {content}
                              </button>
                            </SwiperSlide>
                          );
                        })}
                      </Swiper>
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-white/70">
                        Featured products
                      </div>
                    )}
                  </div>
                </div>

                {products.length > 0 ? (
                  <section className="columns-2 gap-4 md:columns-4 p-2 pb-26">
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
                                      {new Intl.NumberFormat('en-US', {
                                        style: 'currency',
                                        currency: product.priceRange.maxVariantPrice.currencyCode,
                                      }).format(Number(product.priceRange.maxVariantPrice.amount))}
                                  </span>
                              )}
                              <span className="text-sm text-[var(--color-primary)] font-semibold" >
                                {new Intl.NumberFormat('en-US', {
                                  style: 'currency',
                                  currency: product.priceRange.minVariantPrice.currencyCode,
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
    </>
  );
}

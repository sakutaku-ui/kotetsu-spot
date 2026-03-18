'use client'

import { useState, useCallback, useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'

type ImageSliderProps = {
  images: string[]
  alt: string
}

export function ImageSlider({ images, alt }: ImageSliderProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel()
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  })

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return
      emblaMainApi.scrollTo(index)
    },
    [emblaMainApi, emblaThumbsApi]
  )

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return
    setSelectedIndex(emblaMainApi.selectedScrollSnap())
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap())
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex])

  useEffect(() => {
    if (!emblaMainApi) return
    onSelect()
    emblaMainApi.on('select', onSelect)
    emblaMainApi.on('reInit', onSelect)
  }, [emblaMainApi, onSelect])

  return (
    <div className="space-y-4">
      {/* メインスライダー */}
      <div className="overflow-hidden rounded-2xl" ref={emblaMainRef}>
        <div className="flex">
          {images.map((image, index) => (
            <div key={index} className="relative flex-[0_0_100%] aspect-video md:aspect-[21/9]">
              <Image
                src={image}
                alt={`${alt} - 画像${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {/* サムネイル */}
      {images.length > 1 && (
        <div className="overflow-hidden" ref={emblaThumbsRef}>
          <div className="flex gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => onThumbClick(index)}
                className={`relative flex-[0_0_80px] h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  index === selectedIndex
                    ? 'border-blue-600 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Image
                  src={image}
                  alt={`サムネイル${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
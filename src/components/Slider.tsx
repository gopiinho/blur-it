'use client'
import { useEditorStore } from '@/state/editorState'
import { useRef, useEffect } from 'react'
import { FaMinus } from 'react-icons/fa'
import { FaPlus } from 'react-icons/fa'

interface SliderProps {
  min?: number
  max?: number
}

export default function Slider({ min = 1, max = 100 }: SliderProps) {
  const { blurBrushSize, setBlurBrushSize } = useEditorStore()
  const widthPercent = blurBrushSize ? `${blurBrushSize}%` : '0%'
  const sliderRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)

  const setClampedValue = (value: number) => {
    const clampedValue = Math.min(Math.max(value, min), max)
    setBlurBrushSize(clampedValue)
  }

  const updateSliderValue = (clientX: number) => {
    if (!sliderRef.current) return

    const rect = sliderRef.current.getBoundingClientRect()
    const relativeX = clientX - rect.left

    let percentage
    if (relativeX <= 0) percentage = min
    else if (relativeX >= rect.width) percentage = max
    else percentage = min + (relativeX / rect.width) * (max - min)

    setClampedValue(Math.round(percentage))
  }

  const handleSliderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    updateSliderValue(e.clientX)
  }

  const handleMouseDown = () => {
    isDraggingRef.current = true
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return
    updateSliderValue(e.clientX)
  }

  useEffect(() => {
    const handleMouseUp = () => {
      isDraggingRef.current = false
    }

    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setClampedValue(blurBrushSize - 1)}
        className="bg-primary hover:bg-primary/80 text-foreground border-border flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border duration-300"
      >
        <FaMinus size={10} />
      </button>
      <div
        ref={sliderRef}
        className="bg-background border-border relative z-10 h-8 w-60 cursor-pointer overflow-hidden rounded-xl border select-none"
        onClick={handleSliderClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      >
        <span className="text-foreground absolute inset-0 z-20 flex items-center justify-start gap-2 px-4 font-medium">
          Size <span className="font-bold">{blurBrushSize}</span>
        </span>
        <div
          className="bg-primary border-border absolute top-0 left-0 h-full border-r"
          style={{ width: widthPercent }}
        ></div>
      </div>
      <button
        onClick={() => setClampedValue(blurBrushSize + 1)}
        className="bg-primary hover:bg-primary/80 text-foreground border-border flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border duration-300"
      >
        <FaPlus size={10} />
      </button>
    </div>
  )
}

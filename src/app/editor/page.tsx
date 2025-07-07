'use client'
import { useEffect, useRef } from 'react'
import Toolkit from '@/components/Toolkit'
import { useEditorStore } from '@/state/editorState'

export default function Editor() {
  const { image } = useEditorStore()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const tempCanvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!image || !canvasRef.current || !tempCanvasRef.current) return

    const canvas = canvasRef.current
    const tempCanvas = tempCanvasRef.current

    const ctx = canvas.getContext('2d')
    const tempCtx = tempCanvas.getContext('2d')
    if (!ctx || !tempCtx) return

    contextRef.current = ctx

    // Use natural dimensions for accuracy
    const imgWidth = image.naturalWidth
    const imgHeight = image.naturalHeight

    // Set canvas size
    canvas.width = imgWidth
    canvas.height = imgHeight

    // Display scaling (e.g. max 800x600)
    const maxWidth = 800
    const maxHeight = 600
    const scale = Math.min(maxWidth / imgWidth, maxHeight / imgHeight, 1)

    canvas.style.width = `${imgWidth * scale}px`
    canvas.style.height = `${imgHeight * scale}px`

    // Draw the image on main canvas
    ctx.drawImage(image, 0, 0)

    // Set up temp canvas (off-screen)
    tempCanvas.width = imgWidth
    tempCanvas.height = imgHeight
    tempCtx.drawImage(image, 0, 0)
  }, [image])

  return (
    <div className="flex h-screen w-full flex-col justify-between">
      <span />
      <Toolkit />
      <canvas ref={canvasRef} className="mx-auto border shadow-md" />
      <canvas ref={tempCanvasRef} className="hidden" />
      <span />
    </div>
  )
}

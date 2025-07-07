'use client'
import { useRef, useState, useEffect } from 'react'

export function ImageEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [brushSize, setBrushSize] = useState(20)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const tempCanvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    // Create temporary canvas for blur operations
    const tempCanvas = document.createElement('canvas')
    tempCanvasRef.current = tempCanvas

    contextRef.current = context
  }, [])

  useEffect(() => {
    if (!image || !canvasRef.current || !contextRef.current) return

    const canvas = canvasRef.current
    canvas.width = image.width
    canvas.height = image.height

    // Set display size (responsive)
    const maxWidth = 800
    const maxHeight = 600
    const scale = Math.min(maxWidth / image.width, maxHeight / image.height, 1)
    canvas.style.width = `${image.width * scale}px`
    canvas.style.height = `${image.height * scale}px`

    contextRef.current.drawImage(image, 0, 0)

    // Set up temp canvas
    const tempCanvas = tempCanvasRef.current!
    tempCanvas.width = image.width
    tempCanvas.height = image.height
  }, [image])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const img = new Image()
    img.onload = () => {
      setImage(img)
    }
    img.src = URL.createObjectURL(file)
  }

  const applyGaussianBlur = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number
  ) => {
    const tempCanvas = tempCanvasRef.current!
    const tempCtx = tempCanvas.getContext('2d')!

    // Copy the region to blur
    const blurSize = radius * 2
    tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height)
    tempCtx.drawImage(
      canvasRef.current!,
      x - blurSize,
      y - blurSize,
      blurSize * 2,
      blurSize * 2,
      0,
      0,
      blurSize * 2,
      blurSize * 2
    )

    // Apply stronger Gaussian blur
    tempCtx.filter = `blur(${radius * 0.5}px)`
    tempCtx.drawImage(tempCanvas, 0, 0)
    tempCtx.drawImage(tempCanvas, 0, 0) // Apply twice for stronger effect

    // Reset the main context's filter
    ctx.filter = 'none'

    // Draw the blurred region back
    ctx.drawImage(
      tempCanvas,
      0,
      0,
      blurSize * 2,
      blurSize * 2,
      x - blurSize,
      y - blurSize,
      blurSize * 2,
      blurSize * 2
    )
  }

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY
    return { x, y }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!contextRef.current) return
    setIsDrawing(true)
    const { x, y } = getCanvasCoordinates(e)
    applyGaussianBlur(contextRef.current, x, y, brushSize)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current) return
    const { x, y } = getCanvasCoordinates(e)
    applyGaussianBlur(contextRef.current, x, y, brushSize)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const handleSave = async () => {
    if (!canvasRef.current) return

    try {
      const blob = await new Promise<Blob>((resolve) =>
        canvasRef.current!.toBlob((blob) => resolve(blob!), 'image/png', 1.0)
      )
    } catch (error) {
      console.error(error)
    }
  }

  const handleDownload = () => {
    if (!canvasRef.current) return

    // Create a temporary link element
    const link = document.createElement('a')
    link.download = 'edited-image.jpg'

    // Convert canvas to data URL
    const dataUrl = canvasRef.current.toDataURL('image/jpg')
    link.href = dataUrl

    // Trigger download
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="file:mr-4 file:rounded-full file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
        />
        <input
          type="range"
          min="5"
          max="50"
          value={brushSize}
          onChange={(e) => setBrushSize(parseInt(e.target.value))}
          className="w-32"
        />
        <span className="text-sm text-gray-600">Blur: {brushSize}px</span>
        <div className="ml-auto flex gap-2">
          <button
            onClick={handleDownload}
            disabled={!image}
            className="text-background rounded-lg bg-green-600 px-4 py-2 hover:bg-green-700 disabled:opacity-50"
          >
            Download
          </button>
          <button
            onClick={handleSave}
            disabled={!image}
            className="text-background rounded-lg bg-indigo-600 px-4 py-2 hover:bg-indigo-700 disabled:opacity-50"
          >
            Save to Cloud
          </button>
        </div>
      </div>
      <div className="inline-block overflow-hidden rounded-lg border">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="max-w-full cursor-crosshair"
          style={{ touchAction: 'none' }}
        />
      </div>
    </div>
  )
}

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type EditorStore = {
  image: HTMLImageElement | null
  setImage: (image: HTMLImageElement | null) => void
  blurBrushSize: number
  setBlurBrushSize: (size: number) => void
}

export const useEditorStore = create<EditorStore>()(
  persist(
    (set) => ({
      image: null,
      setImage: (image) => set({ image }),
      blurBrushSize: 10,
      setBlurBrushSize: (size) => set({ blurBrushSize: size }),
    }),
    {
      name: 'editor-settings',
      partialize: (state) => ({ blurBrushSize: state.blurBrushSize }),
    }
  )
)

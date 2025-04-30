import Slider from './Slider'

export default function Toolkit() {
  return (
    <div className="bg-primary/20 border-border absolute left-1/2 z-50 m-3 h-16 -translate-x-1/2 rounded-3xl border px-6">
      <div className="flex h-full items-center justify-center gap-4">
        <Slider />
      </div>
    </div>
  )
}

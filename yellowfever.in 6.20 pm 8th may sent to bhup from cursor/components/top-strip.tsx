import { Phone } from "lucide-react"

export function TopStrip() {
  return (
    <div className="w-full bg-yellow-500 py-1 px-4 text-black">
      <div className="container mx-auto flex items-center justify-end text-sm">
        <div className="flex items-center">
          <Phone className="mr-1 h-3 w-3" />
          <span>Contact us: +91 9823555053</span>
        </div>
      </div>
    </div>
  )
}

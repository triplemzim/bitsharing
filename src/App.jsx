import { useState } from "react"
import { Button } from "@/components/ui/button"


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="w-full mt-4 flex justify-items-center justify-center">
        <div className="self-center space-y-4">
        <h2 className="p-4 text-3xl font-bold rounded-lg bg-slate-400">
          Count: {count}
        </h2>
        <Button onClick={() => setCount(count + 1)}>Click me</Button>
        </div>
      </div>
    </>
  )
}

export default App

"use client"

import { useState } from "react"
import { SearchIcon, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Mock data for search results
const mockData = [
  { id: 1, title: "How to build a Next.js app", category: "Tutorial" },
  { id: 2, title: "Introduction to React hooks", category: "Article" },
  { id: 3, title: "Styling with Tailwind CSS", category: "Guide" },
  { id: 4, title: "Server components in Next.js", category: "Documentation" },
  { id: 5, title: "Building accessible web applications", category: "Best Practices" },
  { id: 6, title: "State management in React", category: "Tutorial" },
  { id: 7, title: "API routes with Next.js", category: "Guide" },
  { id: 8, title: "Optimizing performance in React", category: "Best Practices" },
]

export default function SearchComponent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<typeof mockData>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsSearching(true)

    // Simulate API call with setTimeout
    setTimeout(() => {
      const filteredResults = mockData.filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
      setResults(filteredResults)
      setIsSearching(false)
    }, 500)
  }

  const clearSearch = () => {
    setSearchQuery("")
    setResults([])
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="flex flex-col space-y-4">
        <div className="relative">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>
          <Button onClick={handleSearch} className="mt-2 w-full sm:mt-0 sm:ml-2 sm:w-auto">
            Search
          </Button>
        </div>

        {isSearching && (
          <div className="text-center py-8">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
            <p className="mt-2 text-sm text-muted-foreground">Searching...</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Search Results ({results.length})</h2>
            <div className="space-y-2">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm hover:bg-accent/50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{result.title}</h3>
                    <span className="text-xs bg-muted px-2 py-1 rounded-full">{result.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {searchQuery && results.length === 0 && !isSearching && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  )
}

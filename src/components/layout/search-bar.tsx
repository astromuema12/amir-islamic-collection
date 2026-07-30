"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, X, Loader2, Clock, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchSuggestion {
  text: string
  type: "trending" | "recent" | "product"
}

interface SearchBarProps {
  className?: string
  placeholder?: string
  onSearch?: (query: string) => void
}

const TRENDING_SEARCHES: SearchSuggestion[] = [
  { text: "Prayer Mats", type: "trending" },
  { text: "Holy Qur'an", type: "trending" },
  { text: "Tasbih", type: "trending" },
  { text: "Abayas", type: "trending" },
  { text: "Perfumes", type: "trending" },
]

export function SearchBar({
  className,
  placeholder = "Search products...",
  onSearch,
}: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<SearchSuggestion[]>([])
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const stored = localStorage.getItem("recentSearches")
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as string[]
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRecentSearches(
          parsed.map((text) => ({ text, type: "recent" as const }))
        )
      } catch {
        /* empty */
      }
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const saveRecentSearch = useCallback((text: string) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter(
        (s) => s.text.toLowerCase() !== text.toLowerCase()
      )
      const updated = [{ text, type: "recent" as const }, ...filtered].slice(
        0, 5
      )
      localStorage.setItem(
        "recentSearches",
        JSON.stringify(updated.map((s) => s.text))
      )
      return updated
    })
  }, [])

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([])
    localStorage.removeItem("recentSearches")
  }, [])

  const handleSearch = useCallback(
    (searchQuery: string) => {
      const trimmed = searchQuery.trim()
      if (!trimmed) return
      saveRecentSearch(trimmed)
      setIsOpen(false)
      setQuery("")
      inputRef.current?.blur()
      if (onSearch) {
        onSearch(trimmed)
      } else {
        router.push(`/products?q=${encodeURIComponent(trimmed)}`)
      }
    },
    [onSearch, router, saveRecentSearch]
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(query)
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text)
    handleSearch(suggestion.text)
  }

  const clearQuery = () => {
    setQuery("")
    inputRef.current?.focus()
  }

  const showDropdown = isOpen && (query.length > 0 || recentSearches.length > 0 || TRENDING_SEARCHES.length > 0)

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
            if (e.target.value.length > 2) {
              setIsLoading(true)
              setTimeout(() => setIsLoading(false), 300)
            }
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="pl-10 pr-10 h-10 bg-background/80 backdrop-blur-sm"
          aria-label="Search products"
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
        />
        {query && (
          <button
            type="button"
            onClick={clearQuery}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {showDropdown && (
        <div className="absolute top-full mt-2 w-full rounded-xl border bg-popover p-2 shadow-lg backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : query ? (
            <div>
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                Suggestions
              </div>
              <button
                type="button"
                role="option"
                  aria-selected={false}
                  onClick={() => handleSearch(query)}
                  className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm hover:bg-accent transition-colors"
                >
                  <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>
                    Search for &quot;<strong>{query}</strong>&quot;
                  </span>
              </button>
            </div>
          ) : (
            <>
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between px-2 py-1.5">
                    <span className="text-xs font-medium text-muted-foreground">
                      Recent
                    </span>
                    <button
                      type="button"
                      onClick={clearRecentSearches}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  {recentSearches.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        role="option"
                        aria-selected={false}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm hover:bg-accent transition-colors"
                      >
                        <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span>{suggestion.text}</span>
                      </button>
                  ))}
                </div>
              )}
              {TRENDING_SEARCHES.length > 0 && (
                <div>
                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                    Trending
                  </div>
                  {TRENDING_SEARCHES.map((suggestion, index) => (
                    <button
                        key={index}
                        type="button"
                        role="option"
                        aria-selected={false}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm hover:bg-accent transition-colors"
                      >
                        <TrendingUp className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span>{suggestion.text}</span>
                      </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

type Theme = 'light' | 'dark' | 'system'
type ResolvedTheme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  setTheme: (value: Theme) => void
  resolvedTheme: ResolvedTheme | undefined
}

const ThemeContext = createContext<ThemeContextValue | null>(null)
const STORAGE_KEY = 'theme'

export const themeInitScript = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}');var r=(t==='light'||t==='dark')?t:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');var e=document.documentElement;e.classList.remove('light','dark');e.classList.add(r);e.style.colorScheme=r;}catch(_){}})();`

function readSystemTheme(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyClass(resolved: ResolvedTheme) {
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(resolved)
  root.style.colorScheme = resolved
}

function readInitialTheme(fallback: Theme): Theme {
  if (typeof window === 'undefined') return fallback
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  } catch {
    // ignore storage errors
  }
  return fallback
}

function readInitialResolved(): ResolvedTheme | undefined {
  if (typeof document === 'undefined') return undefined
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: Theme
}

export function ThemeProvider({ children, defaultTheme = 'system' }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => readInitialTheme(defaultTheme))
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme | undefined>(readInitialResolved)

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    function resolve() {
      const next = theme === 'system' ? readSystemTheme() : theme
      setResolvedTheme(next)
      applyClass(next)
    }
    resolve()
    media.addEventListener('change', resolve)
    return () => media.removeEventListener('change', resolve)
  }, [theme])

  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key !== STORAGE_KEY) return
      const next = (event.newValue as Theme | null) ?? defaultTheme
      setThemeState(next)
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [defaultTheme])

  const setTheme = useCallback((value: Theme) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, value)
    } catch {
      // ignore storage errors (private mode, quota, etc.)
    }
    setThemeState(value)
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, resolvedTheme }),
    [theme, setTheme, resolvedTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

const DEFAULT_CONTEXT: ThemeContextValue = {
  theme: 'system',
  setTheme: () => {},
  resolvedTheme: undefined,
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext) ?? DEFAULT_CONTEXT
}

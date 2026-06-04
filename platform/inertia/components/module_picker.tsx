import { useEffect, useMemo, useState } from 'react'
import { useI18n } from '~/hooks/use_i18n'

export type ModuleCatalogEntry = {
  key: string
  name: string
  description: string
  source: 'curated' | 'debian'
  installType: string
  packageRef: string
  tags?: string[]
}

type Props = {
  name?: string
  defaultSelected?: ModuleCatalogEntry[]
}

export default function ModulePicker({ name = 'moduleKeys', defaultSelected = [] }: Props) {
  const { t } = useI18n()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<ModuleCatalogEntry[]>(defaultSelected)
  const [curated, setCurated] = useState<ModuleCatalogEntry[]>([])
  const [debian, setDebian] = useState<ModuleCatalogEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedKeys = useMemo(() => new Set(selected.map((item) => item.key)), [selected])

  useEffect(() => {
    fetch('/modules/curated')
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: { curated: ModuleCatalogEntry[] }) => setCurated(data.curated))
      .catch(() => setError(t('messages.modules.searchError')))
  }, [t])

  useEffect(() => {
    if (query.trim().length < 2) {
      setDebian([])
      setLoading(false)
      return
    }

    const controller = new AbortController()
    const timer = setTimeout(async () => {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(`/modules/search?q=${encodeURIComponent(query.trim())}`, {
          signal: controller.signal,
        })

        if (!res.ok) {
          throw new Error('search failed')
        }

        const data = (await res.json()) as {
          curated: ModuleCatalogEntry[]
          debian: ModuleCatalogEntry[]
        }

        setCurated(data.curated)
        setDebian(data.debian)
      } catch (fetchError) {
        if (fetchError instanceof DOMException && fetchError.name === 'AbortError') {
          return
        }
        setError(t('messages.modules.searchError'))
      } finally {
        setLoading(false)
      }
    }, 350)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query, t])

  function addModule(module: ModuleCatalogEntry) {
    if (selectedKeys.has(module.key)) {
      return
    }
    setSelected((current) => [...current, module])
  }

  function removeModule(moduleKey: string) {
    setSelected((current) => current.filter((item) => item.key !== moduleKey))
  }

  const visibleCurated =
    query.trim().length >= 2
      ? curated.filter((item) => !selectedKeys.has(item.key))
      : curated.filter((item) => !selectedKeys.has(item.key))

  const visibleDebian = debian.filter((item) => !selectedKeys.has(item.key))

  return (
    <fieldset className="module-picker">
      <legend>{t('messages.modules.title')}</legend>
      <p className="muted small">{t('messages.modules.createHint')}</p>

      {selected.length > 0 && (
        <div className="module-selected">
          {selected.map((module) => (
            <span key={module.key} className="module-chip">
              <span>{module.name}</span>
              <button type="button" onClick={() => removeModule(module.key)} aria-label="Remove">
                ×
              </button>
              <input type="hidden" name={`${name}[]`} value={module.key} />
            </span>
          ))}
        </div>
      )}

      <label className="module-search-label">
        {t('messages.modules.searchLabel')}
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('messages.modules.searchPlaceholder')}
          autoComplete="off"
        />
      </label>

      {loading && <p className="muted small">{t('messages.common.loading')}</p>}
      {error && <p className="text-error small">{error}</p>}

      {query.trim().length < 2 && visibleCurated.length > 0 && (
        <div className="module-results">
          <h3>{t('messages.modules.curatedTitle')}</h3>
          <ul className="module-list">
            {visibleCurated.map((module) => (
              <li key={module.key}>
                <button type="button" className="module-result" onClick={() => addModule(module)}>
                  <strong>{module.name}</strong>
                  <span className="muted">{module.description}</span>
                  <span className="module-badge">{t('messages.modules.sourceCurated')}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {query.trim().length >= 2 && (
        <div className="module-results">
          {visibleCurated.length > 0 && (
            <>
              <h3>{t('messages.modules.curatedTitle')}</h3>
              <ul className="module-list">
                {visibleCurated.map((module) => (
                  <li key={module.key}>
                    <button type="button" className="module-result" onClick={() => addModule(module)}>
                      <strong>{module.name}</strong>
                      <span className="muted">{module.description}</span>
                      <span className="module-badge">{t('messages.modules.sourceCurated')}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {visibleDebian.length > 0 && (
            <>
              <h3>{t('messages.modules.debianTitle')}</h3>
              <ul className="module-list">
                {visibleDebian.map((module) => (
                  <li key={module.key}>
                    <button type="button" className="module-result" onClick={() => addModule(module)}>
                      <strong>{module.name}</strong>
                      <span className="muted">{module.description || module.packageRef}</span>
                      <span className="module-badge">{t('messages.modules.sourceDebian')}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {!loading && visibleCurated.length === 0 && visibleDebian.length === 0 && (
            <p className="muted small">{t('messages.modules.noResults')}</p>
          )}
        </div>
      )}
    </fieldset>
  )
}

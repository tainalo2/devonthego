import {
  curatedModules,
  findCuratedByPackageRef,
  findCuratedModule,
  type CuratedModule,
} from '#config/modules'
import DockerService, { type DebianPackageHit } from '#services/docker_service'

export type ModuleCatalogEntry = {
  key: string
  name: string
  description: string
  source: 'curated' | 'debian'
  installType: 'apt' | 'script' | 'npm'
  packageRef: string
  tags?: string[]
}

export type ModuleSearchResult = {
  curated: ModuleCatalogEntry[]
  debian: ModuleCatalogEntry[]
}

export type ResolvedModule = {
  key: string
  displayName: string
  description: string | null
  source: 'curated' | 'debian'
  installType: 'apt' | 'script' | 'npm'
  packageRef: string
  installScript?: string
  removeScript?: string
}

export default class ModuleCatalogService {
  constructor(protected docker = new DockerService()) {}

  listCurated(): ModuleCatalogEntry[] {
    return curatedModules.map((module) => this.#toCatalogEntry(module))
  }

  async search(query: string, limit = 20): Promise<ModuleSearchResult> {
    const normalized = query.trim().toLowerCase()
    if (normalized.length < 2) {
      return { curated: [], debian: [] }
    }

    const curated = this.listCurated().filter((module) => this.#matchesQuery(module, normalized))

    const curatedPackages = new Set(curated.map((module) => module.packageRef))
    const debianHits = await this.docker.searchDebianPackages(normalized, limit)

    const debian = debianHits
      .filter((hit) => !curatedPackages.has(hit.name) && !findCuratedByPackageRef(hit.name))
      .map((hit) => this.#debianHitToEntry(hit))
      .slice(0, limit)

    return { curated, debian }
  }

  resolveModuleKey(moduleKey: string): ResolvedModule | null {
    const curated = findCuratedModule(moduleKey)
    if (curated) {
      return this.#curatedToResolved(curated)
    }

    if (!moduleKey.startsWith('debian:')) {
      return null
    }

    const packageRef = moduleKey.slice('debian:'.length).trim()
    if (!/^[a-z0-9.+_-]+$/.test(packageRef)) {
      return null
    }

    return {
      key: `debian:${packageRef}`,
      displayName: packageRef,
      description: null,
      source: 'debian',
      installType: 'apt',
      packageRef,
    }
  }

  #matchesQuery(module: ModuleCatalogEntry, query: string): boolean {
    const haystack = [
      module.name,
      module.description,
      module.packageRef,
      ...(module.tags ?? []),
    ]
      .join(' ')
      .toLowerCase()

    return haystack.includes(query)
  }

  #toCatalogEntry(module: CuratedModule): ModuleCatalogEntry {
    return {
      key: module.key,
      name: module.name,
      description: module.description,
      source: 'curated',
      installType: module.installType,
      packageRef: module.packageRef,
      tags: module.tags,
    }
  }

  #curatedToResolved(module: CuratedModule): ResolvedModule {
    return {
      key: module.key,
      displayName: module.name,
      description: module.description,
      source: 'curated',
      installType: module.installType,
      packageRef: module.packageRef,
      installScript: module.installScript,
      removeScript: module.removeScript,
    }
  }

  #debianHitToEntry(hit: DebianPackageHit): ModuleCatalogEntry {
    return {
      key: `debian:${hit.name}`,
      name: hit.name,
      description: hit.description,
      source: 'debian',
      installType: 'apt',
      packageRef: hit.name,
    }
  }
}

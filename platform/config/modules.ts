export type ModuleInstallType = 'apt' | 'script' | 'npm'

export type CuratedModule = {
  key: string
  name: string
  description: string
  installType: ModuleInstallType
  packageRef: string
  installScript?: string
  removeScript?: string
  tags?: string[]
}

export const debianSearchImage = 'debian:bookworm-slim'

export const curatedModules: CuratedModule[] = [
  {
    key: 'curated:vim',
    name: 'Vim',
    description: 'Vi IMproved — powerful terminal text editor',
    installType: 'apt',
    packageRef: 'vim',
    tags: ['editor', 'terminal'],
  },
  {
    key: 'curated:nano',
    name: 'Nano',
    description: 'Simple, user-friendly terminal text editor',
    installType: 'apt',
    packageRef: 'nano',
    tags: ['editor', 'terminal'],
  },
  {
    key: 'curated:htop',
    name: 'htop',
    description: 'Interactive process viewer for the terminal',
    installType: 'apt',
    packageRef: 'htop',
    tags: ['system', 'monitoring'],
  },
  {
    key: 'curated:jq',
    name: 'jq',
    description: 'Lightweight JSON processor for the command line',
    installType: 'apt',
    packageRef: 'jq',
    tags: ['json', 'cli'],
  },
  {
    key: 'curated:tree',
    name: 'tree',
    description: 'Display directories as a tree in the terminal',
    installType: 'apt',
    packageRef: 'tree',
    tags: ['filesystem', 'cli'],
  },
  {
    key: 'curated:ripgrep',
    name: 'ripgrep (rg)',
    description: 'Fast recursive grep — search code and files quickly',
    installType: 'apt',
    packageRef: 'ripgrep',
    tags: ['search', 'cli'],
  },
  {
    key: 'curated:fd-find',
    name: 'fd',
    description: 'Simple, fast alternative to find',
    installType: 'apt',
    packageRef: 'fd-find',
    tags: ['search', 'filesystem'],
  },
  {
    key: 'curated:unzip',
    name: 'unzip',
    description: 'Extract files from ZIP archives',
    installType: 'apt',
    packageRef: 'unzip',
    tags: ['archive', 'cli'],
  },
  {
    key: 'curated:zip',
    name: 'zip',
    description: 'Create ZIP archives from the command line',
    installType: 'apt',
    packageRef: 'zip',
    tags: ['archive', 'cli'],
  },
  {
    key: 'curated:make',
    name: 'make',
    description: 'GNU Make — build automation tool',
    installType: 'apt',
    packageRef: 'make',
    tags: ['build', 'dev'],
  },
  {
    key: 'curated:sqlite3',
    name: 'sqlite3',
    description: 'SQLite command-line interface',
    installType: 'apt',
    packageRef: 'sqlite3',
    tags: ['database', 'cli'],
  },
  {
    key: 'curated:tmux',
    name: 'tmux',
    description: 'Terminal multiplexer — run multiple sessions in one window',
    installType: 'apt',
    packageRef: 'tmux',
    tags: ['terminal', 'productivity'],
  },
]

export function findCuratedModule(key: string): CuratedModule | undefined {
  return curatedModules.find((module) => module.key === key)
}

export function findCuratedByPackageRef(packageRef: string): CuratedModule | undefined {
  return curatedModules.find((module) => module.packageRef === packageRef)
}

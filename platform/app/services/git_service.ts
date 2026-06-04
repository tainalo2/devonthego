import { execFile } from 'node:child_process'
import { access, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

export default class GitService {
  /**
   * Clone un dépôt Git dans le workspace si le répertoire est vide.
   */
  async cloneIntoWorkspace(
    workspacePath: string,
    repoUrl: string,
    branch?: string | null
  ): Promise<{ cloned: boolean; message: string }> {
    await mkdir(workspacePath, { recursive: true })

    const hasContent = await this.directoryHasContent(workspacePath)
    if (hasContent) {
      return { cloned: false, message: 'Workspace déjà initialisé, clone ignoré.' }
    }

    const args = ['clone', '--depth', '1']
    if (branch) {
      args.push('-b', branch)
    }
    args.push(repoUrl, workspacePath)

    await execFileAsync('git', args, { maxBuffer: 10 * 1024 * 1024 })

    return { cloned: true, message: `Dépôt cloné : ${repoUrl}${branch ? ` (${branch})` : ''}` }
  }

  protected async directoryHasContent(dir: string): Promise<boolean> {
    try {
      await access(join(dir, '.git'))
      return true
    } catch {
      // pas de .git — vérifier si d'autres fichiers existent
    }

    try {
      const { stdout } = await execFileAsync('ls', ['-A', dir])
      return stdout.trim().length > 0
    } catch {
      return false
    }
  }
}

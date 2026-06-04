import User from '#models/user'
import ImageTemplate from '#models/image_template'
import env from '#start/env'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const templates = [
      {
        name: 'Base',
        slug: 'base',
        dockerImage: 'devonthego/base:latest',
        description: 'OpenVSCode Server avec outils de base',
        isDefault: true,
        isBuiltin: true,
      },
      {
        name: 'Node.js',
        slug: 'node',
        dockerImage: 'devonthego/custom:node-latest',
        description: 'Node.js 24, pnpm, ESLint, Prettier',
        isDefault: false,
        isBuiltin: true,
      },
      {
        name: 'Python',
        slug: 'python',
        dockerImage: 'devonthego/custom:python-latest',
        description: 'Python 3, Ruff, extension Python',
        isDefault: false,
        isBuiltin: true,
      },
      {
        name: 'PHP',
        slug: 'php',
        dockerImage: 'devonthego/custom:php-latest',
        description: 'PHP 8, Composer, Intelephense',
        isDefault: false,
        isBuiltin: true,
      },
    ]

    for (const template of templates) {
      await ImageTemplate.updateOrCreate({ slug: template.slug }, template)
    }

    const adminEmail = env.get('ADMIN_EMAIL')
    const adminPassword = env.get('ADMIN_PASSWORD')

    if (adminEmail && adminPassword) {
      const existing = await User.findBy('email', adminEmail)
      if (!existing) {
        await User.create({
          email: adminEmail,
          password: adminPassword,
          fullName: env.get('ADMIN_FULL_NAME') ?? 'Administrator',
          role: 'admin',
          isActive: true,
        })
      }
    }
  }
}

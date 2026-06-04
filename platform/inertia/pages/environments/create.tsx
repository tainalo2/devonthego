import AppLayout from '~/layouts/app'
import { Form, Link } from '@adonisjs/inertia/react'
import { useI18n } from '~/hooks/use_i18n'
import ModulePicker from '~/components/module_picker'

type Template = {
  id: number
  name: string
  slug: string
  dockerImage: string
  description: string | null
  isDefault: boolean
  buildStatus: string
}

type UserOption = {
  id: number
  email: string
  fullName: string | null
  role: string
}

type Props = {
  templates: Template[]
  users: UserOption[]
  defaults: { cpuLimit: number; memoryLimitMb: number }
}

export default function EnvironmentsCreate({ templates, users, defaults }: Props) {
  const { t, buildStatusLabel, roleLabel } = useI18n()

  return (
    <AppLayout>
      <div className="page">
        <div className="page-header">
          <h1>{t('messages.environments.createTitle')}</h1>
          <Link route="environments.index">{t('messages.common.back')}</Link>
        </div>

        <section className="card form-card">
          <Form route="environments.store" className="form">
            {({ errors }) => (
              <>
                <label>
                  {t('messages.common.name')}
                  <input type="text" name="name" required />
                  {errors.name && <span className="error">{errors.name}</span>}
                </label>

                <label>
                  {t('messages.environments.form.imageTemplate')}
                  <select name="imageTemplateId" defaultValue={templates.find((tpl) => tpl.isDefault)?.id}>
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                        {template.buildStatus !== 'success' && template.buildStatus !== 'idle'
                          ? ` (${buildStatusLabel(template.buildStatus)})`
                          : ''}
                      </option>
                    ))}
                  </select>
                </label>

                {users.length > 0 && (
                  <>
                    <label>
                      {t('messages.environments.form.owner')}
                      <select name="ownerId" defaultValue="">
                        <option value="">{t('messages.common.myself')}</option>
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.email} ({roleLabel(user.role)})
                          </option>
                        ))}
                      </select>
                    </label>

                    <fieldset className="checkbox-group">
                      <legend>{t('messages.environments.form.assignedUsers')}</legend>
                      {users.map((user) => (
                        <label key={user.id} className="checkbox">
                          <input type="checkbox" name="assignedUserIds[]" value={user.id} />
                          {user.email}
                        </label>
                      ))}
                    </fieldset>
                  </>
                )}

                <div className="form-row">
                  <label>
                    {t('messages.environments.form.cpu')}
                    <input
                      type="number"
                      name="cpuLimit"
                      min={1}
                      max={8}
                      defaultValue={defaults.cpuLimit}
                    />
                  </label>
                  <label>
                    {t('messages.environments.form.ram')}
                    <input
                      type="number"
                      name="memoryLimitMb"
                      min={256}
                      max={16384}
                      defaultValue={defaults.memoryLimitMb}
                    />
                  </label>
                </div>

                <fieldset className="checkbox-group">
                  <legend>{t('messages.environments.form.gitImport')}</legend>
                  <label>
                    {t('messages.environments.form.gitRepoUrl')}
                    <input
                      type="url"
                      name="gitRepoUrl"
                      placeholder="https://github.com/user/my-project.git"
                    />
                    {errors.gitRepoUrl && <span className="error">{errors.gitRepoUrl}</span>}
                  </label>
                  <label>
                    {t('messages.environments.form.gitBranch')}
                    <input type="text" name="gitBranch" placeholder="main" />
                  </label>
                  <p className="muted small">{t('messages.environments.form.gitHint')}</p>
                </fieldset>

                <ModulePicker />

                <button type="submit" className="btn btn-primary">
                  {t('messages.environments.form.submitCreate')}
                </button>
              </>
            )}
          </Form>
        </section>
      </div>
    </AppLayout>
  )
}

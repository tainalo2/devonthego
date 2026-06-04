import AppLayout from '~/layouts/app'
import { Form, Link } from '@adonisjs/inertia/react'
import { useI18n } from '~/hooks/use_i18n'

type Environment = {
  id: number
  name: string
  cpuLimit: number
  memoryLimitMb: number
  gitRepoUrl: string | null
  gitBranch: string | null
  status: string
}

type Props = {
  environment: Environment
}

export default function EnvironmentsEdit({ environment }: Props) {
  const { t, statusLabel } = useI18n()

  return (
    <AppLayout>
      <div className="page">
        <div className="page-header">
          <h1>{t('messages.environments.editTitle', { name: environment.name })}</h1>
          <Link route="environments.show" routeParams={{ id: environment.id }}>
            {t('messages.common.back')}
          </Link>
        </div>

        <section className="card form-card">
          <p className="muted">
            {t('messages.environments.form.currentStatus')}{' '}
            <span className={`badge badge-${environment.status}`}>
              {statusLabel(environment.status)}
            </span>
            {' — '}
            {t('messages.environments.form.recreateHint')}
          </p>

          <Form route="environments.update" routeParams={{ id: environment.id }} className="form">
            {({ errors }) => (
              <>
                <label>
                  {t('messages.common.name')}
                  <input type="text" name="name" defaultValue={environment.name} required />
                  {errors.name && <span className="error">{errors.name}</span>}
                </label>

                <div className="form-row">
                  <label>
                    {t('messages.environments.form.cpu')}
                    <input
                      type="number"
                      name="cpuLimit"
                      min={1}
                      max={8}
                      defaultValue={environment.cpuLimit}
                    />
                  </label>
                  <label>
                    {t('messages.environments.form.ram')}
                    <input
                      type="number"
                      name="memoryLimitMb"
                      min={256}
                      max={16384}
                      defaultValue={environment.memoryLimitMb}
                    />
                  </label>
                </div>

                <label>
                  {t('messages.environments.form.gitRepoOptional')}
                  <input
                    type="url"
                    name="gitRepoUrl"
                    defaultValue={environment.gitRepoUrl ?? ''}
                    placeholder="https://github.com/user/repo.git"
                  />
                </label>

                <label>
                  {t('messages.environments.form.gitBranchLabel')}
                  <input
                    type="text"
                    name="gitBranch"
                    defaultValue={environment.gitBranch ?? ''}
                    placeholder="main"
                  />
                </label>

                <button type="submit" className="btn btn-primary">
                  {t('messages.common.save')}
                </button>
              </>
            )}
          </Form>
        </section>
      </div>
    </AppLayout>
  )
}

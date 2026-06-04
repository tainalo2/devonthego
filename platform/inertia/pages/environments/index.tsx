import AppLayout from '~/layouts/app'
import { Link } from '@adonisjs/inertia/react'

type EnvironmentItem = {
  id: number
  name: string
  slug: string
  status: string
  subdomain: string
  url: string
  owner: { id: number; email: string; fullName: string | null }
  imageTemplate: { id: number; name: string } | null
  cpuLimit: number
  memoryLimitMb: number
  createdAt: string
}

type Props = {
  environments: EnvironmentItem[]
}

export default function EnvironmentsIndex({ environments }: Props) {
  return (
    <AppLayout>
      <div className="page">
        <div className="page-header">
          <h1>Environnements</h1>
          <Link route="environments.create" className="btn btn-primary">
            Nouvel environnement
          </Link>
        </div>

        <section className="card">
          {environments.length === 0 ? (
            <p className="muted">Aucun environnement.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Statut</th>
                  <th>Image</th>
                  <th>Propriétaire</th>
                  <th>Ressources</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {environments.map((env) => (
                  <tr key={env.id}>
                    <td>{env.name}</td>
                    <td>
                      <span className={`badge badge-${env.status}`}>{env.status}</span>
                    </td>
                    <td>{env.imageTemplate?.name ?? 'Custom'}</td>
                    <td>{env.owner.email}</td>
                    <td>
                      {env.cpuLimit} CPU / {env.memoryLimitMb} Mo
                    </td>
                    <td>
                      <Link route="environments.show" routeParams={{ id: env.id }}>
                        Ouvrir
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </AppLayout>
  )
}

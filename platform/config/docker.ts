import env from '#start/env'

const dockerConfig = {
  socketPath: env.get('DOCKER_SOCKET', '/var/run/docker.sock'),
  network: env.get('DOCKER_NETWORK', 'devonthego'),
  registry: env.get('DOCKER_REGISTRY', 'registry:5000'),
  imagePrefix: env.get('ENV_IMAGE_PREFIX', 'devonthego'),
  domain: env.get('DOMAIN', 'localhost'),
  workspacePath: env.get('ENV_WORKSPACE_PATH', '/data/workspaces'),
  defaultCpuLimit: env.get('ENV_CPU_LIMIT', 1),
  defaultMemoryLimit: env.get('ENV_MEMORY_LIMIT', '1024m'),
}

export default dockerConfig

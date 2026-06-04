export default class SlugService {
  static slugify(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48)
  }

  static randomSuffix(length = 6): string {
    return Math.random()
      .toString(36)
      .slice(2, 2 + length)
  }
}

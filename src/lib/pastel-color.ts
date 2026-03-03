import { TimetableCells } from '@/types/timetable'
import { canonicalizeSubjectName } from '@/lib/subject-translation'

export const PASTEL_PALETTE = [
  '#FFDDE4',
  '#FFE7CC',
  '#FFF8C9',
  '#DCF7D8',
  '#D8F2FF',
  '#E3E1FF',
  '#F3DFFF',
  '#FFD9F0',
  '#D9FFE8',
  '#FCE3D3'
]

const hslToHex = (h: number, s: number, l: number): string => {
  const sat = s / 100
  const light = l / 100

  const k = (n: number) => (n + h / 30) % 12
  const a = sat * Math.min(light, 1 - light)
  const f = (n: number) => {
    const color = light - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0')
  }

  return `#${f(0)}${f(8)}${f(4)}`
}

export const createRandomPastelColor = (randomFn: () => number = Math.random): string => {
  const hue = Math.floor(randomFn() * 360)
  const saturation = 65 + Math.floor(randomFn() * 15)
  const lightness = 82 + Math.floor(randomFn() * 10)

  return hslToHex(hue, saturation, lightness)
}

export const pickSubjectColor = (
  existingColors: Record<string, string>,
  randomFn: () => number = Math.random
): string => {
  const used = new Set(Object.values(existingColors).map((color) => color.toLowerCase()))

  for (const color of PASTEL_PALETTE) {
    if (!used.has(color.toLowerCase())) {
      return color
    }
  }

  for (let index = 0; index < 10; index += 1) {
    const generated = createRandomPastelColor(randomFn)
    if (!used.has(generated.toLowerCase())) {
      return generated
    }
  }

  return createRandomPastelColor(randomFn)
}

export const collectSubjects = (cells: TimetableCells): string[] => {
  const subjects = new Set<string>()

  Object.values(cells).forEach((subject) => {
    const normalized = canonicalizeSubjectName(subject)
    if (normalized) {
      subjects.add(normalized)
    }
  })

  return [...subjects]
}

export const cleanupSubjectColors = (
  cells: TimetableCells,
  colorMap: Record<string, string>
): Record<string, string> => {
  const subjects = new Set(collectSubjects(cells))

  return Object.entries(colorMap).reduce<Record<string, string>>((acc, [subject, color]) => {
    const canonical = canonicalizeSubjectName(subject)

    if (canonical && subjects.has(canonical) && !acc[canonical]) {
      acc[canonical] = color
    }

    return acc
  }, {})
}

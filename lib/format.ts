const nf = (opts: Intl.NumberFormatOptions) => new Intl.NumberFormat("fr-FR", opts)

const integer = nf({ maximumFractionDigits: 0 })
const decimal = nf({ minimumFractionDigits: 2, maximumFractionDigits: 2 })
const euro = nf({ style: "currency", currency: "EUR" })

export const formatInt = (n: number) => integer.format(n)
export const formatDecimal = (n: number) => decimal.format(n)
export const formatEuro = (n: number) => euro.format(n)
export const formatPercent = (n: number, digits = 1) =>
  `${nf({ minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n)} %`

export const formatShortDate = (value: string | number | Date) =>
  new Date(value).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })

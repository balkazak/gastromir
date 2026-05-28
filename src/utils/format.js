export const formatPhone = (val) => {
  if (!val) return ''
  let cleanVal = val
  if (val.startsWith('+7')) {
    cleanVal = val.substring(2)
  } else if (val.startsWith('8')) {
    cleanVal = val.substring(1)
  }
  let numbers = cleanVal.replace(/\D/g, '')
  if (numbers.length > 10) numbers = numbers.slice(0, 10)
  if (numbers.length === 0) return '+7 ('
  let formatted = '+7 ('
  formatted += numbers.slice(0, 3)
  if (numbers.length > 3) {
    formatted += ') ' + numbers.slice(3, 6)
  }
  if (numbers.length > 6) {
    formatted += ' ' + numbers.slice(6, 8)
  }
  if (numbers.length > 8) {
    formatted += ' ' + numbers.slice(8, 10)
  }
  return formatted
}

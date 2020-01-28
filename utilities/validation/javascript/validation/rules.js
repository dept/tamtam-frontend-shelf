import { isValidEmail, isValidPassword } from './'

const rules = {
  required: {
    message: 'Veld is verplicht',
    method: el => {
      if (el.type === 'checkbox') {
        return el.checked
      } else if (el.type === 'radio') {
        const name = el.name
        return el.parentNode.querySelectorAll(`input[name=${name}]:checked`).length > 0
      }
      return el.value !== ''
    },
  },
  email: {
    message: 'Geen gelding e-mailadres',
    method: el => el.value === '' || isValidEmail(el.value),
  }
}

export { rules }

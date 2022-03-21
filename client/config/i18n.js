import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import fromPairs from 'lodash/fp/fromPairs'
import Cookies from 'js-cookie'
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, FALLBACK_LANGUAGE } from 'common/locales'
import moment from 'moment'

const requireLocales = require.context(
  'common/locales/',
  false,
  /\.yml$/,
)

const resources = SUPPORTED_LANGUAGES.map(
  language => {
    return [
      language,
      {
        translation: requireLocales(`./${language}.yml`),
        flavored: requireLocales(`./${language}.${process.env.FLAVOR}.yml`),
      }
    ]
  }
) |> fromPairs

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: Cookies.get('i18next') || DEFAULT_LANGUAGE,
    fallbackLng: FALLBACK_LANGUAGE,
    // debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // react already safes from xss
      format: (value, format, lng) => {
        if (moment.isMoment(value)) {
          let offsetStr
          ;[format, offsetStr] = format.split(/, ?/)
          const date = moment(value)
          if (offsetStr) {
            date.utcOffset(parseInt(offsetStr))
          }
          return date.format(format)
        }
        return value
      },
    }
  })

import moment from 'moment'

const perFlavor = {

  "23hbd": year => {
    let lastDayOfMarch = moment.utc([year, 2, 31]).utcOffset(1)
    let beginDate = lastDayOfMarch.clone().subtract(lastDayOfMarch.day() + 1, "days").hour(13)
    let endDate = beginDate.clone().add(23, "hours").utcOffset(2)
    return [beginDate, endDate]
  },

  "25hbd": year => {
    let lastDayOfOctober = moment.utc([year, 9, 31]).utcOffset(2)
    let beginDate = lastDayOfOctober.clone().subtract(lastDayOfOctober.day() + 1, "days").hour(13)
    let endDate = beginDate.clone().add(25, "hours").utcOffset(1)
    return [beginDate, endDate]
  },

}

export default perFlavor[process.env.FLAVOR]

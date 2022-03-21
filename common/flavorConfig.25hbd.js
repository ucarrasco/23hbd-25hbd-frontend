import escapeHtml from 'escape-html'

export const strings = {
  short: "25hBD",
  long: "25h de la BD",
  extraLong: "25 heures de la BD",
  yourAchievement: "ta tortue",
  achievementSuffix: {
    silver: " d'argent",
    gold: " d'or",
    pink: " rouge",
  }
}

export const policies = {
  challengeTypes: ['classico', 'webtoon'],
  pagesGoalPerChallengeType: {
    classico: 12,
    webtoon: 24,
  },
}

export const defaultHtmlData = {
  title: `Les 25 heures de la Bande Dessinée et de l'Illustration`,
  author: `Turtle Tech Squad`,
  themeColor: `#071632`,
  metaTags: `<meta property="og:image:url" content="${process.env.HTTP_HOST}/og-image.png">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="600">
  <meta property="og:image:height" content="424">
  <meta property="og:image:description" content="${escapeHtml(`Les 25 Heures de la BD et de l'Illustration sont un marathon artistique qui se déroule sur internet. Il faut créer une bande dessinée de 12 pages ou une série de 12 illustrations, avec un thème et une contrainte imposés, dans un délai de 25 heures.`)}">`
  
}

export const features = {
  localization: false,
  followAuthors: true,
  pwa: true,
}

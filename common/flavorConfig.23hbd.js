import escapeHtml from 'escape-html'

export const strings = {
  short: "23hBD",
  long: "23h de la BD",
  extraLong: "23 heures de la BD",
  yourAchievement: "ton lapin",
  achievementSuffix: {
    silver: " d'argent",
    gold: " d'or",
    pink: " rose",
  }
}

export const policies = {
  challengeTypes: ['classico', 'turbomedia', 'webtoon'],
  pagesGoalPerChallengeType: {
    classico: 24,
    turbomedia: 80,
    webtoon: 48,
  },
}

export const defaultHtmlData = {
  title: `Les 23 heures de la Bande Dessinée`,
  author: `Bunny Tech Squad`,
  themeColor: `#07080d`,
  metaTags: `<meta property="og:image:url" content="${process.env.HTTP_HOST}/og-image-2022.png">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:description" content="${escapeHtml(`Les 23 Heures de la Bande Dessinée sont un marathon artistique. Il faut créer une bande dessinée (de 24 pages) ou un Turbomedia (de 80 vignettes), avec un thème et une contrainte imposés, dans un délai de 23 heures.`)}">`
}

export const features = {
  localization: true,
  followAuthors: false,
  pwa: false,
}



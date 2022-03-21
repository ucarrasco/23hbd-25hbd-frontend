export const ALLOWED_FILE_TYPES = {
  classico: [
    'image/jpeg',
    'image/png',
    'image/gif'
  ],
  turbomedia: [
    'image/jpeg',
    'image/png',
    'image/gif'
  ],
  webtoon: [
    'image/jpeg',
    'image/png',
    'image/gif'
  ]
}

export const MAXIMUM_FILE_SIZE = {
  'image/jpeg': 1024 * 1024, // 1 Mo
  'image/png': 1024 * 1024, // 1 Mo
  'image/gif': 2 * 1024 * 1024, // 2 Mo
}

export const MAXIMUM_FILE_SIZE_TEXT = "1 Mo (gifs: 2 Mo)"

export const INSTRUCTIONS_KEY = `global.planche-upload.instructions-20200321`

export const ALLOWED_FORMATS = {
  classico: [
    "800x600",
    "600x800"
  ],
  turbomedia: [
    "700x525",
    "525x700"
  ],
  webtoon: [
    "800x1280",
  ],
}

// okay this one is more a util
export const FILE_TYPE_TO_EXT = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif'
}

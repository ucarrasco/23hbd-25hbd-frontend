import * as Showdown from 'showdown'

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
  simpleLineBreaks: true,
})

function mdToHtml(mdContent) {
  return converter.makeHtml(mdContent)
}

export default mdToHtml

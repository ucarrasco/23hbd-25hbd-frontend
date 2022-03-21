import i18n from "i18next"
import uniqueId from 'lodash/uniqueId'

const inContextEditorEnabled = false
const missingTextsMode = true

const normal = (...args) => i18n.t(...args)

const inContextEditor = (...args) => {
  const key = args[0]
  if (missingTextsMode)
    return `✅ ${normal(...args)}`
  return `[[ice_t_${uniqueId()}: ${key}]]`
}

function isElementVisible(element) {
  return element.offsetParent !== null
}

// element position
// element.getBoundingClientRect()

window.now = () => {
  let nodeIterator = document.createNodeIterator(
    document.body,
    NodeFilter.SHOW_ELEMENT,
    (node) => {
        return (
          (
            missingTextsMode
              ? (
                node.textContent && !node.textContent.includes('✅ ')
              )
              : node.textContent.includes('[[ice_t_')
          )
          && node.nodeName.toLowerCase() !== 'script' // not interested in the script
          && node.children.length === 0 // this is the last node
        ) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
    }
  )
  let pars = []
  let currentNode

  while (currentNode = nodeIterator.nextNode())
    pars.push(currentNode)
  return pars.map(par => [par, par.textContent])
}

const translateToUse = inContextEditorEnabled ? inContextEditor : normal

export default translateToUse

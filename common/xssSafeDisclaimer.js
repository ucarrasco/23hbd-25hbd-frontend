import xss from 'xss'

const defaultWhiteList = xss.whiteList
const whiteList = { ...defaultWhiteList }
delete whiteList.img
delete whiteList.video

const disclaimerXss = new xss.FilterXSS({
  whiteList,
})

function xssSafe(str) {
  return disclaimerXss.process(str)
}

export default xssSafe

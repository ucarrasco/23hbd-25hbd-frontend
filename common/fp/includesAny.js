import intersection from 'lodash/intersection'
export default (...collection) => (items) => !!intersection(collection, items).length

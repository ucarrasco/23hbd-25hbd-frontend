const s3Host = process.env.CLOUDFRONT_DOMAIN ? `https://${process.env.CLOUDFRONT_DOMAIN}` : `http://${process.env.S3_BUCKET}.s3.amazonaws.com`

// version direct to s3 (no https)
const gets3Url = (key) => `${s3Host}/${key}`

// version express proxy (https)
export const getProxiedS3Url = (key) => `${process.env.HTTP_HOST}/files/${key}`


export default process.env.S3_PROXY === 'true' ? getProxiedS3Url : gets3Url

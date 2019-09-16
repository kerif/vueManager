const hostName = location.hostname
let baseUrl
switch (hostName) {
  default:
    baseUrl = {
      BASE_API_URL: 'https://dev-jiyun.nle-tech.com/jiyun-api/admin',
      IMAGE_URL: 'https://dev-jiyun.nle-tech.com'
    }
    break
}

export default baseUrl

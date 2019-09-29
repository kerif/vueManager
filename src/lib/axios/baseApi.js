const hostName = location.hostname
let baseUrl
switch (hostName) {
  // 开发服
  case 'dev-jiyun-admin.nle-tech.com':
    baseUrl = {
      BASE_API_URL: 'https://dev-jiyun.nle-tech.com/jiyun-api/admin',
      IMAGE_URL: 'https://dev-jiyun.nle-tech.com'
      // BASE_API_URL: 'https://dev-jiyun.tomtiddler.top/jiyun-api/admin'
    }
    break
  // 正式服
  case 'jiyun.haiouoms.com':
    baseUrl = {
      BASE_API_URL: 'https://api-jiyun.haiouoms.com/jiyun-api/admin',
      IMAGE_URL: 'https://api-jiyun.haiouoms.com'
      // BASE_API_URL: 'https://dev-jiyun.tomtiddler.top/jiyun-api/admin'
    }
    break
  default:
    baseUrl = {
      BASE_API_URL: 'https://dev-jiyun.nle-tech.com/jiyun-api/admin',
      IMAGE_URL: 'https://dev-jiyun.nle-tech.com'
      // BASE_API_URL: 'https://dev-jiyun.tomtiddler.top/jiyun-api/admin'
    }
    break
}

export default baseUrl

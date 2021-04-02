const hostName = location.hostname
let baseUrl
switch (hostName) {
  // 开发服
  // case 'dev-jiyun-admin-v2.nle-tech.com':
  //   baseUrl = {
  //     BASE_API_URL: 'https://dev-jiyun-api-v2.nle-tech.com/api/admin',
  //     IMAGE_URL: 'https://dev-jiyun-api-v2.nle-tech.com'
  //     // BASE_API_URL: 'https://dev-jiyun.tomtiddler.top/jiyun-api/admin'
  //   }
  // 临时开发服地址
  case 'dev-admin.haiouoms.com':
    baseUrl = {
      BASE_API_URL: 'https://dev-api.haiouoms.com/api/admin',
      IMAGE_URL: 'https://dev-api.haiouoms.com'
      // BASE_API_URL: 'https://dev-jiyun.tomtiddler.top/jiyun-api/admin'
    }
    break
  // 正式服
  case 'jiyun.haiouoms.com':
    baseUrl = {
      // BASE_API_URL: 'https://api-jiyun.haiouoms.com/jiyun-api/admin',
      // IMAGE_URL: 'https://api-jiyun.haiouoms.com'
      // BASE_API_URL: 'https://dev-jiyun.tomtiddler.top/jiyun-api/admin'
      BASE_API_URL: 'https://api-jiyun-v2.haiouoms.com/api/admin',
      IMAGE_URL: 'https://api-jiyun-v2.haiouoms.com'
    }
    break
  // v2 正式服
  case 'jiyun-v2.haiouoms.com':
    baseUrl = {
      BASE_API_URL: 'https://api-jiyun-v2.haiouoms.com/api/admin',
      IMAGE_URL: 'https://api-jiyun-v2.haiouoms.com'
    }
    break
  // v2 国内正式服
  case 'jiyun-cn.haiouoms.com':
    baseUrl = {
      BASE_API_URL: 'https://api-jiyun-v2.haiouoms.com/api/admin',
      IMAGE_URL: 'https://api-jiyun-v2.haiouoms.com'
    }
    break
  // 测试服
  case 'jiyun-test-admin-v2.nle-tech.com':
    baseUrl = {
      BASE_API_URL: 'https://jiyun-test-api-v2.nle-tech.com/api/admin',
      IMAGE_URL: 'https://jiyun-test-api-v2.nle-tech.com'
    }
    break
  default:
    // baseUrl = {
    //   BASE_API_URL: 'https://dev-jiyun-api-v2.nle-tech.com/api/admin',
    //   IMAGE_URL: 'https://dev-jiyun-api-v2.nle-tech.com'
    // }
    // baseUrl = {
    //   BASE_API_URL: 'https://dev-api.haiouoms.com/api/admin',
    //   IMAGE_URL: 'https://dev-api.haiouoms.com'
    //   // BASE_API_URL: 'https://dev-jiyun.tomtiddler.top/jiyun-api/admin'
    // }
    baseUrl = {
      BASE_API_URL: 'https://api-jiyun-v2.haiouoms.com/api/admin',
      IMAGE_URL: 'https://api-jiyun-v2.haiouoms.com'
    }
    break
}

export default baseUrl

const hostName = location.hostname
let baseUrl
switch (hostName) {
  case 'localhost':
  case 'dev-admin.haiouoms.com':
    baseUrl = {
      BASE_API_URL: 'https://dev-api.haiouoms.com/api/admin',
      IMAGE_URL: 'https://dev-api.haiouoms.com',
      BLOCK_URL: 'https://dev-api.haiouoms.com/block-explain'
    }
    break
  // 正式服
  case 'jiyun.haiouoms.com':
    baseUrl = {
      BASE_API_URL: 'https://api-jiyun-v2.haiouoms.com/api/admin',
      IMAGE_URL: 'https://api-jiyun-v2.haiouoms.com',
      BLOCK_URL: 'https://api-jiyun-v2.haiouoms/block-explain'
    }
    break
  // v2 正式服
  case 'jiyun-v2.haiouoms.com':
    baseUrl = {
      BASE_API_URL: 'https://api-jiyun-v2.haiouoms.com/api/admin',
      IMAGE_URL: 'https://api-jiyun-v2.haiouoms.com',
      BLOCK_URL: 'https://api-jiyun-v2.haiouoms.com/block-explain'
    }
    break
  // v2 国内正式服
  case 'jiyun-cn.haiouoms.com':
    baseUrl = {
      BASE_API_URL: 'https://api-jiyun-v3.haiouoms.com/api/admin',
      IMAGE_URL: 'https://api-jiyun-v3.haiouoms.com',
      BLOCK_URL: 'https://api-jiyun-v3.haiouoms.com/block-explain'
    }
    break
  // v3 正式服
  case 'jiyun-v3.haiouoms.com':
    baseUrl = {
      BASE_API_URL: 'https://api-jiyun-v3.haiouoms.com/api/admin',
      IMAGE_URL: 'https://api-jiyun-v3.haiouoms.com',
      BLOCK_URL: 'https://api-jiyun-v3.haiouoms.com/block-explain'
    }
    break
  // v4 
  case 'dev-admin-v4.haiouoms.com':
    baseUrl = {
      BASE_API_URL: 'https://dev-admin-v4.haiouoms.com/api/admin',
      IMAGE_URL: 'https://dev-admin-v4.haiouoms.com',
      BLOCK_URL: 'https://dev-admin-v4.haiouoms.com/block-explain'
    }
    break
  default:
    baseUrl = {
      BASE_API_URL: 'https://api-jiyun-v3.haiouoms.com/api/admin',
      IMAGE_URL: 'https://api-jiyun-v3.haiouoms.com',
      BLOCK_URL: 'https://api-jiyun-v3.haiouoms.com/block-explain'
    }
    break
}

export default baseUrl

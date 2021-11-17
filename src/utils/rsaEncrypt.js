import JSEncrypt from 'jsencrypt'

const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwfxIAFQxipEEKJMc4RhD
LJQ7WxMGWLpinEEbJbMoXfSqlDjhxfVx5//itbwWmIKM1A8n0MTerudTvjdDmG9k
37+EDS/dcYmxZ7KCqEp4teBsRmg8v9EgnblgkEVpwTA7M5zgldMFJnearrBx2IwL
hWqK3IKADSiLcvrO25crz89bkPq2jgmi2QOsKEIATOErrkyFTxRVYqw8/UB0q5Za
/KWAE9xTgU7+oteoRnI7ZdXlJZ1ENyMPN+DAT4WZoR+nWmKCVPFNgwdN2b3D8Rum
6L1bQcOMbK2wS9Ooc1uu6+AfT8/HTODNmMnBf4/LBWpwjOLUhz1YLaeNnYqgpUzS
HwIDAQAB
-----END PUBLIC KEY-----`

// 公钥加密
export function excrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey)
  return encryptor.encrypt(txt)
}

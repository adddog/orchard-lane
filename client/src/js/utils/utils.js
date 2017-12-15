export const ITAG = "133"

export const REMOTE_ASSET_URL = process.env.ASSET_URL

export const ASSET_URL = process.env.OFFLINE
  ? ""
  : process.env.ASSET_URL

export const INIT_JSON_URL = process.env.DEV ? "/json/" : ""

export const JSON_URL = process.env.OFFLINE
  ? `${ASSET_URL}json/`
  : process.env.ASSET_URL

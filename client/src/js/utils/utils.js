export const ITAG = Detector.isMobile ? "133" : "133"

export const REMOTE_ASSET_URL = process.env.ASSET_URL

export const ASSET_URL = process.env.OFFLINE
  ? ""
  : process.env.ASSET_URL

export const INIT_JSON_URL = process.env.DEV ? "/orchard/json/" : ""

export const JSON_URL = process.env.OFFLINE
  ? `${ASSET_URL}json/`
  : process.env.ASSET_URL

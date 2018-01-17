export const ITAG = Detector.isMobile ? "133" : "133"

export const REMOTE_ASSET_URL = process.env.OFFLINE
  ? ""
  : process.env.ASSET_URL
export const REMOTE_JSON_ASSET_URL = process.env.OFFLINE
  ? "json/"
  : process.env.ASSET_URL
export const REMOTE_VIDEO_ASSET_URL = process.env.OFFLINE
  ? "videos/"
  : process.env.ASSET_URL

export const ASSET_URL = process.env.OFFLINE
  ? ""
  : process.env.ASSET_URL

export const INIT_JSON_URL = process.env.DEV ? "/json/" : ""

export const JSON_URL = process.env.OFFLINE
  ? `${ASSET_URL}json/`
  : process.env.ASSET_URL

export const VIDEO_URL = process.env.OFFLINE
  ? `${ASSET_URL}videos/`
  : process.env.ASSET_URL

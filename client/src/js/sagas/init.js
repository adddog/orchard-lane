import Q from "bluebird"
import { ITAG, ASSET_URL, JSON_URL, INIT_JSON_URL } from "utils/utils"
import {
    call,
    cancel,
    put,
    takeLatest,
    select,
} from "redux-saga/effects"

import {
    INIT_RUN,
    SET_RUN_SETTINGS,
    LOAD_MAP_DATA_SUCCESS,
    SET_MAP_DATA_PLOT_PATHS,
    SET_VIDEO_MANIFESTS,
    INIT_LOAD_COMPLETE,
} from "actions/actionTypes"

import { JsonApiRequest } from "./api"

//**-----------
//**** API CALLS
//**-----------
const RUN = () => {
    return JsonApiRequest(`${INIT_JSON_URL}run.json`)
}

const MAP_DATA = () => {
    return JsonApiRequest(`${INIT_JSON_URL}map_data.json`)
}

/*
The videoId jsons
*/
const VIDEO_PLOT_PATHS = videoIds => {
    return Q.map(videoIds, id =>
        JsonApiRequest(`${INIT_JSON_URL}${id}.json`).then(d => {
            d.nodes.forEach(p => {
                /*
              !!
              20 PIXELS IS 10 METERS IN 3D SPACE
            */
                p.x *= 0.2
                p.y *= 0.2
            })
            return {
                id: id,
                data: d,
            }
        })
    )
}

const VIDEO_MANIFESTS = urls => {
    return Q.map(urls, url =>
        JsonApiRequest(url, {
            method: "GET",
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
        })
    )
}

const getRaw = state => {
    const { mapData = state } = state
    return mapData.get("raw")
}
const getVideoIds = state => {
    const { mapData = state } = state
    return mapData.get("videoIds")
}

function* doInit(action) {
    const runSettings = yield call(RUN)
    yield put({
        type: SET_RUN_SETTINGS,
        payload: runSettings,
    })
    const resp = yield call(MAP_DATA)
    yield put({
        type: LOAD_MAP_DATA_SUCCESS,
        payload: resp,
    })
    const videoIds = yield select(getVideoIds)
    const plotPaths = yield call(VIDEO_PLOT_PATHS, videoIds)
    yield put({
        type: SET_MAP_DATA_PLOT_PATHS,
        payload: plotPaths,
    })

    const { itag } = yield select(state =>
        state.mapData.get("runSettings")
    )
    const videoManifests = yield call(
        VIDEO_MANIFESTS,
        videoIds.map(id => `${JSON_URL}${id}_${itag || ITAG}.json`)
    )

    yield put({
        type: SET_VIDEO_MANIFESTS,
        payload: videoManifests,
    })

    yield put({
        type: INIT_LOAD_COMPLETE,
        payload: true,
    })
}

export default function* init() {
    yield takeLatest(INIT_RUN, doInit)
}

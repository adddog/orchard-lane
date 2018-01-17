import Q from "bluebird"
import {
    ITAG,
    ASSET_URL,
    REMOTE_ASSET_URL,
    REMOTE_JSON_ASSET_URL,
    JSON_URL,
    INIT_JSON_URL,
} from "utils/utils"
import {
    call,
    all,
    cancel,
    put,
    takeLatest,
    select,
} from "redux-saga/effects"
import { compact } from "lodash"
import { getAllVideoIds } from "selectors/videoModel"

import {
    INIT_RUN,
    SET_JSON_RUN_SETTINGS,
    JSON_LOAD_MAP_DATA_SUCCESS,
    JSON_VIDEO_DATA_SUCCESS,
    SET_MAP_DATA_PLOT_PATHS,
    SET_JSON_VIDEO_MANIFESTS,
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

const VIDEO_DATA = () => {
    return JsonApiRequest(`${INIT_JSON_URL}videos.json`)
}

/*
The videoId jsons
*/
const VIDEO_PLOT_PATHS = videoIds => {
    return Q.map(
        videoIds,
        id =>
            JsonApiRequest(`${INIT_JSON_URL}${id}.json`)
                .catch(err => null)
                .then(d => {
                    if (!d) return null
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
                }),
        { concurrency: 4 }
    )
}

const VIDEO_MANIFESTS = urls => {
    console.log(urls);
    return Q.map(
        urls,
        url =>
            JsonApiRequest(url, {
                method: "GET",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
            })
                .catch(err => null)
                .then(d => (!!d ? d : null)),
        { concurrency: 4 }
    )
}

function* doInit(action) {
    const jsonLoaded = yield all(
        [RUN, MAP_DATA, VIDEO_DATA].map(saga => call(saga))
    )
    yield put({
        type: SET_JSON_RUN_SETTINGS,
        payload: jsonLoaded[0],
    })
    yield put({
        type: JSON_LOAD_MAP_DATA_SUCCESS,
        payload: jsonLoaded[1],
    })
    yield put({
        type: JSON_VIDEO_DATA_SUCCESS,
        payload: jsonLoaded[2],
    })

    const videoIds = yield select(getAllVideoIds)
    const plotPaths = yield call(VIDEO_PLOT_PATHS, videoIds)
    yield put({
        type: SET_MAP_DATA_PLOT_PATHS,
        payload: compact(plotPaths),
    })

    const { itag } = yield select(state =>
        state.mapData.get("runSettings")
    )

    const videoManifests = yield call(
        VIDEO_MANIFESTS,
        videoIds.map(
            id => `${REMOTE_JSON_ASSET_URL}${id}/${id}_${itag || ITAG}.json`
        )
    )

    yield put({
        type: SET_JSON_VIDEO_MANIFESTS,
        payload: compact(videoManifests),
    })

    yield put({
        type: INIT_LOAD_COMPLETE,
        payload: true,
    })
}

export default function* init() {
    yield takeLatest(INIT_RUN, doInit)
}

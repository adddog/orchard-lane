import {
  INSTRUCTION_CLICKED,
  PREMIUM_PARTNER_REQUEST,
  API_SETTINGS_POST,
} from 'actions/actionTypes';

export function premiumPartnerApiRequest(payload = {}) {
  return {
    type: PREMIUM_PARTNER_REQUEST,
    payload: payload,
  }
}

export function instructionClicked(payload = {}) {
  return {
    type: INSTRUCTION_CLICKED,
    payload: payload,
  }
}

export function saveSettingsPost(payload = {}) {
  return {
    type: API_SETTINGS_POST,
    payload: payload,
  }
}

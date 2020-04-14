import { SET_INITIAL_STATE } from '../../../shared/store/sharedState';

const initialState = {
  loading: true,
}

export const selectors = {
  getLoadingState: state => state.initialLoadingState.loading,
}

export default function reducer (state = initialState, { type }) {
  if (type === SET_INITIAL_STATE) {
    return { loading: false };
  } else {
    return state;
  }
}

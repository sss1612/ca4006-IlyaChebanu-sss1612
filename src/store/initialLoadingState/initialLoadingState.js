import { SET_INITIAL_STATE } from '../../../shared/store/sharedState';

const initialState = {
  loading: true,
}

const SET_LOADING = 'initialLoadingState/SET_LOADING';

export const selectors = {
  getLoadingState: state => state.initialLoadingState.loading,
}

export default function reducer (state = initialState, { type }) {
  if (type === SET_INITIAL_STATE) {
    return { loading: false };
  } else if (type === SET_LOADING) {
    return { loading: true };
  } else {
    return state;
  }
}

export const actions = {
  setLoading: () => ({ type: SET_LOADING }),
};

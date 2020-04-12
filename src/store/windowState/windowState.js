const initialState = {
    uploadedFiles: {
        currentSelectedUploadFile: undefined,
    }
}

export const SET_CURRENT_SELECTED_UPLOAD_FILE = "windowState/SET_CURRENT_SELECTED_UPLOAD_FILE";

export const selectors = {
    getCurrentSelectedUploadedFileSelector: state => state.windowState.uploadedFiles.currentSelectedUploadFile,
}

export default function reducer (state=initialState, action) {
    switch (action.type) {
        case (SET_CURRENT_SELECTED_UPLOAD_FILE): {
            const filename = action.payload;
            return {
                ...state,
                uploadedFiles: {
                    currentSelectedUploadFile: filename,
                }
            };
        }
        default: {
            return state;
        }
    }
}

export const actions = {
    setCurrentSelectedUploadedFile: filename => ({
        type: SET_CURRENT_SELECTED_UPLOAD_FILE,
        payload: filename,
    })
}
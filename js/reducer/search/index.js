import Types from '../../action/types';

const defaultState = {
    showText: 'Search',
    items: [],
    isLoading: false,
    projectModels: [],// Items that shows on page
    hideLoadingMore: true,
    showBottomButton: false,
};

export default function onAction(state = defaultState, action) {
    switch (action.type) {
        case Types.SEARCH_REFRESH: // Search
            return {
                ...state,
                isLoading: true,
                hideLoadingMore: true,
                showBottomButton: false,
                showText:'Cancle',
            };
        case Types.SEARCH_REFRESH_SUCCESS: // Get search result back
            return {
                ...state,
                isLoading: false,
                hideLoadingMore: false,
                showBottomButton: action.showBottomButton,
                items: action.items,
                projectModels: action.projectModels,
                pageIndex: action.pageIndex,
                showText: 'Search',
                inputKey: action.inputKey
            };
        case Types.SEARCH_FAIL:
            return {
                ...state,
                isLoading: false,
                showText: 'Search',
            };
        case Types.SEARCH_CANCEL:
            return {
                ...state,
                isLoading: false,
                showText: 'Search',
            };
        case Types.SEARCH_LOAD_MORE_SUCCESS:
            return {
                ...state,//Object.assign @http://www.devio.org/2018/09/09/ES6-ES7-ES8-Feature/
                projectModels: action.projectModels,
                hideLoadingMore: false,
                pageIndex: action.pageIndex,
            };
        case Types.SEARCH_LOAD_MORE_FAIL:
            return {
                ...state,//Object.assign @http://www.devio.org/2018/09/09/ES6-ES7-ES8-Feature/
                hideLoadingMore: true,
                pageIndex: action.pageIndex,
            };
        default:
            return state;
    }

}
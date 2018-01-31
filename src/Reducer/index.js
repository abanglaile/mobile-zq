import Immutable from 'immutable';
import jwtDecode from 'jwt-decode';

const defaulatTestData = Immutable.fromJS({
        isFetching: false,
        isFinish : 0,
        student_rating : 0,
        exindex: 0, 
        exercise: [{title: '', answer: '[]', type: 0, breakdown: []}],
        modalOpen: false,
        test_log: [{}],
        ranking_list: [{}],
        record: {correct: 0, new_rating: 0},
    });
const defaulatStudentData = Immutable.fromJS({
        isFetching: false,
        ladderscore: 0,
        book: [],
        my_test_list: [],
        chapter: {
            chaptername : null,
            status: {practice: 0, correct:0},
            kp: [],
        }
    });

const defaulatStuStatus = Immutable.fromJS({
        isFetching: false,
        capatity: [],
        ladder : [],
        comusedkp : [],
    });

const defaulatAuthData = Immutable.fromJS({
        token: null,
        userName: null,
        userid: null,
        isAuthenticated: false,
        isAuthenticating: false,
        statusText: null,
        wxinfo:{},
    });

//获取鉴权数据
export const AuthData = (state = defaulatAuthData, action = {}) => {
    switch(action.type){
        case 'LOGIN_USER_REQUEST':
            return state.set('isAuthenticating', true);
        case 'REG_USER_REQUEST':
            return state.set('isAuthenticating', true);
        case 'LOGIN_USER_SUCCESS':
            var sucState = {
                isAuthenticating: false,
                isAuthenticated: true,
                token: action.payload.token,
                userName: jwtDecode(action.payload.token).username,
                userid: jwtDecode(action.payload.token).userid,
                statusText: 'You have been successfully logged in.'
            };
            return Immutable.fromJS(sucState);
        case 'REG_USER_SUCCESS':
            var sucRegState = {
                isAuthenticating: false,
                isAuthenticated: true,
                token: action.payload.token,
                userName: jwtDecode(action.payload.token).username,
                userid: jwtDecode(action.payload.token).userid,
                statusText: 'You have been successfully registered.'
            };
            return Immutable.fromJS(sucRegState);
        case 'LOGIN_USER_FAILURE':
            var failState = {
                isAuthenticating: false,
                isAuthenticated: false,
                token: null,
                userName: null,
                userid: null,
                statusText: `Authentication Error: ${action.payload.status} ${action.payload.statusText}`
            };
            return Immutable.fromJS(failState);
        case 'REG_USER_FAILURE':
            var failRegState = {
                isAuthenticating: false,
                isAuthenticated: false,
                token: null,
                userName: null,
                userid: null,
                statusText: `Authentication Error: ${action.payload.status} ${action.payload.statusText}`
            };
            return Immutable.fromJS(failRegState);
        case 'LOGOUT_USER':
            return state.set('isAuthenticated', false)
                    .set('token',null)
                    .set('userName',null)
                    .set('userid',null)
                    .set('statusText','You have been successfully logged out.');
        case 'GET_WX_USERINFO_SUCCESS':
            return state.set('wxinfo', Immutable.fromJS(action.json));
        default:
            return state;
    }
} 

//手动获取数据
export const testData = (state = defaulatTestData, action = {}) => {
    switch(action.type){
        case 'GET_TEST_START':
            return state.set('isFetching', true);
        case 'GET_TEST_STATUS_SUCCESS':
            return state.set('test_status', Immutable.fromJS(action.json.test_status))
                .set('test_id', action.test_id);
        case 'GET_TEST_RANKLIST_SUCCESS':
            return state.set('ranking_list', Immutable.fromJS(action.json));
        case 'GET_STU_TESTINFO_SUCCESS':
            return state.set('isFinish', action.json.isFinish)
                        .set('student_rating', action.json.student_rating);
        case 'GET_TEST_SUCCESS':
            const exercise = action.json.exercises ? action.json.exercises : action.json;
            const start_time = new Date();
            var test_log = [];
            for(var i = 0; i < exercise.length; i++){
                const breakdown = exercise[i].breakdown;
                var breakdown_sn = [];
                for(var j = 0; j < breakdown.length; j++){
                  //如果没有前置步骤的都设为0并在渲染中显示，-1代表不确定在渲染中不显示
                  const sn_state = breakdown[j].presn ? -1 : 0;
                  breakdown_sn[j] = {
                    sn: breakdown[j].sn, 
                    kpid: breakdown[j].kpid,
                    kpname: breakdown[j].kpname, 
                    sn_state: sn_state, 
                    presn: breakdown[j].presn, 
                    kp_old_rating: breakdown[j].kp_rating, 
                    sn_old_rating: breakdown[j].sn_rating
                  };
                }
                test_log[i] = {
                    exercise_state: -1,
                    answer: exercise[i].answer,
                    start_time: start_time,
                    breakdown_sn: breakdown_sn,
                    ac_time: 0,
                }
            }
            var newState = {
                exercise: exercise, 
                exindex: 0, 
                record: {correct: 0, wrong: 0, new_rating: action.student_rating, combo_correct: 0, max_combo: 0},
                start_time: start_time, 
                test_id: action.json.test_id ? action.json.test_id : action.test_id, 
                test_log: test_log,
                isFetching: false,
                modalOpen: false,
            };
            
            return state.mergeDeep(Immutable.fromJS(newState));
            break;
        // case 'GET_TEST_SUCCESS':
        //     const exercise = action.json;
        //     const start_time = new Date();
        //     var test_log = [];
        //     for(var i = 0; i < exercise.length; i++){
        //         const breakdown = exercise[i].breakdown;
        //         var breakdown_sn = [];
        //         for(var j = 0; j < breakdown.length; j++){
        //           //如果没有前置步骤的都设为0并在渲染中显示，-1代表不确定在渲染中不显示
        //           const sn_state = breakdown[j].presn ? -1 : 0;
        //           breakdown_sn[j] = {
        //             sn: breakdown[j].sn, 
        //             kpid: breakdown[j].kpid,
        //             kpname: breakdown[j].kpname, 
        //             sn_state: sn_state, 
        //             presn: breakdown[j].presn, 
        //             kp_old_rating: breakdown[j].kp_rating, 
        //             sn_old_rating: breakdown[j].sn_rating
        //           };
        //         }
        //         test_log[i] = {
        //             exercise_state: -1,
        //             answer: JSON.parse(exercise[i].answer),
        //             start_time: start_time,
        //             breakdown_sn: breakdown_sn,
        //             ac_time: 0,
        //         }
        //     }
        //     var newState = {
        //         exercise: exercise, 
        //         exindex: 0, 
        //         record: {correct: 0, wrong: 0, new_rating: action.student_rating, combo_correct: 0, max_combo: 0},
        //         start_time: start_time, 
        //         test_id: action.test_id, 
        //         test_log: test_log,
        //         isFetching: false,
        //         modalOpen: false,
        //     };
            
        //     return state.mergeDeep(Immutable.fromJS(newState));
        //     break;
        case 'GET_TEST_EXERCISE_SUCCESS':
            return state.set('exercise', Immutable.fromJS(action.json));
        case 'GET_TEST_RESULT_SUCCESS':
            return state.set('test_log', Immutable.fromJS(action.json.test_log))
                .set('test_kp', Immutable.fromJS(action.json.test_kp))
                .set('correct', action.json.correct)
                .set('isFetching', false);
        case 'GET_EXERCISE_SAMPLE_SUCCESS':
            return state.set('exercise_sample', Immutable.fromJS(action.json)).set('isFetching', false).set('modalOpen', true);
        case 'UPDATE_EXINDEX':
            return state.set('exindex', action.exindex);
        case 'UPDATE_EXERCISE_ST':
            return state.set('exercise_st', new Date());
        case 'UPDATE_EXERCISE_TIME':
            return state.updateIn(['test_log', action.i, 'ac_time'], ac_time => ac_time + action.ac_time);
        case 'UPDATE_FINISH_TIME':
            return state.set("finish_time", new Date());
        case 'SHOW_ANSWER_TEST':
            return state.setIn(["test_log", action.exindex, 'answer_test'], true);
        case 'HIDE_FEEDBACK_TOAST':
            return state.set('feedbackToast', false);
        case 'CLOSE_MODAL':
            return state.set('modalOpen', false);
        case 'SUBMIT_EXERCISE_LOG':
            const exindex = state.get('exindex');
            return state.mergeDeepIn(['test_log', exindex], Immutable.fromJS(action.exercise_log)).set("modalOpen", true);
        case 'UPDATE_RECORD':
            // const exercise_state = action.exercise_log.exercise_state;
            // const combo_correct = state.getIn(['record', 'combo_correct']);
            // var combo_max = state.getIn(['record', 'combo_max']);
            // if(exercise_state){
            //     return state.updateIn(['record', 'combo_correct'], num => num + 1)
            //     .updateIn(['record', 'correct'], num => num + 1);
            //     combo_correct
            // }
            // if(combo_correct > combo_max){
            //     combo_correct 
            // }
        case 'EXERCISE_SELECT_CHANGE':
            return state.updateIn(['test_log', action.exindex, 'answer', action.index, 'select'], select => !select)
        case 'BREAKDOWN_SN_SELECT_CHANGE':
            const val = action.index;

            var breakdown_sn = state.getIn(['test_log', action.exindex, 'breakdown_sn']).toJS();
            breakdown_sn[val].sn_state = breakdown_sn[val].sn_state ? 0 : 1;
            //取消选择，将以这步作为前置的步骤全部设为不确定-1并不渲染显示
            for(var i = 0; i < breakdown_sn.length; i++){
                if(breakdown_sn[i].presn == breakdown_sn[val].sn){
                    //如果选择则把二级知识点设置为0，如果取消选择则把二级知识点设置为-1
                    breakdown_sn[i].sn_state = breakdown_sn[val].sn_state ? 0 : -1;
                }
            }
            return state.setIn(['test_log', action.exindex, 'breakdown_sn'], Immutable.fromJS(breakdown_sn));
        case 'SUBMIT_FEEDBACK':
            return state.setIn(['test_log', action.exindex, 'answer_test'], false).set('feedbackToast', true);
        case 'SUBMIT_TEST_START':
            return state;
        case 'SUBMIT_TEST_SUCCESS':
            return state.setIn(['delta_result'], Immutable.fromJS(action.json));
        default:
            return state;
    }
}


//获取测试数据
export const studentData = (state = defaulatStudentData, action = {}) => {
    switch(action.type){
        case 'GET_DATA_START':
            return state.set('isFetching', true);
        case 'GET_MY_SCORE_SUCCESS':
            return state.set('ladderscore', action.json.student_rating);
        case 'GET_CHAPTER_SUCCESS':
            return state.set('book', action.json).set('isFetching', false);
        case 'GET_CHAPTER_NAME_SUCCESS':
            return state.setIn(['chapter', 'chaptername'], action.json.chaptername).set('isFetching', false);
        case 'GET_CHAPTER_STATUS_SUCCESS':
            console.log(action.json);
            return state.setIn(['chapter', 'status'], action.json).set('isFetching', false);
        case 'GET_CHAPTER_KP_SUCCESS':
            return state.setIn(['chapter', 'kp'], action.json).set('isFetching', false);
        case 'GET_MYTEST_SUCCESS':
            return state.set('my_test_list', action.json).set('isFetching', false);
        default:
            return state;
    }
}

//获取学生学情数据
export const stuStatus = (state = defaulatStuStatus, action = {}) => {
    switch(action.type){
        case 'GET_STATUS_START':
            return state.set('isFetching', true);
        case 'GET_ABILITY_STATUS_SUCCESS':
            return state.set('capatity', Immutable.fromJS(action.json)).set('isFetching', false);
        case 'GET_LADDER_STATUS_SUCCESS':
            return state.set('ladder', Immutable.fromJS(action.json)).set('isFetching', false);
        case 'GET_COMUSED_KP_SUCCESS':
            return state.set('comusedkp', Immutable.fromJS(action.json)).set('isFetching', false);
        default:
            return state;
    }
}

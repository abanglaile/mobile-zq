import Immutable from 'immutable';
import jwtDecode from 'jwt-decode';

const defaulatTestData = Immutable.fromJS({
        isFetching: false,
        exindex: 0, 
        exercise: [{title: '', answer: '[]', type: 0, breakdown: []}],
        modalOpen: false,
        exercise_log: [{}],
        ranking_list: [{}],
        test_log: {finish_time: '', correct_exercise: 0},
        test_reward: {
            credit: {
                    delta_credit: 5,
                    old_credit: 30,
                    new_credit: 35,
            }, rating:{old_student_rating: 0, delta_student_rating: 0}, kp_rating: []},
    });
const defaulatStudentData = Immutable.fromJS({
        isFetching: false,
        student_rating: 0,
        book: [],
        my_test_list: [],
        my_uncompleted_test: [],
        chapter: {
            chaptername : null,
            status: {practice: 0, correct:0},
            kp: [],
        },
        tab: '',
        test_tab:'',
        capatity: [],
        ladder : [],
        kpladder : [],
        kpcapatity: [],
        comusedkp : [],
    });

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
        //获取全新测试数据
        case 'GET_TEST_SUCCESS':
            const exercise = action.exercise;
            //初始化测试开始时间
            var start_time = new Date();
            console.log("start_time:"+start_time);
            //构造exercise_log
            var exercise_log = [];
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
                exercise_log[i] = {
                    exercise_state: -1,//-1:未做, 0:错误, 1:正确
                    answer: exercise[i].answer,
                    start_time: start_time,
                    exercise_status: 0,//0: 全新未做，1: 做完待反馈，2：反馈完毕
                    breakdown_sn: breakdown_sn,
                    ac_time: 0,
                }
            }
            var test_log = {test_id: action.test_id, start_time: start_time, test_type: action.test_type}
            return state.set('exercise', Immutable.fromJS(exercise)).set('exindex', 0)
                .set('test_log', Immutable.fromJS(test_log))
                .set('exercise_log', Immutable.fromJS(exercise_log))
                .set('studentrating')
                .set('isFetching', false);
            break;

        case 'GET_TEST_EXERCISE_SUCCESS':
            return state.set('exercise', Immutable.fromJS(action.json)).set('isFetching', false);
        case 'GET_TEST_RATING_REWARD_SUCCESS':
            console.log(action.json);
            return state.set('test_reward', Immutable.fromJS(action.json));
        case 'GET_TEST_RESULT_SUCCESS':
            console.log(action.json.test_log);
            return state.set('exercise_log', Immutable.fromJS(action.json.exercise_log))
                .set('test_kp', Immutable.fromJS(action.json.test_kp))
                .set('test_log', Immutable.fromJS(action.json.test_log))
                .set('isFetching', false);
        case 'UPDATE_ENTRY': 
            return state.set('entry', action.entry);
        case 'UPDATE_EXINDEX':
            return state.set('exindex', action.exindex).set('exercise_st', new Date());
        case 'UPDATE_EXERCISE_STATUS':
            return state.setIn(['exercise_log', action.i, 'exercise_status'], action.exercise_status);
        case 'UPDATE_EXERCISE_TIME':
            return state.updateIn(['exercise_log', action.i, 'ac_time'], ac_time => ac_time + action.ac_time);
        case 'UPDATE_FINISH_TIME':
            return state.setIn(['test_log', "finish_time"], new Date());
        case 'SHOW_ANSWER_TEST':
            return state.setIn(["exercise_log", action.exindex, 'exercise_status'], 1);
        case 'HIDE_FEEDBACK_TOAST':
            return state.set('feedbackToast', false);
        case 'CLOSE_MODAL':
            return state.set('modalOpen', false);
        case 'SUBMIT_EXERCISE_LOG':
            const exindex = state.get('exindex');
            return state.mergeDeepIn(['exercise_log', exindex], Immutable.fromJS(action.exercise_log)).set("modalOpen", true);
        case 'EXERCISE_SELECT_CHANGE':
            console.log(action.index);
            return state.updateIn(['exercise_log', action.exindex, 'answer', action.index, 'select'], select => !select)
        case 'BREAKDOWN_SN_SELECT_CHANGE':
            const val = action.index;

            var breakdown_sn = state.getIn(['exercise_log', action.exindex, 'breakdown_sn']).toJS();
            breakdown_sn[val].sn_state = breakdown_sn[val].sn_state ? 0 : 1;
            //取消选择，将以这步作为前置的步骤全部设为不确定-1并不渲染显示
            for(var i = 0; i < breakdown_sn.length; i++){
                if(breakdown_sn[i].presn == breakdown_sn[val].sn){
                    //如果选择则把二级知识点设置为0，如果取消选择则把二级知识点设置为-1
                    breakdown_sn[i].sn_state = breakdown_sn[val].sn_state ? 0 : -1;
                }
            }
            return state.setIn(['exercise_log', action.exindex, 'breakdown_sn'], Immutable.fromJS(breakdown_sn));
        case 'SUBMIT_FEEDBACK':
            return state.setIn(['exercise_log', action.exindex, 'exercise_status'], 2).set('feedbackToast', true);
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
            console.log(action.json.student_rating);
            return state.set('student_rating', action.json.student_rating);
        case 'GET_CHAPTER_SUCCESS':
            return state.set('book', action.json).set('isFetching', false);
        case 'GET_CHAPTER_NAME_SUCCESS':
            return state.setIn(['chapter', 'chaptername'], action.json.chaptername).set('isFetching', false);
        case 'GET_CHAPTER_STATUS_SUCCESS':
            return state.setIn(['chapter', 'status'], action.json).set('isFetching', false);
        case 'GET_CHAPTER_KP_SUCCESS':
            return state.setIn(['chapter', 'kp'], action.json).set('isFetching', false);
        case 'GET_MYTEST_SUCCESS':
            return state.set('my_test_list', action.json).set('isFetching', false);
        case 'GET_MY_UNCOMPLETEDTEST_SUCCESS':
            return state.set('my_uncompleted_test', action.json).set('isFetching', false);
        case 'GET_SELECTED_TAB':
            return state.set('tab', action.tab);
        case 'GET_MY_TEST_TAB':
            return state.set('test_tab', action.test_tab);
        case 'GET_ABILITY_STATUS_SUCCESS':
            return state.set('capatity', Immutable.fromJS(action.json)).set('isFetching', false);
        case 'GET_LADDER_STATUS_SUCCESS':
            return state.set('ladder', Immutable.fromJS(action.json)).set('isFetching', false);
        case 'GET_COMUSED_KP_SUCCESS':
            return state.set('comusedkp', Immutable.fromJS(action.json)).set('isFetching', false);
        case 'GET_KP_LADDER_STATUS_SUCCESS':
            return state.set('kpladder', Immutable.fromJS(action.json)).set('isFetching', false);
        case 'GET_KP_ABILITY_STATUS_SUCCESS':
            return state.set('kpcapatity', Immutable.fromJS(action.json)).set('isFetching', false);   
        default:
            return state;
    }
}

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
        test_id: null,
        exercise_log: [{exercise_status: 0, exercise_state: -1}],
        test_kp: [],
        test_reward: {
            rating:{old_student_rating: 0, delta_student_rating: 0}, 
            score : [],
            kp_rating: []
        },
        isfromxcx : null,
    });
const defaulatStudentData = Immutable.fromJS({
        isFetching: false,
        //个人信息
        realname:null,
        group:[{group_id:1,group_name:''}],
        imgurl:null,
        score:0,

        student_rating: 0,
        course_id: 3,
        course: [{course_id: 3, course_name: '基本乐理'}],
        //学情
        books: [],

        chapter: {
            chapterid: null,
            chapter_status: {chaptername: '', chapter_mastery: 0, kp_mastery_count: 0, practice: 0, correct:0},
            kp_status: [],
        },

        my_test_list: [],
        my_uncompleted_test: [],
        
        //底部栏
        tab: '',
        test_tab:'',

        //总体
        capatity: [],
        rating_history : [],

        //单个知识点
        kpladder : [],
        kpcapatity: {},

        poorkp : [],
    });

//手动获取数据
export const testData = (state = defaulatTestData, action = {}) => {
    console.log("action.type: "+action.type);
    switch(action.type){
        case 'UPDATE_FROM_XCX':
            return state.set('isfromxcx', action.isfromxcx);
        case 'SET_LOADING':
            return state.set('isLoading', action.is_loading);
        case 'GET_TEST_START':
            return state.set('isFetching', true);
        case 'GET_TEST_STATUS':
            return state.set('test_status', Immutable.fromJS(action.test_status));
        case 'GET_TEST_RANKING_LIST':
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
                .set('exercise_st', new Date())
                .set('isFetching', false);
            break;

        case 'SUBMIT_EXERCISE_LOG_SUCCESS':
            return state.setIn(['exercise_log', action.exindex], Immutable.fromJS(action.exercise_log));
        case 'GET_MY_TEST_SUCCESS':
            return state.set('exercise', Immutable.fromJS(action.exercise))
                // .set('test_log', Immutable.fromJS(test_log))
                .set('test_id', action.test_id)
                .set('test_log', Immutable.fromJS(action.test_log))
                .set('exercise_log', Immutable.fromJS(action.exercise_log))
                .set('exercise_st', new Date())
                .set('isFetching', false);
            break;

        case 'GET_TEST_EXERCISE_SUCCESS':
            return state.set('exercise', Immutable.fromJS(action.json)).set('isFetching', false);
        case 'GET_TEST_RATING_REWARD':
            return state.set('test_reward', Immutable.fromJS(action.json));
        case 'GET_MY_TEST_STATUS':
            return state.set('test_kp', Immutable.fromJS(action.test_kp))
                .set('isFetching', false);
        case 'UPDATE_ENTRY': 
            return state.set('entry', action.entry);
        case 'UPDATE_EXINDEX':
            return state.set('exindex', action.exindex).set('exercise_st', new Date());
        case 'UPDATE_EXERCISE_STATUS':
            return state.setIn(['exercise_log', action.exindex, 'exercise_status'], action.exercise_status);
        case 'UPDATE_EXERCISE_TIME':
            return state.updateIn(['exercise_log', action.i, 'ac_time'], ac_time => ac_time + action.ac_time);
        case 'UPDATE_FINISH_TIME':
            return state.setIn(['test_log', "finish_time"], new Date());
        case 'SHOW_ANSWER_TEST':
            return state.setIn(["exercise_log", action.exindex, 'exercise_status'], 1);
        case 'OPEN_MODAL':
            return state.set('modalOpen', action.isOpen);
        // case 'SUBMIT_EXERCISE_LOG':
        //     const exindex = state.get('exindex');
        //     return state.mergeDeepIn(['exercise_log', exindex], Immutable.fromJS(action.exercise_log)).set("modalOpen", true);
        case 'EXERCISE_INPUT_CHANGE':
            return state.setIn(['exercise_log', action.exindex, 'answer', action.index, 'fill'], action.value)
        case 'EXERCISE_SELECT_CHANGE':
            console.log("EXERCISE_SELECT_CHANGE: "+action.index);
            return state.updateIn(['exercise_log', action.exindex, 'answer', action.index, 'select'], select => !select)
        case 'BREAKDOWN_SN_SELECT_CHANGE':
            const val = action.index;

            var breakdown_log = state.getIn(['exercise_log', action.exindex, 'breakdown_sn']).toJS();
            var breakdown = state.getIn(['exercise', action.exindex, 'breakdown']).toJS();
            breakdown_log[val].sn_state = breakdown_log[val].sn_state ? 0 : 1;
            //取消选择，将以这步作为前置的步骤全部设为不确定-1并不渲染显示
            for(var i = 0; i < breakdown.length; i++){
                if(breakdown[i].presn == breakdown[val].sn){
                    //如果选择则把二级知识点设置为0，如果取消选择则把二级知识点设置为-1
                    breakdown_log[i].sn_state = breakdown_log[val].sn_state ? 0 : -1;
                }
            }
            return state.setIn(['exercise_log', action.exindex, 'breakdown_sn'], Immutable.fromJS(breakdown_log));
        case 'SUBMIT_FEEDBACK_SUCCESS':
            return state.setIn(['exercise_log', action.exindex], Immutable.fromJS(action.exercise_log));
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
        case 'GET_STATUS_START':
            return state.set('isFetching', true);
        case 'GET_STUDENT_INFO_SUCCESS':
            return state.set('realname', action.json.realname)
                        .set('group',  Immutable.fromJS(action.json.group))
                        .set('imgurl', action.json.avatar)
                        .set('score', action.json.score)
                        .set('isFetching', false);
        case 'UPDATE_STU_NAME':
            return state.set('realname', action.data);
        case 'GET_MY_RATING':
            return state.set('student_rating', action.json).set('isFetching', false);
        case 'GET_COURSE':
            var course = [];
            for(var i = 0; i < action.course.length; i++){
                course.push({value: action.course[i].course_id, label: action.course[i].course_name});
            }
            return state.set('course', course).set('isFetching', false);
        case 'SELECT_COURSE':
            return state.set('course_id', action.course_id); 
        case 'GET_MY_CHAPTER_SUCCESS':
            return state.set('books', Immutable.fromJS(action.json)).set('isFetching', false);
        case 'GET_CHAPTER_NAME_SUCCESS':
            return state.setIn(['chapter', 'chaptername'], action.json.chaptername).set('isFetching', false);
        case 'GET_CHAPTER_STATUS_SUCCESS':
            return state.setIn(['chapter', 'status'], action.json).set('isFetching', false);
        case 'GET_CHAPTER_KP_SUCCESS':
            return state.set('chapter', action.json);
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
        case 'GET_RATING_HISTORY':
            console.log(action.json);
            return state.set('rating_history', Immutable.fromJS(action.json)).set('isFetching', false);
        case 'GET_STU_POORKP':
            return state.set('poorkp', Immutable.fromJS(action.json)).set('isFetching', false);
        case 'GET_KP_RATING_HISTORY':
            return state.set('kpladder', Immutable.fromJS(action.json)).set('isFetching', false);
        case 'GET_KP_ABILITY':
            return state.set('kpcapatity', Immutable.fromJS(action.json)).set('isFetching', false);  
         case 'FETCH_SUCCESS':
            return state.set('isFetching', false);  
             
        default:
            return state;
    }
}

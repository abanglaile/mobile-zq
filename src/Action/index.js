import NetUtil from '../utils/NetUtil'
import {push} from 'react-router-redux'
import config from '../utils/Config'
import jwtDecode from 'jwt-decode';
import { checkHttpStatus, parseJSON } from '../utils';


let target = config.server_url;

/*-------------------------------------------------*/
//登录注册相关action
export const loginUserSuccess = (token) => {
  localStorage.setItem('token', token);
  return {
    type: 'LOGIN_USER_SUCCESS',
    payload: {
      token: token
    }
  }
}

export const regUserSuccess = (token) =>  {
  localStorage.setItem('token', token);
  return {
    type: 'REG_USER_SUCCESS',
    payload: {
      token: token
    }
  }
}

export const loginUserFailure = (error) => {
  localStorage.removeItem('token');
  return {
    type: 'LOGIN_USER_FAILURE',
    payload: {
      status: error.response.status,
      statusText: error.response.statusText
    }
  }
}

export const regUserFailure = (error) => {
  localStorage.removeItem('token');
  return {
    type: 'REG_USER_FAILURE',
    payload: {
      status: error.response.status,
      statusText: error.response.statusText
    }
  }
}

export const loginUserRequest = () => {
  return {
    type: 'LOGIN_USER_REQUEST',
  }
}

export const regUserRequest = () => {
  return {
    type: 'REG_USER_REQUEST',
  }
}
// export function getTestCenter() {
//   return {
//     type: GET_TESTCENTER_DATA
    
//   }
// }

export const logout = () => {
    localStorage.removeItem('token');
    return {
        type: 'LOGOUT_USER',
    }
}

export const logoutAndRedirect = () => {
    return (dispatch, state) => {
        dispatch(logout());
        dispatch(push('/mobile-zq/login'));
    }
}

export const loginUser = (username, password, redirect) => {
    return function(dispatch) {
        let path = '/login';
        let url = target + path;

        dispatch(loginUserRequest());
        return fetch(url, {
            method: 'post',
            mode: "cors",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
                body: JSON.stringify({username: username, password: password})
            })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {
                try {
                    let decoded = jwtDecode(response.token);
                    console.log('decoded:'+JSON.stringify(decoded));
                    console.log('response.token:'+response.token);
                    dispatch(loginUserSuccess(response.token));
                    dispatch(push(redirect));
                } catch (e) {
                    console.log('response.json():'+response.json());
                    dispatch(loginUserFailure({
                        response: {
                            status: 403,
                            statusText: response.json()
                        }
                    }));
                }
            })
            .catch(error => {
                console.log('error:'+error);
                dispatch(loginUserFailure(error));
            })
    }
}

export const regUser = (username, password, redirect) => {
    return function(dispatch) {
        let path = '/newuser';
        let url = target + path;
        dispatch(regUserRequest());
        return fetch(url, {
            method: 'post',
            mode: "cors",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
                body: JSON.stringify({username: username, password: password})
            })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {
                try {
                    let decoded = jwtDecode(response.token);
                    dispatch(regUserSuccess(response.token));
                    dispatch(push(redirect));
                } catch (e) {
                    dispatch(regUserFailure({
                        response: {
                            status: 403,
                            statusText: response.json()
                        }
                    }));
                }
            })
            .catch(error => {
                dispatch(loginUserFailure(error));
            })
    }
}
//登录注册相关结束
/*-------------------------------------------------*/


//利用elo_rating方法更新rating
function elo_rating(Ra, Rb){
    const m = (Rb - Ra)/400;
    return 1/(1 + Math.pow(10, m));
}

//开始获取测试数据
const getDataStart = () => {
  return {
    type: 'GET_DATA_START',
  }
}

//开始获取测试数据
const getTestStart = () => {
  return {
    type: 'GET_TEST_START',
  }
}
//开始获取学生学情数据
const getStatusStart = () => {
  return {
    type: 'GET_STATUS_START',
  }
}

//获取测试数据成功
const getMyTestSuccess = (json) => {
  return {
    type: 'GET_MYTEST_SUCCESS',
    json,
  }
}

//获取测试数据成功
const getTestSuccess = (json, test_id) => {
  return {
    type: 'GET_TEST_SUCCESS',
    json,
    test_id,
  }
}

//获取测试数据成功
const getTestExerciseSuccess = (json) => {
  return {
    type: 'GET_TEST_EXERCISE_SUCCESS',
    json,
  }
}

const getTestStatusSuccess = (json, test_id, isFinish) => {
    return {
        type: 'GET_TEST_STATUS_SUCCESS',
        json,
        test_id,
        isFinish,
    }
}

const getStuTestInfoSuccess = (json) => {
    return {
        type: 'GET_STU_TESTINFO_SUCCESS',
        json,
    }
}

const getTestRankingListSuccess = (json) => {
    return {
        type: 'GET_TEST_RANKLIST_SUCCESS',
        json,
    }
}

const getStuAbilitySuccess = (json) => {
    return {
        type: 'GET_ABILITY_STATUS_SUCCESS',
        json,
    }
}

const getStuLadderSuccess = (json) => {
    return {
        type: 'GET_LADDER_STATUS_SUCCESS',
        json,
    }
}


//成功获取测试结果数据
const getTestResultSuccess = (json) => {
    return {
        type: 'GET_TEST_RESULT_SUCCESS',
        json,
    }
}

//成功获取题目样本
const getExerciseSampleSuccess = (json) => {
    console.log(json);
    return {
        type: 'GET_EXERCISE_SAMPLE_SUCCESS',
        json,
    }
}

//获取测试数据成功
const getChapterSuccess = (json) => {
  return {
    type: 'GET_CHAPTER_SUCCESS',
    json,
  }
}


/*-------------------------------------------------*/

//获取章节数据
export const getMyChapter = (student_id, course_id) => {
    let url = target + '/klmanager/getBookChapter';
    return dispatch => {
        dispatch(getDataStart());
        return NetUtil.get(url, {student_id, course_id}, json => {
            console.log(json);
            dispatch(getChapterSuccess(json));
        }, errors => {
            console.log(errors);
        });
    }
}

/*----------------------个人中心--------------------*/

//获取指定测试数据
export const getTestExercise = (student_id, test_id) => {
    let url = target + '/klmanager/getExerciseByTest';
    console.log(student_id, test_id);
    return dispatch => {
        dispatch(getTestStart());
        return NetUtil.get(url, {test_id, student_id}, json => {
            console.log(json);
            dispatch(getTestExerciseSuccess(json));
        }, errors => {
            console.log(errors);
        });
    }
}

//获取指定测试的数据
export const getTestData = (student_id, test_id) => {
    let url = target + '/klmanager/getExerciseByTest';
    console.log(student_id, test_id);
    return dispatch => {
        dispatch(getTestStart());
        return NetUtil.get(url, {test_id, student_id}, json => {
            console.log(json);
            dispatch(getTestSuccess(json, test_id));
            dispatch(push("/mobile-zq/Question"));
            dispatch(updateExerciseST());
        }, errors => {
            console.log(errors);
        });
    }
}

//获取测试列表
export const getMyTestList = (student_id) => {
    let url = target + '/klmanager/getMyTest';
    return dispatch => {
        dispatch(getDataStart());
        return NetUtil.get(url, {student_id}, json => {
            dispatch(getMyTestSuccess(json));
        }, errors => {
            console.log(errors);
        });
    }
}

export const submitFeedBack = (exindex) => {
    console.log(exindex);
    return {
        type: 'SUBMIT_FEEDBACK',
        exindex,
    }
}

/**
 * 提交后跳转到下一题
 * @param  {Boolean} answer_test [true:当前为导学页面/false:当前不为导学页面]
 */
export const jumpNext = (answer_test) => {
    console.log('jumpNext');
    return (dispatch, getState) => {
        const testData = getState().testData;
        const exindex = testData.get("exindex");
        const test_log = testData.get("test_log").toJS();
        const exercise = testData.get("exercise").toJS();
        const {exercise_state} = test_log[exindex];
        const blength = exercise[exindex].breakdown.length;

        if(answer_test || exercise_state || blength == 1){
            
            var next = -1;
            var i = (exindex + 1)%exercise.length;
            while(i != exindex){
                if(test_log[i].exercise_state < 0){
                    next = i;
                    break;
                }
                i = ++i%exercise.length;
            }
            console.log('next' + next);
            //还有未完成的题目
            if(next >= 0){
                console.log('update');
                dispatch(closeModal());
                dispatch(updateExindex(next));
                dispatch(updateExerciseST());
                //dispatch(push("/mobile-zq/Question"));
            }
            //题目全部完成
            else{
                //测试完成，记录测试结束时间
                dispatch(updateFinishTime());
                const testData = getState().testData.toJS();
                console.log(testData);
                dispatch(submitTestStart());
                let url = target + '/klmanager/submitTest';

                /**
                 * [提交后台测试数据]
                 */
                const test_result = {
                    test_id: testData.test_id,
                    test_log: testData.test_log,
                    start_time: testData.start_time,
                    finish_time: testData.finish_time,
                }
                return NetUtil.post(url, {student_id: '1', student_rating: 500, test_result: test_result}, json => {
                    console.log(json);
                    dispatch(submitTestSuccess(json));
                    dispatch(push("/mobile-zq/kpTestResult"));
                }, errors => {
                    console.log(errors);
                });
            }
        }else{
            console.log('jump');
            dispatch(closeModal());
            dispatch(showAnswerTest(exindex));
            //dispatch(push("/mobile-zq/AnswerTest"));
        }
    }
}

export const showAnswerTest = (exindex) => {
    console.log(exindex);
    return {
        type: 'SHOW_ANSWER_TEST',
        exindex,
    }
}

// export const hideAnswerTest = (exindex) => {
//     return {
//         type: 'HIDE_ANSWER_TEST',
//         exindex,
//     }
// }

export const hideFeedbackToast = () => {
    console.log('hideFeedbackToast');
    return {
        type: 'HIDE_FEEDBACK_TOAST'
    }
}

export const closeModal = () => {
    return {
        type: 'CLOSE_MODAL',
    }
}

//更新题目数
export const updateExindex = (exindex) => {
    return {
        type: 'UPDATE_EXINDEX',
        exindex,
    }
}

const updateFinishTime = () => {
    return {
        type: 'UPDATE_FINISH_TIME',
    }
}

export const updateExerciseTime = (i, ac_time) => {
    console.log(ac_time);
    return {
        type: 'UPDATE_EXERCISE_TIME',
        i,
        ac_time,
    }
}

//更新题目开始时间
export const updateExerciseST = () => {
    return {
        type: 'UPDATE_EXERCISE_ST',
    }
}

//提交单题测试结果
export const updateTestLog = (test_log) => {
    return {
        type: 'UPDATE_TEST_LOG',
        test_log,
    }
}

//开始提交测试结果
const submitTestStart = () => {
  return {
    type: 'SUBMIT_TEST_START',
  }
}

//提交测试结果成功
const submitTestSuccess = (json) => {
  return {
    type: 'SUBMIT_TEST_SUCCESS',
    json,
  }
}

const checkAnswer = (exercise_type, log_answer) => {
    var result = 1;
    switch(exercise_type){
        case 0:
            //填空题
            for(var i = 0; i < exAnswer.length; i++){
                if(userAnswer && userAnswer[i]){
                    //去掉首尾标识字符
                    const length = exAnswer[i].length;
                    const checkAnswer = exAnswer[i].substr(1, length - 2);
                    if(checkAnswer != userAnswer[i]){
                        console.log("wrong");
                        result = 0;
                        break;
                    }
                }else{
                    console.log("wrong");
                    result = 0;
                    break;
                }
            }
            break;
        case 1:
            for(var i = 0; i < log_answer.length; i++){
                if(log_answer[i].correct != log_answer[i].select){
                    return 0;
                }
            }
            // const xornum = [1, 2, 4, 8];
            // var checkAnswer = 0;
            // for(var i = 0; i < exAnswer.length; i++){
            //     if(exAnswer[i].correct)
            //     checkAnswer += xornum[i];
            // }
            // //选择题
            // if(userAnswer != exAnswer){
            //     result = 0;
            // }
            break;
        case 2:
            for(var i = 0; i < log_answer.length; i++){
                if(log_answer[i].correct != log_answer[i].select){
                    return 0;
                }
            }
            break;
        default:
            break;
    }
    return result;
}

/**
 * [修改题目选项]
 */
export const selectChange = (exindex, index) => {
    return{
        type: 'EXERCISE_SELECT_CHANGE',
        exindex,
        index,
    } 
}

/**
 * [修改反馈选项]
 */
export const breakdownSelectChange = (exindex, index) => {
    return{
        type: 'BREAKDOWN_SN_SELECT_CHANGE',
        exindex,
        index,
    } 
}



/**
 * [提交单题测试结果]
 */
export const submitExerciseLog = (exercise, log_answer, student_rating) => {
    const {exercise_id, answer, exercise_type, exercise_rating, breakdown} = exercise;
    const result = checkAnswer(exercise_type, log_answer);
    // student_rating = 500;

    //计算学生、题目得分
    const st_delta = elo_rating(student_rating, exercise_rating);
    const ex_delta = elo_rating(exercise_rating, student_rating);

    const K = 32;
    const ex_SA = result ? 0 : 1;
    const st_SA = result ? 1 : 0;

    var breakdown_sn = [];
    const exercise_log = {
            exercise_id: exercise_id, 
            exercise_state: result,
            submit_time: new Date(),
            old_exercise_rating: exercise_rating,
            old_student_rating: student_rating,
            delta_exercise_rating: Math.ceil(K*(ex_SA - ex_delta)), 
            delta_student_rating: Math.ceil(K*(st_SA - st_delta)),
        };
    if(result){
        for(var i = 0; i < breakdown.length; i++){
            breakdown_sn[i] = {
                sn: breakdown[i].sn, 
                kpid: breakdown[i].kpid, 
                kpname: breakdown[i].kpname,
                sn_state: 1, 
                kp_old_rating: breakdown[i].kp_rating, 
                sn_old_rating: breakdown[i].sn_rating
            };
        }
        exercise_log.breakdown_sn = breakdown_sn;
    }else if(breakdown.length == 1){
        breakdown_sn[0] = {
            sn: 0,
            kpid: breakdown[0].kpid,
            kpname: breakdown[0].kpname,
            sn_state: 0,
            kp_old_rating: breakdown[0].kp_rating,
            sn_old_rating: breakdown[0].sn_rating
        }
        exercise_log.breakdown_sn = breakdown_sn;
    }
    return{
        type: 'SUBMIT_EXERCISE_LOG',
        exercise_log: exercise_log,
    }
}

export const getStudentData = (student_id) => {
    return (dispatch) => {
        dispatch(getDataStart());
        let url = target + '/klmanager/getStudentData';
        return NetUtil.post(url, {test_id, student_id}, json => {
            console.log(json);
            dispatch(getStudentDataSuccess(json));
        }, errors => {
            console.log(errors);
        });
    }
}

export const getTestStatus = (student_id, test_id) => {
    return (dispatch) => {
        dispatch(getTestStart());
        let url = target + '/klmanager/getTestStatus';
        return NetUtil.post(url, {test_id}, json => {
            dispatch(getTestStatusSuccess(json, test_id));
        }, errors => {
            console.log(errors);
        });
    }
}

export const getTestRankingList = (test_id) => {
    return (dispatch) => {
        dispatch(getTestStart());
        let url = target + '/klmanager/getTestRankingList';
        return NetUtil.post(url, {test_id}, json => {
            dispatch(getTestRankingListSuccess(json));
        }, errors => {
            console.log(errors);
        });
    }
}

export const getStuTestInfo = (student_id,test_id) => {
    return (dispatch) => {
        let url = target + '/klmanager/getStuTestInfo';
        return NetUtil.post(url, {student_id,test_id}, json => {
            dispatch(getStuTestInfoSuccess(json));
        }, errors => {
            console.log(errors);
        });
    }
}
//获取学生综合能力情况
export const getStuAbility = (student_id) => {
    return (dispatch) => {
        dispatch(getStatusStart());
        let url = target + '/klmanager/getStuAbility';
        return NetUtil.get(url, {student_id}, json => {
            dispatch(getStuAbilitySuccess(json));
        }, errors => {
            console.log(errors);
        });
    }
}
//获取学生天梯分数变化情况
export const getStuLadder = (student_id) => {
    return (dispatch) => {
        dispatch(getStatusStart());
        let url = target + '/klmanager/getStuLadder';
        return NetUtil.get(url, {student_id}, json => {
            dispatch(getStuLadderSuccess(json));
        }, errors => {
            console.log(errors);
        });
    }
}


export const getTestResult = (student_id, test_id) => {
    return (dispatch) => {
        dispatch(getDataStart());
        let url = target + '/klmanager/getTestResult';
        return NetUtil.post(url, {student_id, test_id}, json => {
            console.log(json);
            dispatch(getTestResultSuccess(json));
            // dispatch(push("/mobile-zq/testResult"));
        }, errors => {
            console.log(errors);
        });
    }
}

export const getChapter = (student_id, course_id) => {
    return (dispatch) => {
        dispatch(getDataStart());
        let url = target + '/klmanager/getChapter';
        return NetUtil.post(url, {student_id, course_id}, json => {
            console.log(json);
            dispatch(getChapterSuccess(json));
        }, errors => {
            console.log(errors);
        });
    }
}

//根据sample_id获取题目信息
export const getExerciseSample = (exercise_id) => {
    let url = target + '/klmanager/getExerciseSample';
    return dispatch => {
        dispatch(getDataStart());
        //TO-DO：指定样本参数
        return NetUtil.get(url, {exercise_id}, json => {
            dispatch(getExerciseSampleSuccess(json));
        }, errors => {
            console.log(errors);
        });
    }
}



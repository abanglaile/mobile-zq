import {push} from 'react-router-redux'
import config from '../utils/Config'
import axios from 'axios';
import { Toast } from 'antd-mobile';

import * as qiniu from 'qiniu-js'
import wx from 'weixin-js-sdk';


let target = config.server_url;


// /*-------------------------------------------------*/

//利用elo_rating方法更新rating
function elo_rating(Ra, Rb){
    const m = (Rb - Ra)/400;
    return 1/(1 + Math.pow(10, m));
}

//开始获取测试数据
const setLoading = (is_loading) => {
    return {
      type: 'SET_LOADING',
      is_loading,
    }
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

//获取未完成的测试数据成功
const getMyUncompletedTestSuccess = (json) => {
  return {
    type: 'GET_MY_UNCOMPLETEDTEST_SUCCESS',
    json,
  }
}

//获取测试数据成功
const getTestSuccess = (json, test_type) => {
    console.log(json.test_id);
  return {
    type: 'GET_TEST_SUCCESS',
    exercise: json.exercise,
    test_id: json.test_id,
    test_type,
    student_rating: json.student_rating,
  }
}

const getMyTestDataSuccess = (json) => {
console.log(json);
  return {
    type: 'GET_MY_TEST_SUCCESS',
    exercise: json.exercise,
    test_id: json.test_id,
    exercise_log : json.exercise_log,
    test_log : json.test_log,
  }
}

//获取测试数据成功
const getTestExerciseSuccess = (json) => {
  console.log(json);
  return {
    type: 'GET_TEST_EXERCISE_SUCCESS',
    json,
  }
}


const getStuTestInfoSuccess = (json) => {
    return {
        type: 'GET_STU_TESTINFO_SUCCESS',
        json,
    }
}

const getStuAbilitySuccess = (json) => {
    return {
        type: 'GET_ABILITY_STATUS_SUCCESS',
        json,
    }
}

// const getKpRatingHistory = (json) => {
//     return {
//         type: 'GET_KP_LADDER_STATUS_SUCCESS',
//         json,
//     }
// }
const getStuKpAbilitySuccess = (json) => {
    return {
        type: 'GET_KP_ABILITY_STATUS_SUCCESS',
        json,
    }
}

//成功获取学生个人情况信息
const getStudentInfoSuccess = (json) => {
    return {
        type: 'GET_STUDENT_INFO_SUCCESS',
        json,
    }
}

//获取测试数据成功
const getMyChapterSuccess = (json) => {
  return {
    type: 'GET_MY_CHAPTER_SUCCESS',
    json,
  }
}

//获取我的天梯分数成功
const getMyScoreSuccess = (json) => {
    console.log(json);
  return {
    type: 'GET_MY_SCORE_SUCCESS',
    json,
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

//获取章节名称成功
const getChapterNameSuccess = (json) => {
  return {
    type: 'GET_CHAPTER_NAME_SUCCESS',
    json,
  }
}

//获取章节状态成功
const getChapterStatusSuccess = (json) => {
  return {
    type: 'GET_CHAPTER_STATUS_SUCCESS',
    json,
  }
}

//获取章节知识点状态成功
const getChapterKpSuccess = (json) => {
  return {
    type: 'GET_CHAPTER_KP_SUCCESS',
    json,
  }
}

/*-------------------------------------------------*/



//记录底部标签栏 selected bar 的状态(blueTab RedTab..)
export const setSelectedTab = (tab) => {
     return {
        type: 'GET_SELECTED_TAB',
        tab,
    }
}

//记录mytest 做题历史被选中的tab状态(0 or 1)
export const setMyTestTab = (test_tab) => {
    return {
        type: 'GET_MY_TEST_TAB',
        test_tab,
    }
}

export const selectCourse = (course_id) => {
    return {
        type: 'SELECT_COURSE',
        course_id,
    }
}

//获取我的天梯总分
export const getMyStudentRating = (student_id, course_id) => {
    let url = target + "/getMyStudentRating";
    console.log(student_id, course_id);
    return (dispatch) => {
        dispatch(setLoading(true));
        return axios.get(url,{
                params:{
                   student_id,
                   course_id,
                }
        })
        .then(function (response) {
            console.log(response.data);
            dispatch({
                type: 'GET_MY_RATING',
                json: response.data,
            })
            dispatch(setLoading(false));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}


//获取我的章节数据
export const getMyBookChapter = (student_id, course_id) => {
    let url = target + "/getMyBookChapter";
    return (dispatch) => {
        dispatch(setLoading(true));
        return axios.get(url,{
                params:{
                   student_id,
                   course_id,
                }
        })
        .then(function (response) {
            dispatch(getMyChapterSuccess(response.data));
            dispatch(setLoading(false));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const getCourse = () => {
    let url = target + "/getCourse";
    return (dispatch) => {
        return axios.get(url).then(function(response){
            dispatch({
                type: 'GET_COURSE',
                course: response.data,
            })            
        })
    }
}

//获取章节名称
export const getChapterName = (chapter_id) => {
    let url = target + "/getChapterName";
    return (dispatch) => {
        dispatch(getDataStart());
        return axios.get(url,{
                params:{
                   chapter_id,
                }
        })
        .then(function (response) {
            dispatch(getChapterNameSuccess(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

//获取章节正确率、练习次数
export const getChapterStatus = (student_id, chapter_id) => {
    let url = target + "/getChapterStatus";
    return (dispatch) => {
        dispatch(getDataStart());
        return axios.get(url,{
                params:{
                   student_id,
                   chapter_id,
                }
        })
        .then(function (response) {
            dispatch(getChapterStatusSuccess(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

//获取章节知识点状态
export const getChapterKpStatus = (student_id, chapter_id) => {
    let url = target + "/getChapterKpStatus";
    return (dispatch) => {
        // dispatch(getDataStart());
        return axios.get(url,{
                params:{
                   student_id,
                   chapter_id,
                }
        })
        .then(function (response) {
            console.log(response.data);
            dispatch(getChapterKpSuccess(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}


/*----------------------个人中心--------------------*/

//获取指定测试数据
export const getTestExercise = (student_id, test_id) => {
    let url = target + "/getExerciseByTest";
    return (dispatch) => {
        dispatch(setLoading(true));
        return axios.get(url,{
                params:{
                   test_id,
                   student_id,
                }
        })
        .then(function (response) {
            dispatch(getTestExerciseSuccess(response.data.exercise));
            dispatch(setLoading(false));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}


//获取指定测试的数据
export const getTestData = (student_id, test_id, test_type, entry) => {
    let url = target + "/getExerciseByTest";
    return (dispatch) => {
        dispatch(setLoading(true));
        return axios.get(url,{
                params:{
                   test_id,
                   student_id,
                }
        })
        .then(function (response) {
            dispatch(getMyScoreSuccess(response.data));
            dispatch(getTestSuccess(response.data, test_type));
            dispatch(push("/mobile-zq/question"));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

//根据 testid 获取测试信息  （新接口）
export const getMyTestData = (student_id, test_id) => {
    let url = target + "/getMyTestData";
    return (dispatch) => {
        dispatch(setLoading(true));
        return axios.get(url,{
                params:{
                   test_id,
                   student_id,
                }
        })
        .then(function (response) {
            // dispatch(getMyScoreSuccess(response.data));
            dispatch(getMyTestDataSuccess(response.data));
            dispatch(setLoading(false));
            // dispatch(push("/mobile-zq/question"));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const getTestKpReward = (student_id, test_id) => {
    let url = target + "/getTestKpReward";
    return (dispatch) => {
        dispatch(getDataStart());
        return axios.get(url,{
            params: {student_id, test_id}
        }).then(function (response) {
            dispatch(getTestKpRewardSuccess(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const getTestRatingReward = (student_id, test_id) => {
    let url = target + "/getTestRatingReward";
    return (dispatch) => {
        dispatch(getDataStart());
        return axios.get(url, {
            params: {student_id, test_id}
        }).then(function (response) {
            dispatch({
                type: 'GET_TEST_RATING_REWARD',
                json: response.data,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

//根据kpid获得该主测点下的试题
export const generateTestByKp = (student_id, kpid, kpname, course_id) => {
    let url = target + "/generateTestByKp";
    return (dispatch) => {
        dispatch(setLoading(true));
        return axios.post(url, {
                   student_id,
                   kpid,
                   kpname, 
                   course_id,
                })
        .then(function (response) {
            dispatch({type: 'FETCH_SUCCESS'});
            dispatch(push("/mobile-zq/question/" + response.data.test_id));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

//获取我的历史做题记录
export const getHistoryTest = (student_id) => {
    let url = target + "/getHistoryTest";
    return (dispatch) => {
        dispatch(getDataStart());
        return axios.get(url,{
                params:{
                   student_id,
                }
        })
        .then(function (response) {
            dispatch(getMyTestSuccess(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

//获取老师布置的未完成的作业
export const getNotFinishTest = (student_id) => {
    let url = target + "/getNotFinishTest";
    return (dispatch) => {
        dispatch(getDataStart());
        return axios.get(url,{
                params:{
                   student_id,
                }
        })
        .then(function (response) {
            dispatch(getMyUncompletedTestSuccess(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

//-------------------------------做题交互-------------------------------//

export const submitFeedback = (exercise_log, exindex) => {
    let url = target + "/submitFeedback";
    // console.log('exindex:',exindex);
    return (dispatch) => {
        dispatch(setLoading(true));
        return axios.post(url, {exercise_log, exindex})
        .then(function (response) {
            exercise_log = response.data
            dispatch({
                type: 'SUBMIT_FEEDBACK_SUCCESS',
                exercise_log,
                exindex,
            });
            dispatch(setLoading(false));
            dispatch(jumpNext(exercise_log))
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

/**
 * 提交后跳转到下一题
 * @param  exercise_status [0:未提交答案，1:已提交答案，2:已提交反馈]
 */
// export const gotoReport = () => {
//     return (dispatch) => {
//          wx.miniProgram.getEnv(function(res){
//             if(res.miniprogram){
//             //    or  window.wx.miniProgram.navigateTo
//                 wx.miniProgram.navigateTo({ url: `../details/index?id=${goodsId}`,success:function () {
//             }
//         }
//         }
//     }
// }
// }
export const updateFromXcx = (isfromxcx) => {
    return {
        type: 'UPDATE_FROM_XCX',
        isfromxcx,
    }
}

export const jumpNext = (exercise_log) => {
    return (dispatch,getState) => {
        const testData = getState().testData;
        const isfromxcx = testData.get("isfromxcx");
        console.log('isfromxcx:',isfromxcx);
        console.log("jumpNext", exercise_log)
        if(exercise_log.exercise_status == 2){
            if(exercise_log.next == -1){
                if(isfromxcx == 'xcx'){
                    wx.miniProgram.getEnv(function(res){
                        // console.log('res.miniprogram:',JSON.stringify(res.miniprogram));
                        if(res.miniprogram){
                          wx.miniProgram.navigateTo({ url: `/pages/report/report?id=${exercise_log.test_id}`,success:function () {
                          },fail:function (result) {
                              alert(result)
                          }})
                        }
                      });
                }else{
                    dispatch(push("/mobile-zq/kp_test_result/" + exercise_log.test_id));
                }
            }else{
                dispatch(updateExindex(exercise_log.next));
            }
        }
    }
    
    // return (dispatch, getState) => {
    //     const testData = getState().testData;
    //     const student_id = getState().AuthData.get('userid');
    //     const exindex = testData.get("exindex");
    //     const test_log = testData.get("test_log");
    //     const exercise_log = testData.get("exercise_log").toJS();
    //     const exercise = testData.get("exercise").toJS();
    //     const {exercise_status} = exercise_log[exindex];
    //     const test_id = testData.get("test_id");
    //     console.log("testData: ",JSON.stringify(testData));
    //     // console.log("testData test_log: ",JSON.stringify(test_log));
    //     console.log("jumpNext test_id: ",test_id);

    //     if(exercise_status == 2){
    //         var next = -1;
    //         var i = (exindex + 1)%exercise.length;
    //         while(i != exindex){
    //             if(exercise_log[i].exercise_status < 2){
    //                 next = i;
    //                 break;
    //             }
    //             i = ++i%exercise.length;
    //         }
    //         console.log('next' + next);
    //         //还有未完成的题目
    //         if(next >= 0){
    //             dispatch(updateExindex(next));
    //         }else{
    //             let url = target + "/submitTestLog";
    //             //提交整个Test
    //             return axios.post(url,{exercise_log})
    //             .then(function (response) {
    //                 dispatch(push("/mobile-zq/kp_test_result/" + test_id));
    //             })
    //         }
    //     }
    //     dispatch(closeModal());
    //     // console.log(exercise_status);
    //     // if(exercise_status > 0 || exercise_state || blength == 1){
    //     //     //跳过导学页面

    //     //     if(exercise_status == 0){
    //     //         console.log(exercise_status, exercise_state, blength);
    //     //         dispatch(updateExerciseStatus(exindex, 2));
    //     //     }

    //     //     var next = -1;
    //     //     var i = (exindex + 1)%exercise.length;
    //     //     while(i != exindex){
    //     //         if(exercise_log[i].exercise_state < 0){
    //     //             next = i;
    //     //             break;
    //     //         }
    //     //         i = ++i%exercise.length;
    //     //     }
    //     //     console.log('next' + next);
    //     //     //还有未完成的题目
    //     //     if(next >= 0){
    //     //         console.log('update');
                
    //     //         dispatch(updateExindex(next));
    //     //         // dispatch(updateExerciseST());
    //     //         //dispatch(push("/mobile-zq/question"));
    //     //     }
    //     //     //题目全部完成
    //     //     else{
    //     //         //测试完成，记录测试结束时间
    //     //         dispatch(updateFinishTime());
    //     //         const testData = getState().testData.toJS();
    //     //         console.log(testData);
    //     //         dispatch(submitTestStart());
    //     //         let url = target + '/submitTest';

    //     //         /**
    //     //          * [提交后台测试数据]
    //     //          */
    //     //         const test_result = {
    //     //             test_id: testData.test_log.test_id,
    //     //             exercise_log: testData.exercise_log,
    //     //             start_time: testData.test_log.start_time,
    //     //             finish_time: testData.test_log.finish_time,
    //     //         }
    //     //         console.log(test_result);
    //     //         return axios.post(url,{student_id: student_id, student_rating: 500, test_result: test_result})
    //     //         .then(function (response) {
    //     //             console.log(response.data);
    //     //             dispatch(submitTestSuccess(response.data));
    //     //             dispatch(push("/mobile-zq/kp_test_result/"+testData.test_log.test_id));
    //     //         })
    //     //         .catch(function (error) {
    //     //             console.log(error);
    //     //         });
    //     //     }
    //     // }else{
    //     //     console.log('jump');
    //     //     dispatch(closeModal());
    //     //     dispatch(showAnswerTest(exindex));
    //     //     //dispatch(push("/mobile-zq/AnswerTest"));
    //     // }
    // }
}


export const showAnswerTest = (exindex) => {
    console.log(exindex);
    return {
        type: 'SHOW_ANSWER_TEST',
        exindex,
    }
}

export const updateEntry = (entry) => {
    return {
        type: 'UPDATE_ENTRY',
        entry,
    }
}

export const closeModal = () => {
    return {
        type: 'OPEN_MODAL',
        isOpen: false
    }
}

//更新题目数
export const updateExindex = (exindex) => {
    console.log(exindex);
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

//更新题目页面状态
const updateExerciseStatus = (exindex, exercise_status) => {
    return{
        type: 'UPDATE_EXERCISE_STATUS',
        exindex,
        exercise_status,
    } 
}

//提交单题测试结果
export const updateTestLog = (exercise_log) => {
    return {
        type: 'UPDATE_exercise_log',
        exercise_log,
    }
}

const checkAnswer = (exercise_type, log_answer) => {
    var result = 1;
    switch(exercise_type){
        case 0:
            //填空题
            // for(var i = 0; i < exAnswer.length; i++){
            //     if(userAnswer && userAnswer[i]){
            //         //去掉首尾标识字符
            //         const length = exAnswer[i].length;
            //         const checkAnswer = exAnswer[i].substr(1, length - 2);
            //         if(checkAnswer != userAnswer[i]){
            //             console.log("wrong");
            //             result = 0;
            //             break;
            //         }
            //     }else{
            //         console.log("wrong");
            //         result = 0;
            //         break;
            //     }
            // }
            for(var i = 0; i < log_answer.length; i++){
                if(log_answer[i].fill != (log_answer[i].value)){
                    return 0;
                }
            }
            break;
        case 1:
            for(var i = 0; i < log_answer.length; i++){
                if(log_answer[i].correct != (log_answer[i].select ? true :false)){
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
                if(log_answer[i].correct != (log_answer[i].select ? true :false)){
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
 * [修改填空答案]
 */
export const inputChange = (exindex, index, value) => {
    return{
        type: 'EXERCISE_INPUT_CHANGE',
        exindex,
        index,
        value,
    } 
}

/**
 * [修改题目选项]
 */
export const selectChange = (exindex, index) => {
    console.log("selectChange+++++++++");
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

export const submitExerciseLogSuccess = (exercise_log, i) => {
    console.log(exercise_log);
    return {
        type: 'SUBMIT_EXERCISE_LOG_SUCCESS',
        exercise_log,
        i,
    }
}

export const submitExerciseLogByFile = (files, exercise_log, exercise_type, exindex) => {

    let config = {
        useCdnDomain: true,
        region: qiniu.region.z2
    };
    let putExtra = {
        fname: "",
        params: {},
        mimeType: null
    };
      
    let file = files[0].file;
    let key = exercise_log.exercise_id.toString() + "-" + new Date().getTime().toString();

    let token_url = target + "/getQiniuToken";
    return (dispatch) => {
        // dispatch(setLoading(true));
        return axios.get(token_url, {})
        .then(function (response) {
            const token = response.data
            let observer = {
                error(err){
                    console.log(err)
                    // ...
                }, 
                complete(res){
                    //console.log(res);
                    exercise_log.answer = "http://cdn.zhiqiu.pro/" + res.key
                    dispatch(submitExerciseLog(exercise_log, 3, exindex));  
                }
            }
            let observable = qiniu.upload(file, key, token, putExtra, config);
            observable.subscribe(observer)            
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const submitExerciseLog = (exercise_log, exercise_type, exindex) => {
    console.log("------------------------exindex :", exindex);

    let url = target + "/submitExerciseLog";
    return (dispatch) => {
        dispatch(setLoading(true));
        return axios.post(url,{exercise_log, exercise_type, exindex})
        .then(function (response) {
            const new_exercise_log = response.data
            console.log(new_exercise_log)
            dispatch({
                type: 'SUBMIT_EXERCISE_LOG_SUCCESS',
                exercise_log: new_exercise_log,
                exindex,
            });
            dispatch(setLoading(false));
            dispatch({
                type: 'OPEN_MODAL',
                isOpen: true
            })
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const selfCheck = (exercise_log, exercise_type, exercise_state, exindex) => {
    exercise_log.exercise_state = exercise_state;
    let url = target + "/submitExerciseLog";
    return (dispatch) => {
        return axios.post(url, {exercise_log, exercise_type})
        .then(function (response) {
            const new_exercise_log = response.data
            dispatch({
                type: 'SUBMIT_EXERCISE_LOG_SUCCESS',
                exercise_log: new_exercise_log,
                exindex,
            });
            dispatch({
                type: 'OPEN_MODAL',
                isOpen: true
            })    
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}




/**
 * [提交单题测试结果]
 */
export const submitExerciseLogOld = (exercise, log_answer, student_rating) => {
    const {exercise_id, answer, exercise_type, exercise_rating, breakdown} = exercise;
    console.log(exercise_rating, student_rating);
    const result = checkAnswer(exercise_type, log_answer);

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
            sn: breakdown[0].sn,
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

//------------------------测试相关接口--------------------------//

export const getTestStatus = (test_id) => {
    let url = target + "/getTestStatus";
    return (dispatch) => {
        dispatch(getTestStart());
        return axios.post(url,{test_id})
        .then(function (response) {
            dispatch({
                type: 'GET_TEST_STATUS',
                test_status: response.data,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const getTestRankingList = (test_id) => {
    let url = target + "/getTestRankingList";
    return (dispatch) => {
        dispatch(getTestStart());

        return axios.post(url,{test_id})
        .then(function (response) {
            console.log("ranking_list",response.data);
            dispatch({
                type: 'GET_TEST_RANKING_LIST',
                json: response.data,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const getMyTestStatus = (student_id, test_id) => {
    let url = target + "/getMyTestStatus";
    return (dispatch) => {
        dispatch(getDataStart());
        return axios.post(url,{student_id,test_id})
        .then(function (response) {
            // dispatch(getTestResultSuccess(response.data));
            console.log(response.data);
            dispatch({
                type: 'GET_MY_TEST_STATUS', 
                test_kp: response.data,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}
//---------------------------------个人中心开始----------------------------------------------
export const getStudentInfo = (student_id) => {
    let url = target + "/getStudentInfo";
    return (dispatch) => {
        dispatch(getDataStart());
        return axios.post(url,{student_id})
        .then(function (response) {
            dispatch({
                type: 'GET_STUDENT_INFO_SUCCESS',
                json: response.data,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const updateStuName = (userid,realname) => {
    let url = target + "/updateStuName";
    return (dispatch) => {
        return axios.post(url,{userid,realname})
        .then(function (response) {
            Toast.success('修改成功 !', 1);
            dispatch(push('/mobile-zq/root/percenter'));
            dispatch({
                type: 'UPDATE_STU_NAME',
                data: realname,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const addStuGroupId = (userid,group_id) => {
    let url = target + "/addStuGroupId";
    return (dispatch) => {
        return axios.post(url,{userid,group_id})
        .then(function (response) {
            if(response.data == 'failed'){
                Toast.fail('非法班级ID !!!', 1);
            }else{
                Toast.success('绑定成功 !', 1);
                dispatch(getStudentInfo(userid));
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

//---------------------------------个人中心结束----------------------------------------------

//获取学生综合能力情况
export const getStuAbility = (student_id, course_id) => {
    let url = target + "/getStuAbility";
    return (dispatch) => {
        dispatch(getStatusStart());
        return axios.get(url,{
            params:{
                student_id,
                course_id
            }
        })
        .then(function (response) {
            dispatch(getStuAbilitySuccess(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}
//获取学生天梯分数变化情况
export const getStuRatingHistory = (student_id, course_id) => {
    let url = target + "/getStuRatingHistory";
    return (dispatch) => {
        dispatch(getStatusStart());
        return axios.get(url,{
            params:{
                student_id,
                course_id
            }
        })
        .then(function (response) {
            dispatch({
                type: 'GET_RATING_HISTORY',
                json: response.data,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}
//获取学生某知识点天梯分数变化情况
export const getKpRatingHistory = (student_id,kpid) => {
    let url = target + "/getKpRatingHistory";
    return (dispatch) => {
        dispatch(getStatusStart());
        return axios.get(url,{
            params:{
                student_id,
                kpid,
            }
        })
        .then(function (response) {
            console.log(response.data);
            dispatch({
                type: 'GET_KP_RATING_HISTORY',
                json: response.data,
            })
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}
//获取学生某知识点天能力概况
export const getKpAbility = (student_id, kpid) => {
    let url = target + "/getKpAbility";
    return (dispatch) => {
        dispatch(getStatusStart());
        return axios.get(url,{
            params:{
                student_id,
                kpid,
            }
        })
        .then(function (response) {
            dispatch({
                type: 'GET_KP_ABILITY',
                json: response.data,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}
//获取学生经常使用知识点的情况
export const getStuPoorKp = (student_id) => {
    let url = target + "/getStuPoorKp";
    return (dispatch) => {
        dispatch(getStatusStart());
        return axios.get(url,{
            params:{
                student_id,
            }
        })
        .then(function (response) {
            dispatch({
                type: 'GET_STU_POORKP',
                json: response.data,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}



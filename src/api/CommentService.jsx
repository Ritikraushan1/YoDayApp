import axios from "axios";
import { Alert, Platform } from 'react-native';
import Config from 'react-native-config';
import * as YDAPI from '../constants/apiConstants';
import { UserService } from "./UserService";

async function getAllCommentsForPosts(postId) {
    let url = Config.API_URL + YDAPI.GET_COMMENTS + postId;
    const user = await UserService.getUserInformation();
    let tokenval = user?.token;
    console.log("detailsinuserinfo", user);
    let headers = {
        Authorization: `Bearer ${tokenval}`
    }
    return new Promise((resolve, reject) => {
        axios
            .get(url, { headers: headers })
            .then(response => {
                let result = '';
                console.log(response.status, response.data);
                switch (response.status) {
                    case 200:
                        result = {
                            status: response.status,
                            data: response.data,
                        };
                        break;
                    case 400:
                        result = {
                            status: response.status,
                            message: response.data.message,
                        };
                        break;
                    case 500:
                        result = {
                            status: response.status,
                            message: 'Server Error',
                        };
                        break;
                    default:
                        result = {
                            status: response.status,
                            message: 'unhandled',
                        };
                        break;
                }

                resolve(result);
            })
            .catch(err => {
                console.log("error", err)
                // alert(JSON.stringify(err));
                reject(err);
            });
    });
}

async function addNewComments(post_code, text, image = null) {
    let url = Config.API_URL + '/comments';
    const user = await UserService.getUserInformation();
    let tokenval = user?.token;
    let headers = {
        Authorization: `Bearer ${tokenval}`
    }
    let body_obj = {
        post_code: post_code,
        text: text,
        imageUrl: image,
    }
    return new Promise((resolve, reject) => {
        axios
            .post(url, body_obj, { headers: headers })
            .then(response => {
                let result = '';
                console.log(response.status, response.data);
                switch (response.status) {
                    case 200:
                        result = {
                            status: response.status,
                            data: response.data,
                        };
                        break;
                    case 400:
                        result = {
                            status: response.status,
                            message: response.data.message,
                        };
                        break;
                    case 500:
                        result = {
                            status: response.status,
                            message: 'Server Error',
                        };
                        break;
                    default:
                        result = {
                            status: response.status,
                            message: 'unhandled',
                        };
                        break;
                }

                resolve(result);
            })
            .catch(err => {
                console.log("error", err)
                // alert(JSON.stringify(err));
                reject(err);
            });
    });
}

async function addNewReplyToComments(post_code, text, commentId, image) {
    let url = Config.API_URL + YDAPI.COMMENTS_REPLY;
    const user = await UserService.getUserInformation();
    let tokenval = user?.token;
    let headers = {
        Authorization: `Bearer ${tokenval}`
    }
    let body_obj = {
        post_code: post_code,
        text: text,
        imageUrl: image,
        parentCommentId: commentId
    }
    return new Promise((resolve, reject) => {
        axios
            .post(url, body_obj, { headers: headers })
            .then(response => {
                let result = '';
                console.log(response.status, response.data);
                switch (response.status) {
                    case 200:
                        result = {
                            status: response.status,
                            data: response.data,
                        };
                        break;
                    case 400:
                        result = {
                            status: response.status,
                            message: response.data.message,
                        };
                        break;
                    case 500:
                        result = {
                            status: response.status,
                            message: 'Server Error',
                        };
                        break;
                    default:
                        result = {
                            status: response.status,
                            message: 'unhandled',
                        };
                        break;
                }

                resolve(result);
            })
            .catch(err => {
                console.log("error", err)
                // alert(JSON.stringify(err));
                reject(err);
            });
    });
}

async function addLikeToComment(commentId) {
    let url = Config.API_URL + YDAPI.COMMENTS + commentId + '/like';
    const user = await UserService.getUserInformation();
    let tokenval = user?.token;
    console.log("detailsinuserinfo", url);
    let headers = {
        Authorization: `Bearer ${tokenval}`
    }
    return new Promise((resolve, reject) => {
        axios
            .post(url, {}, { headers: headers })
            .then(response => {
                let result = '';
                console.log(response.status, response.data);
                switch (response.status) {
                    case 200:
                        result = {
                            status: response.status,
                            data: response.data,
                        };
                        break;
                    case 400:
                        result = {
                            status: response.status,
                            message: response.data.message,
                        };
                        break;
                    case 500:
                        result = {
                            status: response.status,
                            message: 'Server Error',
                        };
                        break;
                    default:
                        result = {
                            status: response.status,
                            message: 'unhandled',
                        };
                        break;
                }

                resolve(result);
            })
            .catch(err => {
                console.log("error", err)
                // alert(JSON.stringify(err));
                reject(err);
            });
    });
}

async function deleteLikeToComment(commentId) {
    let url = Config.API_URL + YDAPI.COMMENTS + commentId + '/like';
    const user = await UserService.getUserInformation();
    let tokenval = user?.token;
    console.log("detailsinuserinfo", url);
    let headers = {
        Authorization: `Bearer ${tokenval}`
    }
    return new Promise((resolve, reject) => {
        axios
            .delete(url, { headers: headers })
            .then(response => {
                let result = '';
                console.log(response.status, response.data);
                switch (response.status) {
                    case 200:
                        result = {
                            status: response.status,
                            data: response.data,
                        };
                        break;
                    case 400:
                        result = {
                            status: response.status,
                            message: response.data.message,
                        };
                        break;
                    case 500:
                        result = {
                            status: response.status,
                            message: 'Server Error',
                        };
                        break;
                    default:
                        result = {
                            status: response.status,
                            message: 'unhandled',
                        };
                        break;
                }

                resolve(result);
            })
            .catch(err => {
                console.log("error", err)
                // alert(JSON.stringify(err));
                reject(err);
            });
    });
}

async function addNewReportComments(commentId, type, subtype, text, post_code) {
    let url = Config.API_URL + '/comments/' + commentId + '/report';
    const user = await UserService.getUserInformation();
    let tokenval = user?.token;
    let headers = {
        Authorization: `Bearer ${tokenval}`
    }
    let body_obj = {
        post_code: post_code,
        notes: text,
        type: type,
        subtype: subtype
    }
    console.log("urlid", url);
    console.log("bosdyobh", body_obj);


    return new Promise((resolve, reject) => {
        axios
            .post(url, body_obj, { headers: headers })
            .then(response => {
                let result = '';
                console.log(response.status, response.data);
                switch (response.status) {
                    case 200:
                        result = {
                            status: response.status,
                            data: response.data,
                        };
                        break;
                    case 400:
                        result = {
                            status: response.status,
                            message: response.data.message,
                        };
                        break;
                    case 500:
                        result = {
                            status: response.status,
                            message: 'Server Error',
                        };
                        break;
                    default:
                        result = {
                            status: response.status,
                            message: 'unhandled',
                        };
                        break;
                }

                resolve(result);
            })
            .catch(err => {
                console.log("error", err)
                // alert(JSON.stringify(err));
                reject(err);
            });
    });
}

export const CommentsService = {
    getAllCommentsForPosts,
    addNewComments,
    addLikeToComment,
    addNewReplyToComments,
    addNewReportComments,
}
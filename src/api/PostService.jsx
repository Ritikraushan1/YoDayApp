import axios from "axios";
import { Alert, Platform } from 'react-native';
import Config from 'react-native-config';
import * as YDAPI from '../constants/apiConstants';
import { UserService } from "./UserService";

async function getAllPosts() {
    let url = Config.API_URL + YDAPI.GET_ALL_POSTS;
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

async function getPostBySearchQuery(query) {
    let url = Config.API_URL + YDAPI.GET_ALL_POSTS + '/search?query=' + query;
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

async function reactPost(postId, type) {
    let url = Config.API_URL + YDAPI.GET_ALL_POSTS + '/' + postId + YDAPI.POST_REACT;
    const user = await UserService.getUserInformation();
    let tokenval = user?.token;
    console.log("detailsinuserinfo", user);
    let headers = {
        Authorization: `Bearer ${tokenval}`
    }
    let body = {
        type: type
    }
    console.log("url", url, body);

    return new Promise((resolve, reject) => {
        axios
            .post(url, body, { headers: headers })
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

export const PostService = {
    getAllPosts,
    reactPost,
    getPostBySearchQuery
}
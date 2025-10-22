import axios from "axios";
import { Alert, Platform } from 'react-native';
import Config from 'react-native-config';
import * as YDAPI from '../constants/apiConstants';
import { UserService } from "./UserService";

async function getAllTickets() {
    let url = Config.API_URL + YDAPI.GET_MY_TICKETS;
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

async function addNewTickets(title, content) {
    let url = Config.API_URL + YDAPI.ADD_TICKETS;
    const user = await UserService.getUserInformation();
    let tokenval = user?.token;
    let headers = {
        Authorization: `Bearer ${tokenval}`
    }
    let body_obj = {
        title,
        content
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

export const TicketService = {
    getAllTickets,
    addNewTickets
}
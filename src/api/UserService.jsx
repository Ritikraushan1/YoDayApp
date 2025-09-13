import axios from "axios";
import { Alert, Platform } from 'react-native';
import Config from 'react-native-config';
import * as YDAPI from '../constants/apiConstants';


async function updateUserProfile(data) {
    let url = Config.API_URL + YDAPI.PROFILE_SELF;
    console.log("url and data in update", url, data);


    let headers = {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MGQwZWRkZC01M2ZiLTRlMmUtYTZhOC1jOTU1NjdhYzU1ODMiLCJpYXQiOjE3NTc3NTI2MzMsImV4cCI6MTc1ODM1NzQzM30.ngwambiTKbU3hY4Mt_OQ7oe25l5jA5iTAi8BUS2DebI'
    }
    return new Promise((resolve, reject) => {
        axios
            .put(url, data, { headers: headers })
            .then(response => {
                let result = '';
                console.log(response.status, response.data);
                switch (response.status) {
                    case 201:
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

export const UserService = {
    updateUserProfile
}

import http from 'axios';
//import { config as serverConfig } from '../config/server'
http.defaults.baseURL = `http://localhost:8000`;
http.defaults.timeout = 8000;

export const httpTransport = ({ method = "get", url, data = {}, headers={} }) => {
   
    switch (method) {
        case "get":
            return http.get(url, { params: data, headers});
        case "post":
            return http.post(url, data, {headers});    
            
        default: return Promise.reject('Error: unknown http method');
    }

};
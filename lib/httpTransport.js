import http from 'axios';
import getRootUrl from './getRootUrl';


http.defaults.baseURL = getRootUrl();
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
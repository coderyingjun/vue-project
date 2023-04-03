import axios from 'axios'
export function request(config){
    const myAxios=axios.create({
        timeout: 3000,
    })
    return myAxios(config);
}
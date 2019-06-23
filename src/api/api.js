import {Post, Get} from "./http"
//獲取學校列表
export function getCollegeList (params = {}){
    return Get("/api/getCollegeList", params);
}
//獲取影院列表
export function getCinemaList (params = {}){
    return Get("/api/getCinemaList", params);
}
//獲取學校影院排期
export function getIndexFilmList (params = {}){
    return Get("/api/getIndexFilmList", params);
}
//獲取定位學校
export function getLocationCollege (params = {}){
    return Get("/api/getLocationCollege", params);
}




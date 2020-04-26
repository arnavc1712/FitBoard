const get_waypoints_info = async (source, end_point, distance) => {
    let paths = []
    let GET_WAYPOINTS_URL = `https://maps.googleapis.com/maps/api/directions/json?origin=${source['latitude']},${source['longitude']}&destination=${end_point['lat']},${end_point['lng']}&key=AIzaSyBC8Wv_vR8eWtUumhDwP_AQ4qb2JdcqFIQ&alternatives=true`;

    return await fetch(GET_WAYPOINTS_URL)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        let routes = [];
        data.routes.forEach(route => {
            let leg = route.legs[0];
            let _steps = []
            let leg_dis = leg.distance.value;
            if( 0.9*distance <= leg_dis && 1.1*distance >= leg_dis){
                //this path has the required path
                leg.steps.forEach(step => {
                    let obj = {};
                    obj['latitude'] = step.end_location.lat
                    obj['longitude'] = step.end_location.lng
                    obj['polyline'] = step.polyline.points
                    _steps.push(obj); 
                });
            }
            if(_steps.length > 0)
                paths.push(_steps);
        })
        return paths;
    })   
}


export const GetPaths = (source, distance) => {
    //find all the points near me using nearby query
    let _distance_int = parseInt(distance.replace('K', '000'));
    let GET_END_POINTS_URL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${source['latitude']},${source['longitude']}&radius=${_distance_int}&key=AIzaSyBMV8iHwK-7GW_xUtoBn0uICBvJsrXeXJI`

    let suggested_end_point = [];
    try{
        return fetch(GET_END_POINTS_URL)
        .then((response) => {
            return response.json();
        })
        .then(async (data) => {
            let end_points = data.results;
            return await Promise.all(end_points.map(async (end_point) => {
                let coordinate = end_point.geometry.location

                let waypoints_info = await get_waypoints_info(source, coordinate, _distance_int);
                if(waypoints_info.length > 0){
                    let obj = {}
                    obj['coordinate'] = coordinate;
                    obj['paths'] = waypoints_info;
                    suggested_end_point.push(obj);
                }
            }))
            .then(() => {
                // suggested_end_point.forEach((element) => {
                //     console.log(element.coordinate, element.paths);
                // })
                return suggested_end_point;
            })
        })
    }
    catch(error){
        console.log("Error in GET_END_POINTS", error)
    }
}
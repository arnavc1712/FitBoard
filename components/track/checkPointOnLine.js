
// // import {turf} from '@turf/turf';
// var turf = require('@turf/turf');
// // npm install @turf/turf

// export const checkPointOnLine = (point, route) => {
//     if(!point) return false;
//     console.log("Checking point ", [parseFloat(point.latitude), parseFloat(point.longitude)]);
//     // if(!turf) console.log("Turf not defined");
//     let pt = turf.point([parseFloat(point.latitude), parseFloat(point.longitude)]);
//     // console.log("Created turf point");
//     let arr = []
//     for(let i=0;i<route.length;i++){
//         console.log(parseFloat(route[i].latitude), parseFloat(route[i].longitude));
//         arr.push([parseFloat(route[i].latitude), parseFloat(route[i].longitude)]);
//     }
//     let line = turf.lineString(arr);
//     var distance = turf.pointToLineDistance(pt, line, {units: 'miles'});
//     console.log("Result ", turf.booleanPointOnLine(pt, line));
//     console.log("Distance of point from line ", distance);
//     // console.log("Created turf points for routes");
//     return turf.booleanPointOnLine(pt, line);

// }
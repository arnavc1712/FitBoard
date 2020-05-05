import firestore from '@react-native-firebase/firestore';


export const getDistance = (eventid) => {
    console.log("Getting distance for ", eventid);
    const eventColl = firestore().collection(eventid);
    return eventColl.get()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching collection for this event');
        return;
      }  
      let data = {};
      snapshot.forEach(doc => {
        let doc_data =  doc.data();
        let total_distance = 0;
        for(dist in doc_data.distance){
            // console.log(doc_data.distance[dist]);
            total_distance += doc_data.distance[dist];
        }
        const total = doc_data.distance.reduce((prev,next) => prev + parseInt(next.distance),0);
        data[doc.id] = total_distance;
        // console.log(doc.id, '=>', doc.data());
      });
      keysSorted = Object.keys(data).sort(function(a,b){return data[b]-data[a]})
      return keysSorted;
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });



};
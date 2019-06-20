import firebase from './../config/FireBase';
class firebaseAPI{
    static fetch_mon_success(action, state) {
        return new Promise((resolve, reject) => {
            firebase.database().ref('/ban/').on("value", (database) => {
                resolve(database)
            })
        })
        
    }
    
}

export default firebaseAPI
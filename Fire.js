import firebase from "firebase";
import '@firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBvQd2maq_tF--kUltksPlD7Z4bfTt141c",  
    authDomain: "todoapp-ee8e3.firebaseapp.com",
    projectId: "todoapp-ee8e3",
    storageBucket: "todoapp-ee8e3.appspot.com",
    messagingSenderId: "291365812450",
    appId: "1:291365812450:web:9c64885cebd48c1a9e86bb"
}

class Fire {
    constructor(callback){
        this.init(callback)
    }
    init(callback) {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig)
        }

        firebase.auth().onAuthStateChanged(
            user => {
                if (user) {
                    callback(null,user)
                }
                else {
                    firebase.auth().signInAnonymously().catch(error => {
                      callback(error)
                    });
                }
            }
        );
    }
    getLists(callback){
        let ref= this.ref.orderBy("name")

        this.unsubscribe=ref.onSnapshot(snapshot=>{
            lists=[]

            snapshot.forEach(doc=>{
                lists.push({id:doc.id,...doc.data()})
            })

            callback(lists);
        })
    }

    addList(list){
        let ref = this.ref;

        ref.add(list)
    }

     updatelist(list){
       let ref = this.ref;
       ref.doc(list.id).update(list);
     }

    get userId(){
        return firebase.auth().currentUser.uid
    }
       
   get ref(){
       return firebase
       .firestore()
       .collection('users')
       .doc(this.userId)
       .collection('lists');
   }

    detach(){
        this.unsubscribe();
    }
}

export default Fire;
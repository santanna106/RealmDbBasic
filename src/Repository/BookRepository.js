import getRealm from '../services/realm'
export default class BookRepository {

    

    add = async (data) => {

    const realm = await getRealm();
    const id = realm.objects('Book').sorted('id',true).length > 0 ? realm.objects('Book').sorted('id',true)[0].id + 1: 1;
    
    data.id = id;
    console.log('DATA: ',data)
    realm.write(() => {
        realm.create('Book',data)
    })

    }


}
 

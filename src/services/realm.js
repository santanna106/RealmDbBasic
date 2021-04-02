import Realm from 'realm';
import BookSchema from '../Schemas/BookSchema';


export default function getRealm() {
 return Realm.open({
     schema:[BookSchema]
 })
}
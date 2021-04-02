import React,{useState,useEffect} from 'react';

import {Container,
        Logo,
        Title,
        Input,
        CenterView,
        Botao,
        BotaoText,
        List} from './styles';
import Books from './Books';
import getRealm from './services/realm';

import {Keyboard} from 'react-native'

export default function App() {

 const [nome,setNome] = useState('')
 const [preco,setPreco] = useState('')
 const [idEdit,setIdEdit] = useState(null)
 const [books,setBooks] = useState([])
 const [disabledBtn,setDisabledBtn] = useState(false)

 useEffect(()=> {
    loadBooks = async() => {
        const realm = await getRealm();
        const data = realm.objects('Book');
        setBooks(data);

    }

    loadBooks();
 },[])

 saveBook = async (data) =>{
     const realm = await getRealm();
     const id = realm.objects('Book').sorted('id',true).length > 0 ? realm.objects('Book').sorted('id',true)[0].id + 1: 1;

    const dadosLivro = {
        id:id,
        nome:data.nome,
        preco: data.preco
    }
    
    realm.write(() => {
        realm.create('Book',dadosLivro)
    })
 }

 

 addBook = async () =>{
     if(nome === '' || preco=== ''){
         alert('Preencha todos os campos');
         return;
     }

     try{
        const data = { nome:nome,preco:preco}
        await saveBook(data)

        setNome('');
        setPreco('');

        Keyboard.dismiss();
     } catch(err){
         alert(err);
     }
     
 }

 function editarBook (data) {
     setNome(data.nome);
     setPreco(data.preco)
     setIdEdit(data.id);
     setDisabledBtn(true);
 }


   excluirBook = async (data) =>  {
    const realm = await getRealm();
    const ID = data.id;
    realm.write(()=> {
        if(realm.objects('Book').filtered('id ='  + ID).length > 0){
            realm.delete(
                realm.objects('Book').filtered('id =' + ID)
            )
        }
    })

    const livrosAtuais = await realm.objects('Book').sorted('id',false);
    setBooks(livrosAtuais);
   }

 

 editBook = async () => {
     if(idEdit === null){
         alert('Você não pode Editar')
         return;
     }

     const realm = await getRealm();
     const response = {
         id:idEdit,
         nome:nome,
         preco:preco
     }

     await realm.write(()=> {
         realm.create('Book',response,'modified')
     })

     const dadosAlterados = await realm.objects('Book').sorted('id',false)
     setBooks(dadosAlterados);
     setNome('');
     setPreco('');
     setIdEdit(null);
     Keyboard.dismiss();
     setDisabledBtn(false);

 }

 return (
   <Container>
     <Logo>Próximo livros</Logo>
     <Title>Nome</Title>
     <Input 
       autoCapitalize="none" 
       autoCorrect={false}
       value={nome}
       onChangeText = {(text) => setNome(text)}
     />

     <Title>Preço</Title>
     <Input
      autoCapitalize="none"
      autoCorrect={false}
      value={preco}
       onChangeText = {(text) => setPreco(text)}
       />
     <CenterView>
         <Botao onPress={addBook}
               disabled={disabledBtn}
               style={{opacity: disabledBtn? 0.1 : 1}}
        >
             <BotaoText>Cadastrar</BotaoText>
         </Botao>
         <Botao onPress={editBook}>
             <BotaoText>Editar</BotaoText>
         </Botao>
     </CenterView>
     <List 
     showsVerticalScrollIndicator={false}
     keyboardShouldPersisTaps="handled"
     data={books}
     keyExtractor={item => String(item.id)}
     renderItem={({item}) => (<Books data={item} editar={editarBook} excluir={excluirBook} />)}
      />
   </Container>
  );
}
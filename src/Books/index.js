import React from 'react';

import { CenterView, Container,Botao,BotaoText,Nome,Preco } from './styles';

export default function Books({data,editar,excluir}) {
 return (
   <Container>
       <Nome>{data.nome}</Nome>
       <Preco>R$ {data.preco}</Preco>
       <CenterView>
           <Botao onPress={() => {editar(data)}}>
               <BotaoText>Editar</BotaoText>
           </Botao>
           <Botao onPress={() => {excluir(data)}}>
               <BotaoText>Excluir</BotaoText>
           </Botao>
       </CenterView>
    </Container>
  );
}
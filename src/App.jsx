import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Menu from "./components/Menu";
import TabelaLivros from "./components/TabelaLivros";
import CadastrarLivros from "./components/CadastrarLivros";
import NotFound from "./components/NotFound";
import SimpleStorage from "react-simple-storage";


class App extends Component {

  state = {
    livros: [],
  };
  
  inserirLivro = livro =>{
    livro.id = this.state.livros.length + 1;
    this.setState({
      livros: [...this.state.livros, livro]
    });
  };
  
  editarLivro = livro => {
    const index = this.state.livros.findIndex((p) => p.id === livro.id);
    const livros = this.state.livros
    .slice(0, index)
    .concat(this.state.livros.slice(index + 1));
    const newLivros = [...livros, livro].sort((a, b) => a.id - b.id);
    this.setState({
      livros: newLivros,
    });
  };

  removerLivro = livro => {
    if (window.confirm("remover esse livro?")){
      const livros = this.state.livros.filter(p => p.isbn !== livro.isbn);
      this.setState({ livros });
    }
  };
  
  render() {
    return (
      <Router> 
        <SimpleStorage parent={this} />       
        <Menu />
        <Routes>
          <Route exact path="/" element={ 
            <TabelaLivros 
              livros={this.state.livros} 
              removerLivro={this.removerLivro}
          />} />
          <Route exact path="/cadastrar" element={ 
            <CadastrarLivros 
            inserirLivro = {this.inserirLivro}
            livro = {{ id: 0, isbn:"", titulo:"", autor:""}}
            />
          } 
          />
          <Route  exact    
            path="/editar/:isbnLivro"
            
            element={ props => {
              const livro = this.state.livros.find(
              (livro) => livro.isbn === this.props.match.params.isbnLivro
            );
            if (livro) {
              return (
                <CadastrarLivros
                  editarLivro={this.editarLivro}
                  livro={livro}
                />
              );
            } else {
              return <Navigate to="/" />;
            }              
          }}            
             />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    );
  }
}

export default App;

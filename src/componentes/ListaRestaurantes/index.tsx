import { useEffect, useState } from "react";
import IRestaurante from "../../interfaces/IRestaurante";
import style from "./ListaRestaurantes.module.scss";
import Restaurante from "./Restaurante";
import axios, { AxiosRequestConfig } from "axios";
import { IPaginacao } from "../../interfaces/IPaginacao";

interface IParametrosBusca {
  ordering?: string;
  search?: string;
}

const ListaRestaurantes = () => {
  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
  const [proximaPagina, setProximaPagina] = useState("");
  const [paginaAnterior, setPaginaAnterior] = useState("");
  const [busca, setBusca] = useState("");

  // agora, o carregarDados recebe opcionalmente as opções de configuração do axios
  const carregarDados = (url: string, opcoes: AxiosRequestConfig = {}) => {
    axios
      .get<IPaginacao<IRestaurante>>(url, opcoes)
      .then((resposta) => {
        setRestaurantes(resposta.data.results);
        setProximaPagina(resposta.data.next);
        setPaginaAnterior(resposta.data.previous);
      })
      .catch((erro) => {
        console.log(erro);
      });
  };

  // a cada busca, montamos um objeto de opções
  const buscar = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const opcoes = {
      params: {} as IParametrosBusca,
    };
    if (busca) {
      opcoes.params.search = busca;
    }
    if (ordenacao) {
      opcoes.params.search = ordenacao;
    }
    carregarDados("http://localhost:8000/api/v1/restaurantes/", opcoes);
  };

  useEffect(() => {
    // obter restaurantes
    carregarDados("http://localhost:8000/api/v1/restaurantes/");
  }, []);

  const verMais = () => {
    axios.get<IPaginacao<IRestaurante>>(proximaPagina).then((resposta) => {
      setRestaurantes([...restaurantes, ...resposta.data.results]);
      setProximaPagina(resposta.data.next);
    });
  };

  const [ordenacao, setOrdenacao] = useState("");

  return (
    <section className={style.ListaRestaurantes}>
      <h1>
        Os restaurantes mais <em>bacanas</em>!
      </h1>
      <form onSubmit={buscar}>
        <div>
          <input
            type="text"
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
          />
        </div>

        <div>
          <label htmlFor="select-ordenacao"> Ordenação</label>
          <select
            name="select-ordenacao"
            id="select-ordenacao"
            value={ordenacao}
            onChange={(evento) => setOrdenacao(evento.target.value)}
          >
            <option value=" "> Padrão</option>
            <option value="id"> Por id</option>
            <option value="nome"> Por nome</option>
          </select>
        </div>
        <button type="submit">buscar</button>
      </form>
      {restaurantes?.map((item) => (
        <Restaurante restaurante={item} key={item.id} />
      ))}
      {
        <button
          onClick={() => carregarDados(paginaAnterior)}
          disabled={!paginaAnterior}
        >
          Página Anterior
        </button>
      }
      {
        <button
          onClick={() => carregarDados(proximaPagina)}
          disabled={!proximaPagina}
        >
          Próxima página
        </button>
      }
    </section>
  );
};
export default ListaRestaurantes;

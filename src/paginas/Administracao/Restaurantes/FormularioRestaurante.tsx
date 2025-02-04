import {
  AppBar,
  Box,
  Button,
  Container,
  Link,
  Paper,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import IRestaurante from "../../../interfaces/IRestaurante";
import { useParams } from "react-router-dom";
import http from "../../../http";
import { Link as RouterLink } from "react-router-dom";
import AdministracaoDePratos from "../Pratos/AdministracaoDePratos";

const FormularioRestaurante = () => {
  const parametros = useParams();

  useEffect(() => {
    if (parametros.id) {
      http
        .get<IRestaurante>(`restaurantes/${parametros.id}`)
        .then((resposta) => {
          setNomeRestaurante(resposta.data.nome);
        });
    }
  }, [parametros]);

  const [nomeRestaurante, setNomeRestaurante] = useState("");

  const aoSubmeterForm = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();

    if (parametros.id) {
      http
        .put(`restaurantes/${parametros.id}/`, {
          nome: nomeRestaurante,
        })
        .then(() => {
          alert("Restaurante atualizado com sucesso");
        });
    } else {
      http
        .post("restaurantes/", {
          nome: nomeRestaurante,
        })
        .then(() => {
          alert("Restaurante cadastrado com sucesso");
        });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 2,
        flexGrow: 1,
      }}
    >
      <Typography component="h1" variant="h6">
        {" "}
        Formulário Restaurante
      </Typography>
      <Box component="form" onSubmit={aoSubmeterForm} sx={{ width: "100%" }}>
        <TextField
          value={nomeRestaurante}
          onChange={(evento) => {
            setNomeRestaurante(evento.target.value);
          }}
          label="Nome Restaurante"
          variant="standard"
          fullWidth
          required
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ marginTop: 1 }}
        >
          Salvar{" "}
        </Button>
      </Box>
    </Box>
  );
};
export default FormularioRestaurante;

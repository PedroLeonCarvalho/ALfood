import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import http from "../../../http";
import ITag from "../../../interfaces/ITag";
import IRestaurante from "../../../interfaces/IRestaurante";

const FormularioPratos = () => {
  const [nomePrato, setNomePrato] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tags, setTags] = useState<ITag[]>([]);
  const [tag, setTag] = useState("");
  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
  const [restaurante, setRestaurante] = useState("");
  const [imagem, setImagem] = useState<File | null>(null);

  const selecionarArquivo = (evento: React.ChangeEvent<HTMLInputElement>) => {
    if (evento.target.files?.length) {
      setImagem(evento.target.files[0]);
    } else {
      setImagem(null);
    }
  };

  const aoSubmeterForm = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();

    const formData = new FormData();
    formData.append("nome", nomePrato);
    formData.append("descricao", descricao);
    formData.append("tag", tag);
    formData.append("restaurante", restaurante);

    if (imagem) {
      formData.append("imagem", imagem);
    }

    http
      .request({
        url: "pratos/",
        method: "POST",
        headers: {
          "Content-Type": "multpart/form-data",
        },
        data: formData,
      })
      .then(() => {
        setDescricao("");
        setNomePrato("");
        setTag("");
        setRestaurante("");
        alert("Prato cadastrado com sucesso");
      })
      .catch((erro) => console.log(erro));
  };

  useEffect(() => {
    http
      .get<{ tags: ITag[] }>("tags/")
      .then((resposta) => setTags(resposta.data.tags));

    http
      .get<IRestaurante[]>("restaurantes/")
      .then((resposta) => setRestaurantes(resposta.data));
  }, []);

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
        Formulário Prato
      </Typography>
      <Box component="form" onSubmit={aoSubmeterForm} sx={{ width: "100%" }}>
        <TextField
          margin="dense"
          value={nomePrato}
          onChange={(evento) => {
            setNomePrato(evento.target.value);
          }}
          label="Nome Prato"
          variant="standard"
          fullWidth
          required
        />
        <TextField
          margin="dense"
          value={descricao}
          onChange={(evento) => {
            setDescricao(evento.target.value);
          }}
          label="Descrição"
          variant="standard"
          fullWidth
          required
        />
        <FormControl margin="dense" fullWidth>
          <InputLabel id="select-tag">Tag</InputLabel>
          <Select
            labelId="select-tag"
            value={tag}
            onChange={(evento) => setTag(evento.target.value)}
          >
            {tags.map((tag) => (
              <MenuItem key={tag.id} value={tag.value}>
                {tag.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl margin="dense" fullWidth>
          <InputLabel id="select-restaurante">Restaurante</InputLabel>
          <Select
            labelId="select-restaurante"
            value={restaurante}
            onChange={(evento) => setRestaurante(evento.target.value)}
          >
            {restaurantes.map((restaurante) => (
              <MenuItem key={restaurante.id} value={restaurante.id}>
                {restaurante.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <input type="file" onChange={selecionarArquivo}></input>
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
export default FormularioPratos;

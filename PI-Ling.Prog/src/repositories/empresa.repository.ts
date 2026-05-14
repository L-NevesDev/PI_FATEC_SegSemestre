import fs from "fs";
import path from "path";
import { Empresa } from "../schemas/empresa.schema";

const FILE_PATH = path.join(__dirname, "../../data/empresas.json");

export const empresaRepository = {
  listarTodas: (): Empresa[] => {
    if (!fs.existsSync(FILE_PATH)) return [];
    const data = fs.readFileSync(FILE_PATH, "utf-8");
    return JSON.parse(data);
  },

  salvar: (empresas: Empresa[]): void => {
    fs.writeFileSync(FILE_PATH, JSON.stringify(empresas, null, 2), "utf-8");
  }
};
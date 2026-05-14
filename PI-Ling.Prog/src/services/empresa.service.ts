import { empresaRepository } from "../repositories/empresa.repository";
import { Empresa } from "../schemas/empresa.schema";
import { randomUUID } from "crypto";

export const empresaService = {
  listar: (): Empresa[] => {
    return empresaRepository.listarTodas();
  },

  buscarPorId: (id: string): Empresa | undefined => {
    const empresas = empresaRepository.listarTodas();
    return empresas.find(e => e.id === id);
  },

  criar: (dados: Omit<Empresa, "id">): Empresa => {
    const empresas = empresaRepository.listarTodas();
    const novaEmpresa: Empresa = { id: randomUUID(), ...dados };
    
    empresas.push(novaEmpresa);
    empresaRepository.salvar(empresas);
    return novaEmpresa;
  },

  atualizar: (id: string, dados: Partial<Omit<Empresa, "id">>): Empresa | null => {
    const empresas = empresaRepository.listarTodas();
    const index = empresas.findIndex(e => e.id === id);
    
    if (index === -1) return null;

    empresas[index] = { ...empresas[index], ...dados };
    empresaRepository.salvar(empresas);
    return empresas[index];
  },

  deletar: (id: string): boolean => {
    const empresas = empresaRepository.listarTodas();
    const novaLista = empresas.filter(e => e.id !== id);
    
    if (empresas.length === novaLista.length) return false;

    empresaRepository.salvar(novaLista);
    return true;
  }
};
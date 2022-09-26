import axios from "axios";

interface ApiFederalUnit {
  nome: string;
  sigla: string;
}

export interface FederalUnit {
  initials: string;
  name: string;
}

export async function getFederalUnits(): Promise<FederalUnit[]> {
  const { data } = await axios.get<ApiFederalUnit[]>(
    "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
  );

  return data.map((federalUnit) => ({
    initials: federalUnit.sigla,
    name: federalUnit.nome,
  }));
}

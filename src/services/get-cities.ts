import axios from "axios";

interface ApiCity {
  id: number;
  nome: string;
}

export interface City {
  id: number;
  name: string;
}

export async function getCities(federalUnit: string): Promise<City[]> {
  const { data } = await axios.get<ApiCity[]>(
    `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${federalUnit}/municipios`
  );

  return data.map((city) => ({
    id: city.id,
    name: city.nome,
  }));
}

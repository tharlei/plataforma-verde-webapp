import { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { format, parseISO } from "date-fns";
import { Alert } from "./shared/alert";
import { Document } from "./shared/document";
import InputMask from "react-input-mask";

interface ApiFederalUnit {
  nome: string;
  sigla: string;
}

interface ApiCity {
  id: number;
  nome: string;
}

interface FederalUnit {
  initials: string;
  name: string;
}

interface City {
  id: number;
  name: string;
}

interface User {
  id: string;
  name: string;
  document: string;
  birthday: string;
  federalUnit: string;
  city: string;
  age: number;
}

export default function App() {
  const [name, setName] = useState<string>("");
  const [document, setDocument] = useState<string>("");
  const [birthday, setBirthday] = useState<string>("");
  const [federalUnit, setFederalUnit] = useState<string>("");
  const [city, setCity] = useState<number>(0);
  const [federalUnits, setFederalUnits] = useState<FederalUnit[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  async function getFederalUnits(): Promise<void> {
    const { data } = await axios.get<ApiFederalUnit[]>(
      "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
    );

    const federalUnitsData = data.map((federalUnit) => ({
      initials: federalUnit.sigla,
      name: federalUnit.nome,
    }));

    setFederalUnits(federalUnitsData);
  }

  async function getCities(): Promise<void> {
    const { data } = await axios.get<ApiCity[]>(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${federalUnit}/municipios`
    );

    const citiesData = data.map((city) => ({
      id: city.id,
      name: city.nome,
    }));

    setCities(citiesData);
  }

  async function handleSubmit(event: FormEvent): Promise<void> {
    event.preventDefault();

    const age = calculateAge(birthday);

    if (age < 16) {
      Alert.toastError("Idade mínima exigida 16 anos");
      return;
    }

    if (!Document.validCpf(document)) {
      Alert.toastError("CPF incorreto");
      return;
    }

    const cityName = cities.find((cityOption) => cityOption.id == city)!.name;

    const user: User = {
      id: uuidv4(),
      name,
      age,
      birthday,
      city: cityName,
      document,
      federalUnit,
    };

    setUsers([...users, user]);
    Alert.toastSuccess("Usuário adicionado com sucesso");
  }

  async function handleDeleteUser(id: string): Promise<void> {
    const alertResult = await Alert.confirmMessage("Deseja realmente excluir?");

    if (!alertResult.isConfirmed) {
      return;
    }

    const usersFiltered = users.filter((user) => user.id !== id);

    setUsers(usersFiltered);
  }

  function calculateAge(date: string): number {
    const today = new Date();
    const birthDate = new Date(date);
    const age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }

    return age;
  }

  useEffect(() => {
    getFederalUnits();
  }, []);

  useEffect(() => {
    getCities();
  }, [federalUnit]);

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome Completo*</label>
          <input
            type="text"
            required
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div>
          <label>CPF*</label>
          <InputMask
            mask="999.999.999-99"
            onChange={(event) => setDocument(event.target.value)}
            required
          />
        </div>
        <div>
          <label>Data de Nascimento*</label>
          <input
            type="date"
            required
            onChange={(event) => setBirthday(event.target.value)}
          />
        </div>
        <div>
          <label>Estado*</label>
          <select
            defaultValue=""
            required
            onChange={(event) => setFederalUnit(event.target.value)}
          >
            <option value="" disabled>
              Selecione
            </option>
            {federalUnits.map((federalUnitOption) => (
              <option
                value={federalUnitOption.initials}
                key={federalUnitOption.initials}
              >
                {federalUnitOption.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Cidade*</label>
          <select
            defaultValue=""
            required
            onChange={(event) => setCity(event.target.value)}
          >
            <option value="" disabled>
              Selecione
            </option>
            {cities.map((cityOption) => (
              <option value={cityOption.id} key={cityOption.id}>
                {cityOption.name}
              </option>
            ))}
          </select>
        </div>

        <button>Incluir</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Nome Completo</th>
            <th>CPF</th>
            <th>Data de Nascimento</th>
            <th>Idade</th>
            <th>Estado</th>
            <th>Cidade</th>
            <th>Editar</th>
            <th>Excluir</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const birthDayFormatted = format(parseISO(user.birthday), "d/MM/Y");

            return (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.document}</td>
                <td>{birthDayFormatted}</td>
                <td>{user.age}</td>
                <td>{user.federalUnit}</td>
                <td>{user.city}</td>
                <td>
                  <button>Editar</button>
                </td>
                <td>
                  <button onClick={() => handleDeleteUser(user.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

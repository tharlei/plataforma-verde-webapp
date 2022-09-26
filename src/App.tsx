import { FormEvent, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { AlertUtil } from "./utils/alert-util";
import { DocumentUtil } from "./utils/document-util";
import InputMask from "react-input-mask";
import { FederalUnit, getFederalUnits } from "./services/get-federal-units";
import { City, getCities } from "./services/get-cities";
import { DateUtil } from "./utils/date-util";

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

  async function handleSubmit(event: FormEvent): Promise<void> {
    event.preventDefault();

    const age = DateUtil.calculateAge(birthday);

    if (name.split(" ").length < 2) {
      AlertUtil.toastError("Nome e sobrenome é exigido");
      return;
    }

    if (age < 16) {
      AlertUtil.toastError("Idade mínima exigida 16 anos");
      return;
    }

    if (!DocumentUtil.validCpf(document)) {
      AlertUtil.toastError("CPF incorreto");
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
    AlertUtil.toastSuccess("Usuário adicionado com sucesso");
  }

  async function handleDeleteUser(id: string): Promise<void> {
    const alertResult = await AlertUtil.confirmMessage(
      "Deseja realmente excluir?"
    );

    if (!alertResult.isConfirmed) {
      return;
    }

    const usersFiltered = users.filter((user) => user.id !== id);

    setUsers(usersFiltered);
  }

  useEffect(() => {
    getFederalUnits().then((federalUnits) => setFederalUnits(federalUnits));
  }, []);

  useEffect(() => {
    getCities(federalUnit).then((cities) => setCities(cities));
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
            onChange={(event) => setCity(Number(event.target.value))}
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
            const birthDayFormatted = DateUtil.formatToBr(user.birthday);

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

import { FormEvent, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { AlertUtil } from "../../utils/alert-util";
import { DocumentUtil } from "../../utils/document-util";
import InputMask from "react-input-mask";
import { FederalUnit, getFederalUnits } from "../../services/get-federal-units";
import { City, getCities } from "../../services/get-cities";
import { DateUtil } from "../../utils/date-util";
import { User } from "../../pages/home";

interface InputForm {
  handleAddUser: (user: User) => void;
}

export function Form({ handleAddUser }: InputForm) {
  const [name, setName] = useState<string>("");
  const [document, setDocument] = useState<string>("");
  const [birthday, setBirthday] = useState<string>("");
  const [federalUnit, setFederalUnit] = useState<string>("");
  const [city, setCity] = useState<number>(0);
  const [federalUnits, setFederalUnits] = useState<FederalUnit[]>([]);
  const [cities, setCities] = useState<City[]>([]);

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

    handleAddUser(user);
    AlertUtil.toastSuccess("Usuário adicionado com sucesso");

    //@ts-expect-error
    event.target.reset();
  }

  useEffect(() => {
    getFederalUnits().then((federalUnits) => setFederalUnits(federalUnits));
  }, []);

  useEffect(() => {
    getCities(federalUnit).then((cities) => setCities(cities));
  }, [federalUnit]);

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 lg:grild-cols-2 gap-4"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="flex flex-col">
          <label>Nome Completo*</label>
          <input
            type="text"
            required
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label>CPF*</label>
          <InputMask
            mask="999.999.999-99"
            onChange={(event) => setDocument(event.target.value)}
            required
          />
        </div>
        <div className="flex flex-col">
          <label>Data de Nascimento*</label>
          <input
            type="date"
            required
            onChange={(event) => setBirthday(event.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="flex flex-col">
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
        <div className="flex flex-col">
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

        <div className="flex lg:justify-end lg:items-end">
          <button className="bg-green rounded px-20 py-1 h-8 text-white">
            Incluir
          </button>
        </div>
      </div>
    </form>
  );
}

import { useState } from "react";
import { Form } from "../../components/form";
import { Table } from "../../components/table";
import { AlertUtil } from "../../utils/alert-util";
import logo from "../../assets/logo.svg";
import userIcon from "../../assets/user-icon.svg";

export interface User {
  id: string;
  name: string;
  document: string;
  birthday: string;
  federalUnit: string;
  city: string;
  age: number;
}

export function Home() {
  const [users, setUsers] = useState<User[]>([]);

  async function handleRemoveUser(id: string): Promise<void> {
    const alertResult = await AlertUtil.confirmMessage(
      "Deseja realmente excluir?"
    );

    if (!alertResult.isConfirmed) {
      return;
    }

    const usersFiltered = users.filter((user) => user.id !== id);

    setUsers(usersFiltered);
  }

  async function handleAddUser(user: User): Promise<void> {
    setUsers([...users, user]);
  }

  return (
    <>
      <header className="w-full bg-gray-500 py-6 px-5">
        <img
          src={logo}
          alt="Logo da empresa Plataforma Verde"
          className="h-8"
        />
      </header>

      <main className="px-4 lg:px-12 my-8">
        <div className="w-full flex justify-between items-end">
          <div className="flex items-center">
            <img src={userIcon} alt="Icone de usuário" className="h-16 mr-3" />
            <h2 className="text-xl lg:text-2xl font-normal">
              Cadastro Usuário
            </h2>
          </div>
          <span className="text-right text-xs lg:text-sm">
            * campos obrigatórios
          </span>
        </div>
        <hr className="mt-2" />

        <div className="mt-8 px-6 py-4 shadow-md bg-gray-300 rounded">
          <Form handleAddUser={handleAddUser} />
          <div className="mt-8 overflow-x-auto">
            <Table handleRemoveUser={handleRemoveUser} users={users} />
          </div>
        </div>
      </main>
    </>
  );
}

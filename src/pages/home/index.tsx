import { useState } from "react";
import { Form } from "../../components/form";
import { Table } from "../../components/table";
import { AlertUtil } from "../../utils/alert-util";

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
    <div>
      <Form handleAddUser={handleAddUser} />
      <Table handleRemoveUser={handleRemoveUser} users={users} />
    </div>
  );
}

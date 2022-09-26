import { User } from "../../pages/home";
import { DateUtil } from "../../utils/date-util";

interface InputTable {
  handleRemoveUser: (id: string) => void;
  users: User[];
}

export function Table({ handleRemoveUser, users }: InputTable) {
  return (
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
                <button onClick={() => handleRemoveUser(user.id)}>
                  Excluir
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

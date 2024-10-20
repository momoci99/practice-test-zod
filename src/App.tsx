import { useEffect, useState } from "react";
import { User, userScheme } from "./types/User";
import "./App.css";

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [wrongUsers, setWrongUsers] = useState<User[]>([]);

  const getUsers = async () => {
    const response = await fetch("http://localhost:3001/users");
    const data: User[] = await response.json();

    const validUserList: User[] = [];

    // Zod로 데이터를 검증
    data.forEach((user) => {
      const result = userScheme.safeParse(user);
      if (result.success) {
        validUserList.push(user);
      } else {
        console.error("유효하지 않은 데이터:", result.error.format());
        //혹은 오류 페이지로 리다이렉트 등을 처리
      }
    });

    setUsers(validUserList);
  };

  const getWrongUsersSafeParse = async () => {
    const response = await fetch("http://localhost:3001/wrong-users");
    const data: User[] = await response.json();

    const validUserList: User[] = [];
    const wrongUserList: User[] = [];

    // Zod로 데이터를 검증
    data.forEach((user) => {
      const result = userScheme.safeParse(user);
      if (result.success) {
        validUserList.push(user);
      } else {
        console.error("유효하지 않은 데이터:", user);
        console.error("유효하지 않은 데이터:", result.error.format());
        //혹은 오류 페이지로 리다이렉트 등을 처리
      }
    });

    setWrongUsers(validUserList);
  };

  const getWrongUsersParse = async () => {
    try {
      const response = await fetch("http://localhost:3001/wrong-users");
      const data: User[] = await response.json();

      const validUserList: User[] = [];

      // Zod로 데이터를 검증
      data.forEach((user) => {
        const validUser = userScheme.parse(user);
        validUserList.push(validUser);
      });

      setWrongUsers(validUserList);
    } catch (error) {
      console.error("유효하지 않은 데이터:", error);
      //혹은 오류 페이지로 리
    }
  };

  useEffect(() => {}, []);

  return (
    <div
      style={{
        display: "flex",

        gap: "16px",
        padding: "16px",
        border: "1px solid #000",
        borderRadius: "4px",
      }}
    >
      <div>
        <h1>정상적인 유저 목록</h1>
        <ul
          style={{
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            padding: "16px",
            border: "1px solid #000",
            borderRadius: "4px",
          }}
        >
          {users.map((user: User) => (
            <li key={user.id}>
              {user.name} ({user.email})
            </li>
          ))}
        </ul>

        <button
          onClick={async () => {
            setUsers([]);
            await getUsers();
          }}
        >
          유저 목록 불러오기
        </button>
      </div>

      <div>
        <h1>비 정상적인 유저 목록</h1>
        <ul
          style={{
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            padding: "16px",
            border: "1px solid #000",
            borderRadius: "4px",
          }}
        >
          {wrongUsers.map((user: User) => (
            <li key={user.id}>
              {user.name} ({user.email})
            </li>
          ))}
        </ul>

        <button
          onClick={async () => {
            setWrongUsers([]);
            await getWrongUsersSafeParse();
          }}
        >
          잘못된 유저 목록 불러오기 - safeParse
        </button>

        <button
          onClick={async () => {
            setWrongUsers([]);
            await getWrongUsersParse();
          }}
        >
          잘못된 유저 목록 불러오기 - parse
        </button>
      </div>
    </div>
  );
}

export default App;

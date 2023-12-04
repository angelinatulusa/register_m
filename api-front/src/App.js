import React, { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [kasutajad, setKasutajad] = useState([]);
  const idRef = useRef();
  const nimiRef = useRef();
  const isikukoodRef = useRef();
  const isActiveRef = useRef();

  useEffect(() => {
    fetch("https://localhost:7105/Kasutajad")
      .then(res => res.json())
      .then(json => setKasutajad(json.map(kasutaja => ({
        ...kasutaja,
        aeg: new Date(kasutaja.aeg).toLocaleString(), // Преобразуем в локальный формат времени
      }))));
  }, []);

  function kustuta(index) {
    if (index >= 0 && index < kasutajad.length) {
      const id = kasutajad[index].id;
      fetch(`https://localhost:7105/Kasutajad/kustuta/${id}`, { method: "DELETE" })
        .then(res => {
          if (res.status === 204) {
            console.log("Kasutaja edukalt kustutatud");
            setKasutajad(prevKasutajad => prevKasutajad.filter(kasutaja => kasutaja.id !== id));
          } else if (res.status === 404) {
            console.error("Kasutajat ei leitud");
          } else {
            console.error("Kasutaja kustutamisel ilmnes viga");
          }
        })
        .catch(error => {
          console.error("Viga päringu tegemisel:", error);
        });
    } else {
      console.error("Kehtetu indeks kasutaja kustutamiseks.");
    }
  }

  function lisa() {
    const newKasutaja = {
      id: Number(idRef.current.value),
      nimi: nimiRef.current.value,
      aeg: new Date().toLocaleString(), // Текущее время в локальном формате
      isActive: isActiveRef.current.checked,
      isikukood: Number(isikukoodRef.current.value),
    };

    fetch("https://localhost:7105/Kasutajad/lisa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newKasutaja),
    })
      .then(res => res.json())
      .then(json => {
        setKasutajad(prevKasutajad => [...prevKasutajad, {
          ...json,
          aeg: new Date(json.aeg).toLocaleString(), // Преобразуем в локальный формат времени
        }]);
      })
      .catch(error => {
        console.error("Viga kasutaja lisamisel:", error);
      });

    // Очищаем поля формы
    idRef.current.value = "";
    nimiRef.current.value = "";
    isikukoodRef.current.value = "";
    isActiveRef.current.checked = false;
  }

  return (
    <div className="App">
      <table id="customers">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nimi</th>
            <th>Aeg</th>
            <th>Töötajatekood</th>
            <th>Just saabun/Juba lahkun</th>
            <th>Tegevused</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input ref={idRef} type="number" /></td>
            <td><input ref={nimiRef} type="text" /></td>
            <td>{new Date().toLocaleString()}</td>
            <td><input ref={isikukoodRef} type="text" /></td>
            <td><input ref={isActiveRef} type="checkbox" /></td>
            <td><button onClick={() => lisa()}>Lisa</button></td>
          </tr>
          {kasutajad.map((kasutaja, index) => (
            <tr key={index}>
              <td>{kasutaja.id}</td>
              <td>{kasutaja.nimi}</td>
              <td>{kasutaja.aeg}</td>
              <td>{kasutaja.isikukood}</td>
              <td>{kasutaja.aktiivne ? 'just saabun' : 'juba lahkun'}</td>
              <td><button onClick={() => kustuta(index)}>Kustuta</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

import React, { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [kasutajad, setKasutajad] = useState([]);
  const [isUsd, setUsd] = useState(false);
  const idRef = useRef();
  const nimiRef = useRef();
  const aegRef = useRef();
  const isActiveRef = useRef();
  const isikukoodRef = useRef();

  useEffect(() => {
    fetch("https://localhost:7105/Kasutajad")
      .then(res => res.json())
      .then(json => setKasutajad(json));
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
      aeg: aegRef.current.value,
      isActive: isActiveRef.current.checked,
      isikukood: Number(isikukoodRef.current.value),
    };

    fetch("https://localhost:7105/Kasutajadlisa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newKasutaja),
    })
      .then(res => res.json())
      .then(json => setKasutajad(json))
      .catch(error => {
        console.error("Viga kasutaja lisamisel:", error);
      });

    // Очищаем поля формы
    idRef.current.value = "";
    nimiRef.current.value = "";
    aegRef.current.value = "";
    isikukoodRef.current.value = "";
    isActiveRef.current.checked = false;
  }

  return (
    <div className="App">
      <label>ID</label> <br />
      <input ref={idRef} type="number" /> <br />
      <label>Nimi</label> <br />
      <input ref={nimiRef} type="text" /> <br />
      <label>Aeg</label> <br />
      <input ref={aegRef} type="text" /> <br />
      <label>Isikukood</label> <br />
      <input ref={isikukoodRef} type="number" /> <br />
      <label>Aktiivne</label> <br />
      <input ref={isActiveRef} type="checkbox" /> <br />
      <button onClick={() => lisa()}>Lisa</button>
      {kasutajad.map((kasutaja, index) => (
        <div key={index}>
          <table id="customers">
            <tr>
              <td>{kasutaja.id}</td>
              <td>{kasutaja.nimi}</td>
              <td>{kasutaja.aeg}</td>
              <td>{kasutaja.isikukood}</td>
              <td>
                <button onClick={() => kustuta(index)}>x</button>
              </td>
            </tr>
          </table>
        </div>
      ))}
    </div>
  );
}

export default App;

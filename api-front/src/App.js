import React, { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [kasutajad, setKasutajad] = useState([]);
  const [error, setError] = useState(null);
  const idRef = useRef();
  const nimiRef = useRef();
  const isikukoodRef = useRef();
  const valikRef = useRef();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [adminCode, setAdminCode] = useState("");

  useEffect(() => {
    fetch("https://localhost:7105/Kasutajad")
      .then(res => res.json())
      .then(json => setKasutajad(json.map(kasutaja => ({
        ...kasutaja,
        aeg: new Date(kasutaja.aeg).toLocaleString(),
      }))));
  }, []);

  const kustuta = (index) => {
    if (index >= 0 && index < kasutajad.length) {
      const id = kasutajad[index].id;
      fetch(`https://localhost:7105/Kasutajad/kustuta/${id}`, { method: "DELETE" })
        .then(res => {
          if (res.status === 200) {
            console.log("Kasutaja edukalt kustutatud");
            setKasutajad(prevKasutajad => prevKasutajad.filter(kasutaja => kasutaja.id !== id));
          } else if (res.status === 404) {
            console.error("Kasutajat ei leitud");
          } else {
            console.error("Kasutaja kustutamisel ilmnes viga. HTTP staatus:", res.status);
          }
        })
        .catch(error => {
          console.error("Viga päringu tegemisel:", error);
        });
    } else {
      console.error("Kehtetu indeks kasutaja kustutamiseks.");
    }
  };

  const lisa = async () => {
    const nimi = nimiRef.current.value;
    const isikukood = isikukoodRef.current.value;
    const valik = valikRef.current.checked;
    const aeg = new Date().toISOString();
    
    if (!nimi || !isikukood) {
      console.error("Nimi ja Isikukood on nõutud.");
      return;
    }
  
    const newKasutaja = {
      nimi,
      isikukood,
      valik: valik.toString(),
      aeg,
      roll: "kasutaja",
    };
  
    try {
      const response = await fetch("https://localhost:7105/Kasutajad/lisa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newKasutaja),
      });
  
      if (response.ok) {
        console.log("Kasutaja edukalt lisatud");
        //window.location.reload(); // Lehe värskendamine
      } else {
        console.error("Kasutaja lisamisel ilmnes viga");
      }
    } catch (error) {
      console.error("Viga päringu tegemisel:", error);
    }
  };

  const checkAdmin = async () => {
    try {
      const response = await fetch(`https://localhost:7105/Kasutajad/checkAdmin?name=${adminName}&code=${adminCode}`);
      const data = await response.json();
      setIsAdmin(data.isAdmin);
    } catch (error) {
      console.error("Viga administraatori kontrollimisel:", error);
    }
  };

  return (
    <div className="App">
      <div>
        <label>
        Administraatori nimi:
          <input type="text" value={adminName} onChange={(e) => setAdminName(e.target.value)} />
        </label>
        <br />
        <label>
        Parool:
          <input type="password" value={adminCode} onChange={(e) => setAdminCode(e.target.value)} />
        </label>
        <button id='login' onClick={checkAdmin}>LogIn</button>
      </div>
      {isAdmin && (
        <div className="AdminTable">
          <table id="adminTable">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nimi</th>
                <th>Aeg</th>
                <th>Töötajatekood</th>
              </tr>
            </thead>
            <tbody>
              {kasutajad.map((kasutaja, index) => (
                <tr key={index}>
                  <td>{kasutaja.id}</td>
                  <td>{kasutaja.nimi}</td>
                  <td>{kasutaja.aeg}</td>
                  <td>{kasutaja.isikukood}</td>
                  <td><button id='kustuta' onClick={() => kustuta(index) }>Kustuta</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <table id="customers">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nimi</th>
            <th>Aeg</th>
            <th>Töötajatekood</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input ref={idRef} type="number" /></td>
            <td><input ref={nimiRef} type="text" /></td>
            <td>{new Date().toLocaleString()}</td>
            <td><input ref={isikukoodRef} type="text" /></td>
            <td><input ref={valikRef} type="checkbox" /></td>
            <td><button id='lisa' onClick={lisa}>Lisa</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default App;

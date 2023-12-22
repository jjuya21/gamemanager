"use client";
import "C:/Users/gc_de/next/my-app/src/style/globals.css";
import React, {useState, useEffect,useRef } from 'react';
import Link from "next/link";
import Axios from 'axios';

function Nav(props) {
  const [eventType, setEventType] = React.useState("attend");
  const [checkedIds, setCheckedIds] = useState([]);
  const tds = [];
  const handleCheckboxChange = (id) => {
    const isChecked = checkedIds.includes(id);

    if (isChecked) {
      setCheckedIds(checkedIds.filter((checkedId) => checkedId !== id));
    } else {
      setCheckedIds([...checkedIds, id]);
    }
  };

  const handleUpdateTier = async (id, tier) => {
    try {
      const res = await Axios.put('http://localhost:3000/api/member/tierUpdate', {
        id: id,
        tier: tier,
      });
      window.location.reload();
    } catch (error) {
      console.error('An error occurred during the request:', error);
    }
  };
  const handleDelete = async () => {
    if(checkedIds.length){
      try {
        const res = await Axios.delete('http://localhost:3000/api/member/memberDelete', {
          data: { checkedIds },
        });
        window.location.reload();
        
      } catch (error) {
        console.error('An error occurred during the request:', error);
      }
    }
  };

  for (let i = 0; i < props.topics.length; i++) {
    let t = props.topics[i];
    tds.push(<tr key={t.id}>
        <td style={{ width: 'auto' , padding:'10px'}}>
          <input
            type="checkbox"
            checked={checkedIds.includes(t.id)}
            onChange={() => handleCheckboxChange(t.id)}
          /></td>
        <td style={{ width: 'auto' , padding:'10px'}}>{t.name}</td>
        <td style={{ width: 'auto', padding:'10px'}}>{t.memberID}</td>
        <td style={{ width: 'auto', padding:'10px'}}>{t.joindate}</td>
        <td style={{ width: 'auto', padding:'10px'}}>{t.lastlogin}</td>
        <td style={{ width: 'auto', padding:'10px'}}>{t.lastlogout}</td>
        {props.tier === "High" && t.tier != "High" ? (
          <td style={{ width: 'auto', padding:'10px'}}>
            <select
            name="tier"
            value={t.tier}
            onChange={(event) => handleUpdateTier(t.id, event.target.value)}
            >
              <option value="High">High</option>
              <option value="Low">Low</option>
              <option value="Viewer">Viewer</option>
            </select>
          </td>
        ):(
          <td style={{ width: 'auto', padding:'10px'}}>{t.tier}</td>
        )}
      </tr>)
  }

  
  return <>
    <div style={{ display: 'flex' }}>
      <div style={{ marginRight: '20px' }}>
        <table>
          <thead>
            <tr>
              <th>구분</th>
              <th>이름</th>
              <th>ID</th>
              <th>가입일</th>
              <th>최근 로그인</th>
              <th>최근 로그아웃</th>
              <th>접근권한</th>
            </tr>
          </thead>
          <tbody>
            {tds}
          </tbody>
        </table>
      </div>
    </div>
    {props.tier === "High" ? (
      <div style={{textAlign:"right"}}>
      <input 
        type="button"
        value="DELETE"
        style={{backgroundColor: "#ff0000", color: "#000000"}}
        onClick={handleDelete}
      />
      </div>
    ) : (
      <></>
    )}
  </>
}

export default function Members() {
  let main = "";
  const [tier, setTier] = useState(null);
  const [topics,setTopics] = useState([]);
  const [token,setToken] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setToken(localStorage.getItem('token'));
        const res = await Axios.get('http://localhost:3000/api/member/memberRead');
        setTopics(res.data.members);
        handleDashboard();
      } catch (error) {
        console.error('An error occurred during the request:', error);
      }
    };
    const handleDashboard = async () => {
      if (token) {
        try {
          const res = await Axios.post('http://localhost:3000/api/token/tierRead',{
            token:token
          });
          setTier(res.data.tier);
        } catch (error) {
          console.error('An error occurred during the request:', error);
        }
      }
    };
    fetchData();
  }, [token]);

  const handelLogout = async () => {
      try {
        const res = await Axios.post('http://localhost:3000/api/member/logout', {
          token:token,
        });
        localStorage.setItem('token', null);
      } catch (error) {
          console.error('An error occurred during the request:', error);
      }
  };
  
  if(topics){
    main = <Nav topics={topics} tier={tier}></Nav>
  } else {
    main = <h2>계정이 존재하지 않습니다.</h2>
  }
  return (
    <main className="App">
      <header className="App-header">
        <span>운영툴</span>
      </header>
      <div className="section-content">
        <div className="sidebar">
          <Link href='/' onClick={handelLogout}>로그아웃</Link>
          <br></br>
          <Link href='/members'>01. 회원관리</Link>
          <Link href='/event'>02. 이벤트 관리</Link>
          <Link href='/log'>03. 로그 확인</Link>
        </div>
        <section className="main-content">
          <div className="background">
            <div>
              {main}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

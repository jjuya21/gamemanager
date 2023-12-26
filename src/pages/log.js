"use client";
import "C:/Users/gc_de/next/my-app/src/style/globals.css";
import React, {useState, useEffect } from 'react';
import Link from "next/link";
import Axios from 'axios';

function Nav(props) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
  
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedTopics = props.topics.slice(startIndex, endIndex);
  
    const tds = displayedTopics.map((t) => (
      <tr key={t.id}>
        <td style={{ width: 'auto', padding: '10px' }}>{t.time}</td>
        <td style={{ width: 'auto', padding: '10px' }}>{t.memberID}</td>
        <td style={{ width: 'auto', padding: '10px', textAlign: 'left' }}>{t.action}</td>
      </tr>
    ));
  
    const totalPages = Math.ceil(props.topics.length / itemsPerPage);
  
    const handlePageChange = (newPage) => {
      setCurrentPage(newPage);
    };
  
    return (
      <>
        <div>
          <table style={{clear: "both", display:"block"}}>
            <thead>
              <tr>
                <th>시간</th>
                <th>ID</th>
                <th>내용</th>
              </tr>
            </thead>
            <tbody>{tds}</tbody>
          </table>
          <div style={{  display: 'flex',justifyContent: 'center', marginTop: '10px' }}>
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                style={{
                  // 활성화된 페이지에 대한 스타일
                  fontWeight: currentPage === index + 1 ? 'bold' : 'normal',
                  textDecoration: currentPage === index + 1 ? 'underline' : 'none',
                }}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </>
    );
  }

export default function Log() {
    const [token,setToken] = useState(null);
    let contextControl = null;
    const [topics,setTopics] = useState([]);
    const [search, setSearch] = useState('');
    const [type, setType] = useState('all');
    
    const fetchData = async () => {
        try {
            setToken(localStorage.getItem('token'));
            const res = await Axios.post('http://localhost:8000/logRead', 
            { 
                withCredentials: true,
                search:search,
                type:type
            });
            setTopics(res.data.logs);
            // 이곳에 다음 코드를 추가
        } catch (error) {
            console.error('An error occurred during the request:', error);
        }
    };
    
    useEffect(() => {
        fetchData()
    }, [type]);

    const handleInputChange = (event) => {
            // 입력된 내용이 변경될 때마다 search 변수 업데이트
            setSearch(event.target.value);
        };

    const handleTypeChange = (event) => {
        setType(event.target.value);
    };

    if(topics.length === 0){
        contextControl = <>
                <select onChange={handleTypeChange}>
                    <option value="all">전체</option>
                    <option value="member">회원</option>
                    <option value="event">이벤트</option>
                    <option value="login">로그인</option>
                    <option value="logout">로그아웃</option>
                </select>
                <input
                    type="text"
                    style={{ textAlign: 'right' }}
                    value={search}
                    onChange={handleInputChange}
                />
                <button onClick={fetchData}>검색</button>
                <p></p>
                <h2>기록이 없습니다.</h2>
            </>
    } else {
        contextControl = <>
            <select onChange={handleTypeChange}>
                <option value="all">전체</option>
                <option value="member">회원</option>
                <option value="event">이벤트</option>
                <option value="login">로그인</option>
                <option value="logout">로그아웃</option>
            </select>
            <input
                type="text"
                style={{ textAlign: 'right' }}
                value={search}
                onChange={handleInputChange}
            />
            <button onClick={fetchData}>검색</button>
            <p></p>
            <Nav topics={topics}></Nav>
        </>
    }

    const handelLogout = async () => {
        try {
          const res = await Axios.post('http://localhost:3000/api/member/logout', {
            token:token,
          });
          Axios.post('http://localhost:8000/logCreate', { 
            withCredentials: true ,
            token:token,
            type:res.data.type,
            action:res.data.action
          });
          localStorage.setItem('token', null);
        } catch (error) {
            console.error('An error occurred during the request:', error);
        }
    };

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
                            {contextControl}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

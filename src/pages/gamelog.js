"use client";
import "C:/Users/gc_de/next/my-app/src/style/globals.css";
import React, {useState, useEffect } from 'react';
import Link from "next/link";
import Axios from 'axios';
import { useRouter } from 'next/navigation';

function Nav(props) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 14;
  
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedTopics = props.topics.slice(startIndex, endIndex);
  
    const tds = displayedTopics.map((t) => (
      <tr key={t.id}>
        <td style={{ width: 'auto', padding: '10px' }}>{t.time1}</td>
        <td style={{ width: 'auto', padding: '10px', textAlign: 'left' }}>{t.userID}</td>
        <td style={{ width: 'auto', padding: '10px', textAlign: 'left' }}>{t.score}</td>
        <td style={{ width: 'auto', padding: '10px', textAlign: 'left' }}>{t.playtime}초</td>
        <td style={{ width: 'auto', padding: '10px', textAlign: 'left' }}>{(t.score / t.playtime).toFixed(2)}점</td>
      </tr>
    ));
  
    const totalPages = Math.ceil(props.topics.length / itemsPerPage);
    const firstPage = 1;

    const handlePageChange = (newPage) => {
      setCurrentPage(newPage);
    };
  
    return (
      <>
        <div>
          <table>
            <thead>
              <tr>
                <th style={{ width: 'auto', padding: '10px' }}>게임횟수</th>
                <th style={{ width: 'auto', padding: '10px' }}>평균점수</th>
                <th style={{ width: 'auto', padding: '10px' }}>평균플레이시간</th>
                <th style={{ width: 'auto', padding: '10px' }}>평균초당점수</th>
              </tr>
            </thead>
            <thead>
              <tr>
                <td>{props.gamedata.totalgame}</td>
                <td>{(props.gamedata.averagescore).toFixed(1)}점</td>
                <td>{(props.gamedata.averageplaytime).toFixed(0)}초</td> 
                <td>{(props.gamedata.averagescore/props.gamedata.averageplaytime).toFixed(2)}점</td> 
              </tr>
            </thead>
          </table>
          <p></p>
          <table style={{clear: "both", display:"block"}}>
            <thead>
              <tr>
                <th>시간</th>
                <th>유저ID</th>
                <th>점수</th>
                <th>게임시간</th>
                <th>초당점수</th>
              </tr>
            </thead>
            <tbody>{tds}</tbody>
          </table>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            {currentPage > 1 && (
              <button onClick={() => handlePageChange(firstPage)}>
                {'<<'}
              </button>
            )}

            {[...Array(3).keys()].map((offset, index) => {
              const pageNumber = currentPage + offset - 1;
              return (
                pageNumber > 0 && pageNumber <= totalPages && (
                  <button
                    key={index}
                    onClick={() => handlePageChange(pageNumber)}
                    style={{
                      fontWeight: currentPage === pageNumber ? 'bold' : 'normal',
                      textDecoration: currentPage === pageNumber ? 'underline' : 'none',
                      margin: '0 5px', // 각 버튼 사이의 간격 조정
                    }}
                  >
                    {pageNumber}
                  </button>
                )
              );
            })}

            {currentPage < totalPages && (
              <button onClick={() => handlePageChange(totalPages)}>
                {'>>'}
              </button>
            )}
          </div>
        </div>
      </>
    );
  }

export default function GameLog() {
  const router = useRouter();
    const [token,setToken] = useState(null);
    let contextControl = null;
    const [topics,setTopics] = useState([]);
    const [search, setSearch] = useState('');
    const [gamedata,setGamedata] = useState(null);
    const [type, setType] = useState('time');

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
    const fetchData = async () => {
        try {
            setToken(localStorage.getItem('token'));
            const res = await Axios.post('http://localhost:8000/gamelogRead', 
            { 
                withCredentials: true,
                search:search,
                type:type
            });
            setTopics(res.data.gamelogs);
            setGamedata(res.data.gamedata)
            // 이곳에 다음 코드를 추가
        } catch (error) {
          handelLogout();
          router.replace('/');
          alert("토큰의 유효시간이 지났습니다.")
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
                  <option value="time">시간</option>
                  <option value="userID desc, time">유저ID</option>
                  <option value="score">점수</option>
                  <option value="playtime">게임시간</option>
                  <option value="score/playtime">초당점수</option>
                </select>
                <input
                    type="text"
                    style={{ textAlign: 'right' }}
                    value={search}
                    onChange={handleInputChange}
                />
                <button onClick={fetchData}>유저검색</button>
                <p></p>
                <h2>기록이 없습니다.</h2>
            </>
    } else {
        contextControl = <>
            <select onChange={handleTypeChange}>
              <option value="time">시간</option>
              <option value="userID desc, time">유저ID</option>
              <option value="score">점수</option>
              <option value="playtime">게임시간</option>
              <option value="score/playtime">초당점수</option>
            </select>
            <input
                type="text"
                style={{ textAlign: 'right' }}
                value={search}
                onChange={handleInputChange}
            />
            <button onClick={fetchData}>유저검색</button>
            <p></p>
            <Nav topics={topics} gamedata={gamedata}></Nav>
        </>
    }

    return (
        <main className="App">
            <header className="App-header">
                <span>...</span>
            </header>
            <div className="section-content">
                <div className="sidebar">
                    <Link href='/' onClick={handelLogout}>로그아웃</Link>
                    <br></br>
                    <Link href='/member'>01. 회원관리</Link>
                    <Link href='/event'>02. 이벤트 관리</Link>
                    <Link href='/log'>03. 로그 확인</Link>
                    <Link href='/gamelog'>04. 게임 로그 확인</Link>
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

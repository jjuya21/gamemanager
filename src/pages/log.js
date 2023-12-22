"use client";
import "C:/Users/gc_de/next/my-app/src/style/globals.css";
import React, {useState, useEffect } from 'react';
import Link from "next/link";
import Axios from 'axios';

function Nav(props) {
    const tds = [];

    for (let i = 0; i < props.topics.length; i++) {
        let t = props.topics[i];
        tds.push(<tr key={t.id}>
            <td style={{ width: 'auto' , padding:'10px'}}>{t.time}</td>
            <td style={{ width: 'auto', padding:'10px'}}>{t.memberID}</td>
            <td style={{ width: 'auto', padding:'10px'}}>{t.type}</td>
        </tr>)
    }

    return <>
        <div style={{ display: 'flex' }}>
            <div style={{ marginRight: '20px' }}>
                <table>
                <thead>
                    <tr>
                        <th>시간</th>
                        <th>ID</th>
                        <th>종류</th>
                    <th></th>
                    </tr>
                </thead>
                <tbody>
                    {tds}
                </tbody>
                </table>
            </div>
        </div>
    </>
}

export default function Log() {
    const [token,setToken] = useState(null);
    let contextControl = null;
    const [topics,setTopics] = useState([
    ]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setToken(localStorage.getItem('token'));
                const res = await Axios.get('http://localhost:8000/logRead', { withCredentials: true });
                setTopics(res.data.logs);
                // 이곳에 다음 코드를 추가
            } catch (error) {
                console.error('An error occurred during the request:', error);
            }
        };
        fetchData();
    }, []);

    if(topics){
        contextControl = <Nav topics={topics} onChangeMode={(_id) => {
                setMode('READ');
                setId(_id);
            }}
            onDelete={() => {
                setMode('DEFAULT');
            }}>
            </Nav>
    } else {
        contextControl = <h2>기록이 없습니다.</h2>
    }
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

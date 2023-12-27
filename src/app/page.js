"use client";
import Axios from 'axios';
import React from 'react';
import { useRouter } from 'next/navigation';


export default function Home() {
  const router = useRouter();

  const handleLogin = async (event) => {
    event.preventDefault();
    const memberID = document.frm1.memberID.value;
    const password = document.frm1.password.value;
    if (memberID && password) {
      try {
        // 서버로 데이터 전송
        const res = await Axios.post('http://localhost:3000/api/member/login', {
          memberID:memberID,
          password:password,
        });
        if (res.data.error === "wrong"){
          alert("ID 또는 PASSWORD가 틀렸습니다");
        } else {
          Axios.post('http://localhost:8000/logCreate', { 
            withCredentials: true ,
            token:res.data.token,
            type:res.data.type,
            action:res.data.action
          });
          localStorage.setItem('token', res.data.token);
          router.replace('/member');
        }
      } catch (error) {
        console.error('An error occurred during the request:', error);
      }
    } else {
      alert("로그인정보를 전부 입력해주세요.");
    }
  }

  const handleCreatemember = async () => {
    // 입력된 값들을 수집
    const memberID = document.frm2.memberID.value;
    const password = document.frm2.password.value;
    const name = document.frm2.name.value;
    const phone = document.frm2.phone.value;

    if (memberID && password && name && phone) {
      try {
        // 서버로 데이터 전송
        const res = await Axios.post('http://localhost:3000/api/member/memberCreate', {
          memberID:memberID,
          password:password,
          name:name,
          phone:phone,
        });
        if (res.data.error==='dip'){
          alert("이미 존재하는ID입니다.");
        } else {
          Axios.post('http://localhost:8000/logCreate', { 
            withCredentials: true ,
            memberID:memberID,
            type:res.data.type,
            action:res.data.action
          });
        }
        
      } catch (error) {
        console.error('An error occurred during the request:', error);
      }
    } else {
      alert("회원정보를 전부 입력해주세요.");
    }
  };
  return (
    <main className="App">
      <h2>로그인</h2>
      <form name='frm1' onSubmit={handleLogin}> 
        <table style={{margin:"auto", textAlign:'center', color:'white'}}>
          <tbody>
            <tr>
              <td>ID</td>
              <td>
                <input name="memberID" type="text" style={{textAlign:"right"}}></input>
              </td>
            </tr>
            <tr>
              <td>PASS</td>
              <td>
                <input name="password" type="password" style={{textAlign:"right"}}></input>
              </td>
            </tr>
          </tbody>
        </table>
        <h2><button type="submit">로그인</button></h2>
      </form>
      <h2 style={{paddingTop:'60px'}}>회원가입</h2>
      <form name='frm2' onSubmit={handleCreatemember}>
        <table style={{margin:"auto", textAlign:'center', color:'white'}}>
          <tbody>
            <tr><td>ID</td><td><input name="memberID" type="text" style={{textAlign:"right"}}></input></td></tr>
            <tr><td>PASS</td><td><input name="password" type="password" style={{textAlign:"right"}}></input></td></tr>
            <tr><td>이름</td><td><input name="name" type="text" style={{textAlign:"right"}}></input></td></tr>
            <tr><td>Phone</td><td><input name="phone" maxLength={11} type="text" style={{textAlign:"right"}}></input></td></tr>
          </tbody>
        </table>
        <h2><button type="submit">회원가입</button></h2>
      </form>
    </main>
  )
}

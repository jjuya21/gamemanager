import "C:/Users/gc_de/next/my-app/src/style/globals.css";
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import Axios from 'axios';
import { useRouter } from 'next/navigation';

function Nav(props) {
    const [checkedIds, setCheckedIds] = useState([]);
    const attend_tds = [];
    const pass_tds = [];
    const attend_rewards = [];
    const pass_rewards = [];
    const point_ths = [];

    const handleCheckboxChange = (id) => {
        const isChecked = checkedIds.includes(id);

        if (isChecked) {
        // If already checked, remove from the array
        setCheckedIds(checkedIds.filter((checkedId) => checkedId !== id));
        } else {
        // If not checked, add to the array
        setCheckedIds([...checkedIds, id]);
        }
        // props.checkedId(checkedIds)
    };

    for (let i = 0; i < props.topics.length; i++) {
        let t = props.topics[i];
        if (t.type === "attend") {
        attend_tds.push(<tr key={t.id}>
            <td style={{ width: 'auto', padding: '10px' }}>
            <input
                type="checkbox"
                checked={checkedIds.includes(t.id)}
                onChange={() => handleCheckboxChange(t.id)}
            /></td>
            <td style={{ width: 'auto', padding: '10px' }}>{t.title}</td>
            <td style={{ width: 'auto', padding: '10px' }}>{t.s_time}</td>
            <td style={{ width: 'auto', padding: '10px' }}>{t.e_time}</td>
        </tr>)
        attend_rewards.push(<tr key={t.id}>
            <td style={{ width: 'auto', padding: '10px' }}>{t.reward[0]}/{t.count[0]}개</td>
            <td style={{ width: 'auto', padding: '10px' }}>{t.reward[1]}/{t.count[1]}개</td>
            <td style={{ width: 'auto', padding: '10px' }}>{t.reward[2]}/{t.count[2]}개</td>
            <td style={{ width: 'auto', padding: '10px' }}>{t.reward[3]}/{t.count[3]}개</td>
            <td style={{ width: 'auto', padding: '10px' }}>{t.reward[4]}/{t.count[4]}개</td>
            <td style={{ width: 'auto', padding: '10px' }}>{t.reward[5]}/{t.count[5]}개</td>
            <td style={{ width: 'auto', padding: '10px' }}>{t.reward[6]}/{t.count[6]}개</td>
            <td style={{ width: 'auto', padding: '10px' }}>
            <a id={t.id} href={'/read' + t.id} onClick={event => {
                event.preventDefault();
                props.onChangeMode(Number(event.target.id));
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }}>🔍</a></td>
        </tr>
        )
        }
        else if (t.type === "pass") {
            pass_tds.push(<tr key={t.id}>
                <td style={{ width: 'auto', padding: '10px' }}>
                <input
                    type="checkbox"
                    checked={checkedIds.includes(t.id)}
                    onChange={() => handleCheckboxChange(t.id)}
                /></td>
                <td style={{ width: 'auto', padding: '10px' }}>{t.title}</td>
                <td style={{ width: 'auto', padding: '10px' }}>{t.s_time}</td>
                <td style={{ width: 'auto', padding: '10px' }}>{t.e_time}</td>
            </tr>)
            let rewardColumns = [];
            //
            for (let l = 0; l < props.point.length; l++) {
                rewardColumns.push(
                <td style={{ width: 'auto', padding: '10px', whiteSpace: 'nowrap' }}>
                    {t.reward[l]}/{t.count[l]}개
                </td>)
            };
            pass_rewards.push(
                <tr>
                    {rewardColumns}
                    <td>
                        <a
                        id={t.id}
                        href={'/read' + t.id}
                        onClick={(event) => {
                            event.preventDefault();
                            props.onChangeMode(Number(event.target.id));
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        >
                        🔍
                        </a>
                    </td>
                </tr>
            );
        }
    }

    if (props.point && props.point.length) {
        for (let l = 0; l < props.point.length; l++) {
        point_ths.push(<th>{props.point[l]}</th>);
        }
    }

    const handleDelete = async () => {
        if(checkedIds.length){
            try {
                const res = await Axios.delete('http://localhost:3000/api/event/eventDelete', {
                    data: { checkedIds },
                });
                if (res){
                    for (let i = 0; i < res.data.deletedevent.length; i++) {
                      Axios.post('http://localhost:8000/logCreate', { 
                          withCredentials: true ,
                          token:props.token,
                          type:res.data.type,
                          action:`님이 ${res.data.deletedevent[i]} 이벤트를 삭제했습니다.`
                        });
                    }
                  }
                window.location.reload();
            } catch (error) {
                console.error('An error occurred during the request:', error);
            }
        }
    };

    if (props.type === "attend") {
        return <>
        <div style={{ display: 'flex', overflow: "auto", height: "250px" }}>
            <div style={{ marginRight: '20px' }}>
                <table>
                    <thead>
                        <tr>
                            <th>구분</th>
                            <th>이벤트 명</th>
                            <th>시작 시간</th>
                            <th>종료 시간</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attend_tds}
                    </tbody>
                </table>
                </div>
                <div>
                <table>
                    <thead>
                        <tr>
                            <th>1일</th>
                            <th>2일</th>
                            <th>3일</th>
                            <th>4일</th>
                            <th>5일</th>
                            <th>6일</th>
                            <th>7일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attend_rewards}
                    </tbody>
                </table>
            </div>
        </div>
        {props.tier === "Viewer" ? (
            <></>
        ) : (
            <div style={{ textAlign: "right" }}>
            <input
            type="button"
            value="DELETE"
            style={{ backgroundColor: "#ff0000", color: "#000000" }}
            onClick={handleDelete}
            />
            </div>
           
        )}
        </> 
    } 
    else if (props.type === "pass") {
        return <>
            <div style={{ display: 'flex', overflow: "auto", height: "250px" }}>
                <div style={{ marginRight: '10px', }}>
                    <table>
                        <thead>
                            <tr>
                                <th>구분</th>
                                <th>이벤트 명</th>
                                <th>시작 시간</th>
                                <th>종료 시간</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pass_tds}
                        </tbody>
                    </table>
                </div>
                <div style={{ width: "650px" }}>
                    <table>
                        <tbody>
                            <tr>
                                {point_ths}
                            </tr>
                        </tbody>
                        <tbody>
                            {pass_rewards}
                        </tbody>
                    </table>
                </div>
            </div>
            {props.tier === "Viewer" ? (
            <></>
        ) : (
            <div style={{ textAlign: "right" }}>
            <input
            type="button"
            value="DELETE"
            style={{ backgroundColor: "#ff0000", color: "#000000" }}
            onClick={handleDelete}
            />
            </div>
           
        )}
        </> 
    }
}

function Article(props) {
    const rewards = [];
    const counts = [];
    
    for (let i = 0; i < props.reward.length; i++) {
        rewards.push(<td style={{ width: 'auto', padding: '10px' }}>{props.reward[i]}</td>);
    }
    for (let i = 0; i < props.count.length; i++) {
        counts.push(<td style={{ width: 'auto', padding: '10px' }}>{props.count[i]}개</td>);
    }
    const point_ths = [];
    for (let i = 0; i < props.point.length; i++) {
        point_ths.push(<th style={{ width: 'auto', padding: '10px' }}>{props.point[i]}</th>);
    }

    return (
        <article>
        <h2>{props.title}</h2>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ marginRight: '20px' }}>
                <table style={{ margin: 'auto' }}>
                    <tbody>
                        <tr>
                            <th>시작 시간</th>
                            <th>종료 시간</th>
                        </tr>
                        <tr>
                            <td style={{ width: 'auto', padding: '10px' }}>{props.s_time}</td>
                            <td style={{ width: 'auto', padding: '10px' }}>{props.e_time}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            {props.type === 'attend' ? (
            <table>
                <thead>
                    <tr>
                        <th colSpan={8}>이벤트 보상 ID</th>
                    </tr>
                    <tr>
                        <th></th>
                        <th>1일</th>
                        <th>2일</th>
                        <th>3일</th>
                        <th>4일</th>
                        <th>5일</th>
                        <th>6일</th>
                        <th>7일</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>보상 ID</th>
                        {rewards}
                    </tr>
                    <tr>
                        <th>갯수</th>
                        {counts}
                    </tr>
                </tbody>
            </table>
            ) : (
            <div style={{ overflow: 'auto', width: '500px' }}>
                <table>
                    <thead>
                        <tr>
                            <th>포인트</th>
                            {point_ths}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>보상 ID</th>
                            {rewards}
                            </tr>
                            <tr>
                            <th>갯수</th>
                            {counts}
                        </tr>
                    </tbody>
                </table>
            </div>
            )}
        </div>
        </article>
    );
}

function Create(props) {
    const [eventType, setEventType] = React.useState("attend"); // Default event type is "attend"
    const point_ths = [];
    console.log(props)
    for (let i = 0; i < props.point.length; i++) {
        point_ths.push(<th>{props.point[i]}</th>)
    }
    const handleEventTypeChange = (event) => {
        setEventType(event.target.value);
    };
    const handleCreateEvent = async (event) => {
        try {
            event.preventDefault();
            const title = event.target.title.value;
            const s_time = event.target.s_time.value;
            const e_time = event.target.e_time.value;
            const type = event.target.type.value;
            const reward = [];
            const count = [];
            if (eventType === "attend") {
                for (let i = 1; i <= 7; i++) {
                    reward.push(parseFloat(event.target[`reward${i}`].value));
                    count.push(parseFloat(event.target[`count${i}`].value));
                }
            } else if (eventType === "pass") {
                for (let i = 1; i <= 15; i++) {
                    reward.push(parseFloat(event.target[`reward${i}`].value));
                    count.push(parseFloat(event.target[`count${i}`].value));
                }
            }
            // 서버로 데이터 전송
            if (title && s_time && e_time && type && reward && count) {
                const res = await Axios.put('http://localhost:3000/api/event/eventCreate', {
                    title:title,
                    type:type,
                    s_time:s_time,
                    e_time:e_time,
                    reward:reward,
                    count:count,
                });
                if (res.data.error==='dip'){
                    alert("이미 존재하는 이벤트명입니다.");
                } else {
                    Axios.post('http://localhost:8000/logCreate', { 
                        withCredentials: true ,
                        token:props.token,
                        type:res.data.type,
                        action:res.data.action
                    });
                    props.onCreate();
                }
            } else {
                alert("이벤트명과 시간은 비어있을 수 없습니다.");
            }
        } catch (error) {
            console.error('An error occurred during the request:', error);
        }
    }   

    const currentDate = new Date();

    let year = currentDate.getFullYear();
    let month = String(currentDate.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더하고 두 자리로 패딩
    let day = String(currentDate.getDate()).padStart(2, '0');
    let hours = String(currentDate.getHours()).padStart(2, '0');
    let minutes = String(currentDate.getMinutes()).padStart(2, '0');

    const formattedStartDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;

    const nextWeekDate = new Date(currentDate);
    nextWeekDate.setDate(currentDate.getDate() + 7);

    // nextWeekDate를 이용하여 각 부분을 추출
    year = nextWeekDate.getFullYear();
    month = String(nextWeekDate.getMonth() + 1).padStart(2, '0');
    day = String(nextWeekDate.getDate()).padStart(2, '0');
    hours = String(nextWeekDate.getHours()).padStart(2, '0');
    minutes = String(nextWeekDate.getMinutes()).padStart(2, '0');
    const formattedEndDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;

    return <article>
        <h2>이벤트 추가</h2>
        <form onSubmit={handleCreateEvent}>
            <div style={{ justifyContent: 'center' }}>
                <table style={{ margin: "auto" }}>
                    <thead>
                        <tr>
                            <th>이벤트 종류</th>
                            <th>이벤트 명</th>
                            <th>시작 시간</th>
                            <th>종료 시간</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                            <select name="type" value={eventType} onChange={handleEventTypeChange}>
                                <option value="attend">출석체크</option>
                                <option value="pass">배틀패스</option>
                            </select>
                            </td>
                            <td><input type="text" name="title" placeholder="이벤트 명" /></td>
                            <td><input type="text" name="s_time" value={formattedStartDateTime} placeholder="XXXX-XX-XX XX:XX" /></td>
                            <td><input type="text" name="e_time" value={formattedEndDateTime} placeholder="XXXX-XX-XX XX:XX"></input></td>
                        </tr>
                    </tbody>
                </table>
                <p></p>
                <h2>이벤트 보상 ID</h2>
                {eventType === "attend" ? (
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>1일</th>
                            <th>2일</th>
                            <th>3일</th>
                            <th>4일</th>
                            <th>5일</th>
                            <th>6일</th>
                            <th>7일</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>보상 ID</th>
                            <td><input type="int" name="reward1" placeholder="1일" style={{ width: '150px' }} /></td>
                            <td><input type="int" name="reward2" placeholder="2일" style={{ width: '150px' }} /></td>
                            <td><input type="int" name="reward3" placeholder="3일" style={{ width: '150px' }} /></td>
                            <td><input type="int" name="reward4" placeholder="4일" style={{ width: '150px' }} /></td>
                            <td><input type="int" name="reward5" placeholder="5일" style={{ width: '150px' }} /></td>
                            <td><input type="int" name="reward6" placeholder="6일" style={{ width: '150px' }} /></td>
                            <td><input type="int" name="reward7" placeholder="7일" style={{ width: '150px' }} /></td>
                        </tr>
                        <tr>
                            <th>갯수</th>
                            <td><input type="int" name="count1" placeholder="1일" value={1} style={{ width: '150px' }} /></td>
                            <td><input type="int" name="count2" placeholder="2일" value={1} style={{ width: '150px' }} /></td>
                            <td><input type="int" name="count3" placeholder="3일" value={1} style={{ width: '150px' }} /></td>
                            <td><input type="int" name="count4" placeholder="4일" value={1} style={{ width: '150px' }} /></td>
                            <td><input type="int" name="count5" placeholder="5일" value={1} style={{ width: '150px' }} /></td>
                            <td><input type="int" name="count6" placeholder="6일" value={1} style={{ width: '150px' }} /></td>
                            <td><input type="int" name="count7" placeholder="7일" value={1} style={{ width: '150px' }} /></td>
                        </tr>
                    </tbody>
                </table>
                ) : (

                <div style={{ overflow: "auto", width: "1200px" }}>
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>1</th>
                                <th>2</th>
                                <th>3</th>
                                <th>4</th>
                                <th>5</th>
                                <th>6</th>
                                <th>7</th>
                                <th>8</th>
                                <th>9</th>
                                <th>10</th>
                                <th>11</th>
                                <th>12</th>
                                <th>13</th>
                                <th>14</th>
                                <th>15</th>
                            </tr>
                            <tr>
                                <th>포인트</th>
                                {point_ths}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>보상 ID</th>
                                <td><input type="int" name="reward1" placeholder="1" style={{ width: '150px' }} /></td>
                                <td><input type="int" name="reward2" placeholder="2" style={{ width: '150px' }} /></td>
                                <td><input type="int" name="reward3" placeholder="3" style={{ width: '150px' }} /></td>
                                <td><input type="int" name="reward4" placeholder="4" style={{ width: '150px' }} /></td>
                                <td><input type="int" name="reward5" placeholder="5" style={{ width: '150px' }} /></td>
                                <td><input type="int" name="reward6" placeholder="6" style={{ width: '150px' }} /></td>
                                <td><input type="int" name="reward7" placeholder="7" style={{ width: '150px' }} /></td>
                                <td><input type="int" name="reward8" placeholder="8" style={{ width: '150px' }} /></td>
                                <td><input type="int" name="reward9" placeholder="9" style={{ width: '150px' }} /></td>
                                <td><input type="int" name="reward10" placeholder="10" style={{ width: '150px' }} /></td>
                                <td><input type="int" name="reward11" placeholder="11" style={{ width: '150px' }} /></td>
                                <td><input type="int" name="reward12" placeholder="12" style={{ width: '150px' }} /></td>
                                <td><input type="int" name="reward13" placeholder="13" style={{ width: '150px' }} /></td>
                                <td><input type="int" name="reward14" placeholder="14" style={{ width: '150px' }} /></td>
                                <td><input type="int" name="reward15" placeholder="15" style={{ width: '150px' }} /></td>
                            </tr>
                            <tr>
                                <th>갯수</th>
                                <td><input type="int" name="count1" placeholder="1" value={1} style={{ width: '150px' }} /></td>
                                <td><input type="int" name="count2" placeholder="2" value={1} style={{ width: '150px' }} /></td>
                                <td><input type="int" name="count3" placeholder="3" value={1} style={{ width: '150px' }} /></td>
                                <td><input type="int" name="count4" placeholder="4" value={1} style={{ width: '150px' }} /></td>
                                <td><input type="int" name="count5" placeholder="5" value={1} style={{ width: '150px' }} /></td>
                                <td><input type="int" name="count6" placeholder="6" value={1} style={{ width: '150px' }} /></td>
                                <td><input type="int" name="count7" placeholder="7" value={1} style={{ width: '150px' }} /></td>
                                <td><input type="int" name="count8" placeholder="8" value={1} style={{ width: '150px' }} /></td>
                                <td><input type="int" name="count9" placeholder="9" value={1} style={{ width: '150px' }} /></td>
                                <td><input type="int" name="count10" placeholder="10" value={1} style={{ width: '150px' }} /></td>
                                <td><input type="int" name="count11" placeholder="11" value={1} style={{ width: '150px' }} /></td>
                                <td><input type="int" name="count12" placeholder="12" value={1} style={{ width: '150px' }} /></td>
                                <td><input type="int" name="count13" placeholder="13" value={1} style={{ width: '150px' }} /></td>
                                <td><input type="int" name="count14" placeholder="14" value={1} style={{ width: '150px' }} /></td>
                                <td><input type="int" name="count15" placeholder="15" value={1} style={{ width: '150px' }} /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                )}
            </div>
            <p>
                <input type="submit" value="작성 완료" style={{ backgroundColor: "#3498db", color: "#000000" }} />
                <input type="button" value="취소" style={{ backgroundColor: "#ff0000", color: "#000000" }} onClick={() => props.onCancel()} />
            </p>
        </form>
    </article>
}

function Update(props) {
    const [s_time, sets_time] = useState(props.s_time);
    const [e_time, sete_time] = useState(props.e_time);
    const [reward, setReward] = useState([...props.reward]);
    const [count, setCount] = useState([...props.count]);
    const [point, setPoint] = useState([...props.point]);

    const rewards = [];
    const counts = [];
    const points = [];

    if (props.type === "attend") {
        for (let i = 0; i < 7; i++) {
            rewards.push(
                <td><input
                key={i}
                type="number"
                name={`reward${i}`}
                placeholder={`reward ${i + 1}`}
                value={reward[i]}
                style={{ width: '150px' }}
                onChange={(event) => {
                    const updatedRewards = [...reward];
                    updatedRewards[i] = event.target.value;
                    setReward(updatedRewards);
                }}
                /></td>
            );
            counts.push(
                <td><input
                key={i}
                type="number"
                name={`count${i}`}
                placeholder={`count ${i + 1}`}
                value={count[i]}
                style={{ width: '150px' }}
                onChange={(event) => {
                    const updatedcounts = [...count];
                    updatedcounts[i] = event.target.value;
                    setCount(updatedcounts);
                }}
                /></td>
            );
        }
    }
    else if (props.type === "pass") {
        
        for (let i = 0; i < 15; i++) {
            rewards.push(
                <td><input
                key={i}
                type="number"
                name={`reward${i}`}
                placeholder={`reward ${i + 1}`}
                value={reward[i]}
                style={{ width: '150px' }}
                onChange={(event) => {
                    const updatedRewards = [...reward];
                    updatedRewards[i] = event.target.value;
                    setReward(updatedRewards);
                }}
                /></td>
            );
            counts.push(
                <td><input
                key={i}
                type="number"
                name={`count${i}`}
                placeholder={`count ${i + 1}`}
                value={count[i]}
                style={{ width: '150px' }}
                onChange={(event) => {
                    const updatedcounts = [...count];
                    updatedcounts[i] = event.target.value;
                    setCount(updatedcounts);
                }}
                /></td>
            );
        }
    }
    for (let i = 0; i < 15; i++) {
        points.push(
            <td><input
            key={i}
            type="number"
            name={`point${i}`}
            placeholder={`point ${i + 1}`}
            value={point[i]}
            style={{ width: '150px' }}
            onChange={(event) => {
                const updatedPoints = [...point];
                updatedPoints[i] = event.target.value;
                setPoint(updatedPoints);
            }}
            /></td>
        );
    }

    const handleUpdateEvent = async (event) => {
        try {
            event.preventDefault();
            const updatedPoint = Array.from(event.target.elements)
            .filter((elem) => elem.name.startsWith('point'))
            .map((elem) => parseFloat(elem.value));
            const updatedReward = Array.from(event.target.elements)
            .filter((elem) => elem.name.startsWith('reward'))
            .map((elem) => parseFloat(elem.value));
            const updatedCount = Array.from(event.target.elements)
            .filter((elem) => elem.name.startsWith('count'))
            .map((elem) => parseFloat(elem.value));

            const id = props.id;
            const title = props.title;
            const s_time = event.target.s_time.value;
            const e_time = event.target.e_time.value;
            const reward = updatedReward;
            const count = updatedCount;
            const point = updatedPoint;

            // 서버로 데이터 전송
            if (s_time && e_time) {
                const res = await Axios.put('http://localhost:3000/api/event/eventUpdate', {
                    id:id,
                    title:title,
                    s_time:s_time,
                    e_time:e_time,
                    reward:reward,
                    count:count,
                    point:point,
                });
                if(res) {
                    Axios.post('http://localhost:8000/logCreate', { 
                        withCredentials: true ,
                        token:props.token,
                        type:res.data.type,
                        action:res.data.action
                    });
                    props.onUpdate();
                }
            } else {
                alert("이벤트명과 시간은 비어있을 수 없습니다.");
            }
        } catch (error) {
            console.error('An error occurred during the request:', error);
        }
    }   
    return <article>
        <h2>이벤트 수정</h2>
        <form onSubmit={handleUpdateEvent}>
            <div style={{ justifyContent: 'center' }}>
                <table style={{ margin: "auto" }}>
                    <thead>
                        <tr>
                            <th>이벤트 명</th>
                            <th>시작 시간</th>
                            <th>종료 시간</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{props.title}</td>
                            <td><input type="text" name="s_time" placeholder="s_time" value={s_time} onChange={event => {
                            sets_time(event.target.value);
                            }}></input></td>
                            <td><input type="text" name="e_time" placeholder="e_time" value={e_time} onChange={event => {
                            sete_time(event.target.value);
                            }}></input></td>
                        </tr>
                    </tbody>
                </table>
                <p></p>
                <h2>이벤트 보상 ID</h2>
                {props.type === "attend" ? (
                    <table>
                        <thead>
                            <tr>
                            <th></th>
                            <th>1일</th>
                            <th>2일</th>
                            <th>3일</th>
                            <th>4일</th>
                            <th>5일</th>
                            <th>6일</th>
                            <th>7일</th>
                            </tr>
                            <tr><th>보상 ID</th>{rewards}</tr>
                            <tr><th>갯수</th>{counts}</tr>
                        </thead>
                    </table>
                ) : (
                <div style={{ overflow: "auto", width: "1200px" }}>
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>1</th>
                                <th>2</th>
                                <th>3</th>
                                <th>4</th>
                                <th>5</th>
                                <th>6</th>
                                <th>7</th>
                                <th>8</th>
                                <th>9</th>
                                <th>10</th>
                                <th>11</th>
                                <th>12</th>
                                <th>13</th>
                                <th>14</th>
                                <th>15</th>
                            </tr>
                            <tr>
                                <th>포인트</th>
                                {points}
                            </tr>
                            <tr>
                                <th>보상 ID</th>
                                {rewards}
                            </tr>
                            <tr>
                                <th>갯수</th>
                                {counts}
                            </tr>
                        </thead>
                    </table>
                </div>
                )}
            </div>
            <p><button type="submit" style={{ backgroundColor: "#3498db", color: "#000000" }}>수정 완료</button></p>
        </form>
    </article>
}

export default function Event() {
    const router = useRouter();
    const [token,setToken] = useState(null);
    const [mode, setMode] = useState('DEFAULT');
    const [id, setId] = useState(null);
    const [tier, setTier] = useState(null);
    const [topics,setTopics] = useState([
    ]);
    const [points, setPoints] = useState({ point: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500] });

    let content = null;
    let contextControl = null;

    let attend_main, pass_main;
    const attend_topics = [];
    const pass_topics = [];
    let attend_count = 0;
    let pass_count = 0;

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
            router.replace('/');
        }
    };


    useEffect(() => {
        setToken(localStorage.getItem('token'));
        const fetchData = async () => {
            try {
                let res = await Axios.get('http://localhost:3000/api/event/eventRead');
                setTopics(res.data.events);
                res = await Axios.get('http://localhost:3000/api/event/pointRead');
                setPoints(res.data.point);
            } catch (error) {
                handelLogout();
                alert("토큰의 유효시간이 지났습니다.")
                router.replace('/');
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
                    handelLogout();
                    router.replace('/');
                    alert("토큰의 유효시간이 지났습니다.")
                }
            }
        };

        handleDashboard();
        fetchData();
    }, [token]);

    if (mode === "DEFAULT") {
        if (tier === "Viewer") {
            contextControl = <></>
        } else if (tier === "Low" || tier === "High") {
            contextControl = <>
            <input type="button" value="CREATE" style={{ textAlign: "right", backgroundColor: "#3498db", color: "#000000" }} href="/create" onClick={event => {
                event.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setMode('CREATE');
            }}></input>
            </>
        }
        
    }
    else if (mode === 'READ') {
        let title, s_time, e_time, reward, point, count, type = null;
        for (let i = 0; i < topics.length; i++) {
            if (topics[i].id === id) {
                title = topics[i].title;
                s_time = topics[i].s_time;
                e_time = topics[i].e_time;
                reward = topics[i].reward;
                count = topics[i].count;
                type = topics[i].type;
                break;
            }
        }
        point = points;
        content = <Article title={title} s_time={s_time} e_time={e_time} reward={reward} count={count} type={type} point={point}></Article>
        if (tier === "Viewer") {
            contextControl = <>
                <input type="button" value="CANCLE" href="/default" onClick={event => {
                event.preventDefault();
                setMode('DEFAULT');
            }}></input></>
        }
        else {
            contextControl = <>
            <input type="button" value="UPDATE" href={'/update/' + id} style={{ backgroundColor: "#00ff00", color: "#000000" }} onClick={event => {
                event.preventDefault();
                setMode('UPDATE');
            }}></input>
            <input type="button" value="CANCLE" href="/default" onClick={event => {
                event.preventDefault();
                setMode('DEFAULT');
            }}></input>
            </>
        }
    }
    else if (mode === 'CREATE') {
        let point = null;
        point = points;
        content = <Create point={point} token={token}
        onCancel={() => {
            setMode('DEFAULT');
        }}
        onCreate={() => {
            console.log('create')
            setMode('DEFAULT');
            window.location.reload();
        }}
        ></Create>
    }
    else if (mode === 'UPDATE') {
        let title, s_time, e_time, reward, count, type, point = null;
        for (let i = 0; i < topics.length; i++) {
        if (topics[i].id === id) {

            title = topics[i].title;
            s_time = topics[i].s_time;
            e_time = topics[i].e_time;
            reward = topics[i].reward;
            count = topics[i].count;
            type = topics[i].type;
            break;
        }
        }
        point = points;
        content = <Update id={id} title={title} s_time={s_time} e_time={e_time} reward={reward} count={count} type={type} point={point} token={token}
        onUpdate={() => {
            setMode('DEFAULT');
            window.location.reload();
        }}></Update>
    }


    for (let i = 0; i < topics.length; i++) {
        if (topics[i].type === "attend") {
            attend_topics.push(topics[i])
            attend_count++;
        }
        else if (topics[i].type === "pass") {
            pass_topics.push(topics[i])
            pass_count++;
        }
    }
    if (attend_count>0) {
        attend_main = 
                    <Nav topics={attend_topics} tier={tier} token={token} type="attend" onChangeMode={(_id) => {
                        setMode('READ');
                        setId(_id);
                    }}>
                    </Nav>
    }
    if (pass_count>0) {
        pass_main = 
                    <Nav topics={pass_topics} tier={tier} token={token} point={points} type="pass" onChangeMode={(_id) => {
                        setMode('READ');
                        setId(_id);
                    }}>
                    </Nav>
    }

    return (
        <div className="App">
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
                        {content}
                        <div style={{ textAlign: "right" }}>
                            {contextControl}
                        </div>
                    </div>
                    <div>
                        <div style={{ textAlign: "left" }}>출석체크 이벤트 - 7일</div>
                        {attend_main}
                    </div>
                    <p></p>
                    <div>
                        <div style={{ textAlign: "left" }}>배틀 패스</div>
                        {pass_main}
                    </div>
                </div>
            </section>
        </div>
        </div>
    );
}

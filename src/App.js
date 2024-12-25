import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from "react";
import { gapi } from "gapi-script";

// Google Sheets API를 사용하려면 정확한 스프레드시트 ID와 범위가 필요합니다.
const SPREADSHEET_ID = "1lceeIMn6B_-DJABboN6vcTe5jdOz8GvfYX6nVdPe3DU"; // 스프레드시트 ID
const RANGE = "기록순위!A1:D10"; // 가져올 데이터 범위
const API_KEY = "AIzaSyAKnbmtCHWHmNTWW7hwq09GmAo11uHxZQk"; // GCP에서 생성된 API 키

function App() {

    // 상태 정의: 백팀과 청팀의 정보 관리
    const [players, setPlayers] = useState([
      { name: '박덕진', attendance: 1, score: 0, assist: 0, defense: 1, mvp: 0, team: '백팀' },
      { name: '오현택', attendance: 0, score: 1, assist: 0, defense: 1, mvp: 1, team: '청팀' },
      // 더 많은 선수 데이터를 추가할 수 있습니다.
    ]);
  
    // 숫자 증가/감소 함수
    const handleChange = (index, field, delta) => {
      const updatedPlayers = [...players];
      updatedPlayers[index][field] = updatedPlayers[index][field] + delta;
      setPlayers(updatedPlayers);
    };
    
  const [data, setData] = useState([]);

  useEffect(() => {
    // 구글 API 클라이언트 로드
    function fetchData() {
      gapi.load("client", async () => {
        try {
          // API 클라이언트 초기화, Discovery Docs를 추가하여 시트 API 초기화
          await gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"], // Discovery Docs 추가
          });

          // gapi.client.sheets 객체가 정의되었는지 확인 후 데이터를 가져옵니다.
          const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: RANGE,
          });

          // 가져온 데이터를 state에 저장
          setData(response.result.values || []); // 데이터가 없으면 빈 배열 처리
        } catch (error) {
          console.error("Error fetching data from Google Sheets", error);
        }
      });
    }

    // fetchData() 호출
    fetchData();
  }, []); // 페이지 로드 시 한번만 실행되도록 빈 배열 전달

  return (
    <div>
      <h1>Google Sheets Data</h1>
      {/* 데이터가 없으면 로딩 메시지 출력 */}
      {data.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              {/* 첫 번째 행(헤더)을 표시 */}
              {data[0]?.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* 첫 번째 행을 제외한 데이터를 표시 */}
            {data.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}


<h1>2024년 12월 15일 경기</h1>
      <h2>日の出</h2>
      <table>
        <thead>
          <tr>
            <th>이름</th>
            <th>출석</th>
            <th>득점</th>
            <th>어시</th>
            <th>수비</th>
            <th>MVP</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  value={player.name}
                  onChange={(e) => handleChange(index, 'name', e.target.value)}
                />
              </td>
              <td>
                <button onClick={() => handleChange(index, 'attendance', 1)}>+</button>
                <span>{player.attendance}</span>
                <button onClick={() => handleChange(index, 'attendance', -1)}>-</button>
              </td>
              <td>
                <button onClick={() => handleChange(index, 'score', 1)}>+</button>
                <span>{player.score}</span>
                <button onClick={() => handleChange(index, 'score', -1)}>-</button>
              </td>
              <td>
                <button onClick={() => handleChange(index, 'assist', 1)}>+</button>
                <span>{player.assist}</span>
                <button onClick={() => handleChange(index, 'assist', -1)}>-</button>
              </td>
              <td>
                <button onClick={() => handleChange(index, 'defense', 1)}>+</button>
                <span>{player.defense}</span>
                <button onClick={() => handleChange(index, 'defense', -1)}>-</button>
              </td>
              <td>
                <button onClick={() => handleChange(index, 'mvp', 1)}>+</button>
                <span>{player.mvp}</span>
                <button onClick={() => handleChange(index, 'mvp', -1)}>-</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
  );
}

export default App;

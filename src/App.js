import {useEffect, useState} from 'react'
import './App.css';
import text from './message'

function App() {
  if (!localStorage.getItem("shukanka")){
      localStorage.setItem("shukanka",JSON.stringify([]))
  }
  const [data, setData] = useState([]);
  const [input, setInput] = useState("");
  const [appInfo, setAppInfo] = useState("")
  const [displayAppInfo, setDisplayAppInfo] = useState(true)
  
  useEffect(()=>{
    let userData = JSON.parse(localStorage.getItem("shukanka"))
    if(userData.length >0){
      userData= userData.map((elem)=>{
        if(elem.today_date !== new Date().toLocaleDateString() ){
          
          elem.today_followed = false
        }
        if(elem.today_date !== new Date().toLocaleDateString() && elem.days_remaining >0){
          elem.days_remaining = elem.days_remaining-1
        }else{
          let scoreObj = {
            "a" : "5 Excellent",
            "b" : "4 good ",
            "c" : "Try Again"
          }
          let score = elem.days - elem.accomplished;
          if(score === 0 ){
            elem.result = scoreObj.a
          }else if (score >0 && score <5){
            elem.result = scoreObj.b
          }else{
            elem.result = scoreObj.c
          }
        }
        return elem
      })
    }
    setAppInfo(text)
    setData(userData)
    if (data.length % 5 == 0) {
      setTimeout(() => {
        setDisplayAppInfo(false);
      }, 10000);
    } else {
      setDisplayAppInfo(false);
    }
    
  },[])

  function changeHandler(e){
    setInput(e.target.value)
  }

  function setLocalStorage(){
     localStorage.setItem("shukanka",JSON.stringify(data))
  }

  function addTask(){
    let newTask ={
      id:input,
      task:input,
      days:66,
      accomplished:0,
      days_remaining:66,
      today_followed:false,
      today_date:new Date().toLocaleDateString(),
      result:""
    }
    setInput("");
    data.push(newTask)
    setLocalStorage()
  }
  function changeStatus(key){
    let newData = data.map((elem)=>{
      if(elem.id === key && elem.days_remaining > 0){
        elem.today_followed = !elem.today_followed
        if(elem.today_followed){
          elem.accomplished = elem.accomplished+1
        }else{
          let days = elem.accomplished-1
          elem.accomplished = (days>0)?days:0
        }
      }
      return elem
    })
    setData(newData);
    setLocalStorage()
  }
  function deleteTask(id){
      let updateData = data.filter((elem)=>elem.id !=id)
      setData(updateData)
      localStorage.setItem("shukanka",JSON.stringify(updateData))
  }
 
  return (
    <div className="App">
      <header className="App-header">
      {(displayAppInfo)?
      
      <div>
          <p>{appInfo} </p>
      </div>:
      <>
      <div>
        <input placeholder='Add your Shukanka' name = "finput" value={input} onChange = {changeHandler}></input>
        <button onClick={addTask} >+</button>
      </div>
      <table>
        <caption>SHUKANKA</caption>
        <thead>
          <tr>
          <th>Task</th>
          <th>T. Days</th>
          <th>Rem. Days</th>
          <th>T. Followed</th>
          <th>Result</th>
          <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {
            data.map((elem)=>{
              return <tr key ={elem.id} style ={(elem.days_remaining > 0)?{}:{textDecoration:"line-through"}}>
              <td>{elem.task}</td>
              <td>{elem.days}</td>
              <td>{elem.days_remaining}</td>
              <td onClick ={()=>{changeStatus(elem.id)}}id="status" style = {(elem.today_followed)?{backgroundColor:"green"}:{backgroundColor:"red"}}>{elem.today_followed}</td>
              <td >{(elem.result)?`${elem.result}`:`Accomplished ${elem.accomplished} days`}</td>
              <td><button id = "delete" onClick = {()=>{deleteTask(elem.id)}}>X</button></td>
              </tr>
            })
          }
        </tbody>
      </table>
      </>
      }
      </header>
    </div>
  );
}

export default App;

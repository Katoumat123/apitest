import logo from './logo.svg';
import './App.css';
import React from 'react'
import { Button, Input } from 'antd';
import axios from 'axios';
const math = require('mathjs');

function checkEquation(equation) {
  equation = equation.replaceAll('X', 'x')

  return equation
}

function calBisection(initialEquation, initialXL, initialXR, initialError) {
  let equation = checkEquation(initialEquation)
  equation = math.parse(equation).compile()
  let xl = math.bignumber(initialXL)
  let xr = math.bignumber(initialXR)
  let error = math.bignumber(initialError)


  let arr = []
  arr.push(<div className="ontopresult"> คำตอบของการคำนวนคือ</div>);

  let xm = math.divide(math.add(xl, xr), 2)

  let fx = math.multiply(equation.evaluate({ x: xm }), equation.evaluate({ x: xr }))

  if (fx < 0) {
    xl = xm;
  }
  else {
    xr = xm;
  }

  let checkError = 9999;

  let oldXm = xm;

  let i = 0;
  while (checkError > error) {

    xm = math.divide(math.add(xl, xr), 2)

    fx = math.multiply(equation.evaluate({ x: xm }), equation.evaluate({ x: xr }))

    if (fx < 0) {
      xl = xm;
    }
    else {
      xr = xm;
    }
    checkError = Math.abs((xm - oldXm) / xm);

    oldXm = xm;


    //arr.push({key : i , iteration : i.toString() ,xm : xm.toFixed(15).toString() ,error : checkError.toFixed(15).toString()})
    arr.push(<div> iteration:{i}: {xm.toFixed(15).toString()} Error:{checkError.toFixed(15).toString()}</div>)
    i++;

  }
  return (arr);
}





class App extends React.Component {
  state = {
    Equation:'',
    XL: '',
    XR: '',
    ERROR: '',
    result: '',
    apiData: [],
    
  }
  

  async getapi(){
    let tempData = null
    await axios.get("https://my-json-server.typicode.com/Katoumat123/testkatoumat/root").then(res => {tempData = res.data})
    this.setState({Equation: tempData[0]["equation"],XL: tempData[0]["xl"],XR: tempData[0]["xr"],ERROR: tempData[0]["error"]});
    
  }
  
  get_api = e =>{
    this.getapi()
  }

  getEquation = e => {
    this.setState({
      EX: e.target.value,
    });
  }

  getXL = e => {
    this.setState({
      XL: e.target.value,
    });
  }

  getXR = e => {
    this.setState({
      XR: e.target.value,
    });
  }

  getERR = e => {
    this.setState({
      ERROR: e.target.value,
    });
  }


  show_value = e => {
    this.setState({
      result: calBisection(this.state.Equation,parseFloat(this.state.XL), parseFloat(this.state.XR), parseFloat(this.state.ERROR))
    });
  }

  render() {
    return (
      <div>
        <h1>Test</h1>
        <div>
          <span>F(x):<input placeholder="x^4-13" onChange={this.getEquation} value = {this.state.Equation} ></input></span>
          <span>XL:<input placeholder="2.0" onChange={this.getXL} value = {this.state.XL}></input></span>
          <span>XR:<input  placeholder="1.5" onChange={this.getXR} value = {this.state.XR}></input></span>
          <span>ERROR:<input  placeholder="0.000001" onChange={this.getERR} value = {this.state.ERROR}></input></span>
        </div>
        <span><button onClick={this.show_value}>คำนวณ</button></span>
        <span><button onClick={this.get_api}>ตัวอย่าง</button></span>
        <div>
          {this.state.result}
        </div>
      
      </div>


    )
  }
}

export default App;



import { Col, Image } from 'react-bootstrap';
import {Routes, Route, useNavigate} from 'react-router-dom';
import {useState, useContext} from 'react';



export const ActionButton = (props) => {
  
  return (

    <Col style={{ paddingTop: props.paddingTop }}>
      <Col style={{ height: "50%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Image style ={{cursor: "pointer"}} onClick={() => props.handleRemove()} src={props.image} />
      </Col>
      <Col style={{ paddingLeft: "18px", paddingRight: "18px" }}>
        <p className="text-center" style={{ color: 'white', fontSize: "18px" }}>{props.text}</p>
      </Col>
    </Col>
  )
}

export const SearchButton = (props) => {
  
  return (
    <Col style={{ paddingTop: props.paddingTop }}>
      <Col style={{ height: "50%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Image style={{cursor: "pointer"}} className='searchImage' onClick={()=> props.show ? props.setShow(false) : props.setShow(true)} src={props.image}/>
      </Col>
      <Col style={{ paddingLeft: "18px", paddingRight: "18px" }}>
        <p className="text-center" style={{ color: 'white', fontSize: "18px" }}>{props.text}</p>
      </Col>
    </Col>
  )
}

export const LockButton = (props) => {
  
  return (

    <Col style={{ paddingTop: props.paddingTop }}>
      <Col style={{ height: "50%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Image style ={{cursor: "pointer"}} onClick={() => props.handleRemove()} src={props.image} />
      </Col>
      <Col style={{ paddingLeft: "18px", paddingRight: "18px" }}>
        <p className="text-center" style={{ color: 'white', fontSize: "18px" }}>{props.text}</p>
      </Col>
    </Col>
  )
}

export const ClearButton = (props) => {
  
  return (

    <Col style={{ paddingTop: props.paddingTop }}>
      <Col style={{ height: "50%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Image style ={{cursor: "pointer"}} src={props.image} />
      </Col>
      <Col style={{ paddingLeft: "18px", paddingRight: "18px" }}>
        <p className="text-center" style={{ color: 'white', fontSize: "18px" }}>{props.text}</p>
      </Col>
    </Col>
  )
}
import React, { useState, useEffect, useReducer, useRef } from 'react';
import styles from './css/homepage.module.css';
import { Col, Nav } from 'react-bootstrap';
import { LinkContainer } from "react-router-bootstrap";
import { IsAuthenticated } from "../controllers/authController";
import LoginPage from './loginPage';

const HomePage = () => {

  return (
    <Col className={styles.background}>
      <div style={{ minHeight: "56px" }}></div>
      <div className={styles.circlesContainer}>
        <LinkContainer to="/admin/users">
          <div className={styles.usersCircle}>
            <h1>Users</h1>
          </div>
        </LinkContainer>
        
        <LinkContainer to="/admin/cabinlists">
        <div className={styles.cabinsCircle}>
          <h1>Cabin<br></br>lists</h1>
        </div>
        </LinkContainer>
      </div>
    </Col>
  )
  
}


export default HomePage;
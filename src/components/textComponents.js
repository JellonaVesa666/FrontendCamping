import { Col } from 'react-bootstrap';

export const Title = (props) => {
  return (
    <Col style={{height: "100%"}}>
      <Col style={{height: "40%", display: "flex", justifyContent:"center", alignItems: "center", paddingTop: "3%"}}>
      <p style={{color:'white', fontSize: "36px", alignSelf: "flex-start"}}>{props.topText}</p>
      </Col>
      <Col style={{height: "34%", display: "flex", justifyContent:"center", alignItems: "top"}}>
      <p style={{color:'white', fontSize: "24px"}}>{props.bottomText}</p>
      </Col>
      <Col style={{backgroundColor: "white", height: "1%"}}></Col>
      <Col style={{height: "25%"}}></Col>
    </Col>
  )
}
import { Col, Image } from 'react-bootstrap';

export const DrawerButton = (props) => {

  return (
    <Col style={{ paddingTop: props.paddingTop }}>
      <Col style={{ height: "50%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Image src={props.image} onClick={() => props.handleClick()}/>
      </Col>
      <Col style={{ paddingLeft: "18px", paddingRight: "18px" }}>
        <p className="text-center" style={{ color: 'white', fontSize: "18px" }}>{props.text}</p>
      </Col>
    </Col>
  )
}
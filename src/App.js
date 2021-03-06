import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  HashRouter,
  Link
} from 'react-router-dom';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Clientes from './componentes/clientes';
import Servicios from './componentes/servicios';
import Empleados from './componentes/empleados';

function App() {

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className="App">
      <Router basename={process.env.PUBLIC_URL}>
        <Navbar color="primary" dark expand="md">
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <NavbarBrand href="/empleados">Empleados</NavbarBrand>
              </NavItem>
              <NavItem>
                <NavbarBrand href="/clientes">Clientes</NavbarBrand>
              </NavItem>
              <NavItem>
                <NavbarBrand href="/servicios">Servicios</NavbarBrand>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
        
        <Switch>
          <Route path="/clientes" component={Clientes}></Route>
          <Route path="/servicios" component={Servicios}></Route>
          <Route path="/empleados" component={Empleados}></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;

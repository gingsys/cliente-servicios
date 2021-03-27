import React, {useState, useEffect} from 'react';
import{
  BrowserRouter as Router,
  Switch,
  Route,
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
import Contacto from './componentes/clientes';
import Servicios from './componentes/servicios';
import Empleados from './componentes/empleados';

function App() {  

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
   
  return (
    <Router>
      <div className="App">
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
          <Route path="/clientes">
            <Contacto />
          </Route>
          <Route path="/servicios">
            <Servicios />
          </Route>
          <Route path="/empleados">
            <Empleados />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

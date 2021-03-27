import React from 'react';
import axios from 'axios';
import {useState, useEffect} from 'react';
import {Modal,ModalBody,ModalFooter,ModalHeader} from 'reactstrap';

const Empleados = () =>{
  const baseUrl = "https://localhost:44350/api/empleados";
  const distUrl = "https://localhost:44350/api/distritos";
  const [empleado, setEmpleado] = useState([]);
  const [distritos, setDistritos] = useState([]);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState({
    codEmp: "",
    nomEmp: "",
    dni: "",
    telfEmp: "",
    codDis: "",
    dirEmp: "",
    email: ""
  })


  const abrirCerrarModalInsertar = () => {
    setModalInsertar(!modalInsertar);
  }
  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar);
  }
  const abrirCerrarModalEliminar = () => {
    setModalEliminar(!modalEliminar);
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setEmpleadoSeleccionado({
      ...empleadoSeleccionado,
      [name]: value
    });
    console.log(empleadoSeleccionado);
  }

  const peticionGet = async () => {
    await axios.get(baseUrl)
      .then(response => {
        setEmpleado(response.data);
      }).catch(error => {
        console.log(error);
      })
  }

  const distritosGet = async () => {
    await axios.get(distUrl)
      .then(response => {
        setDistritos(response.data);
      }).catch(error => {
        console.log(error);
      })
  }

  const peticionPost = async () => {
    delete empleadoSeleccionado.codEmp;
    await axios.post(baseUrl, empleadoSeleccionado)
      .then(response => {
        setEmpleado(empleado.concat(response.data));
        peticionGet();
        abrirCerrarModalInsertar();
      }).catch(error => {
        console.log(error);
      })
  }

  const peticionPut = async () => {
    delete empleadoSeleccionado.eliminado;
    delete empleadoSeleccionado.nomDis
    await axios.put(baseUrl + "/" + empleadoSeleccionado.codEmp, empleadoSeleccionado)
      .then(response => {
        var respuesta = response.data;
        var dataAuxiliar = empleado;
        dataAuxiliar.map(empleado => {
          if (empleado.codEmp === empleadoSeleccionado.codEmp) {
            empleado.cod = respuesta.codEmp;
            empleado.nom = respuesta.nomEmp;
            empleado.dni = respuesta.dni;
            empleado.telf = respuesta.telfEmp;
            empleado.dis = respuesta.codDis;
            empleado.dir = respuesta.dirEmp;
            empleado.email = respuesta.email;
          }
        })
        peticionGet();
        abrirCerrarModalEditar();
      }).catch(error => {
        console.log(error);
      })
  }

  const peticionDelete = async () => {
    await axios.delete(baseUrl + "/" + empleadoSeleccionado.codEmp)
      .then(response => {
        setEmpleado(empleado.filter(empleado => empleado.codEmp == response.data))
        peticionGet();
        abrirCerrarModalEliminar();
      }).catch(error => {
        console.log(error);
      })
  }

  const seleccionarEmpleado = (empleado, caso) => {
    setEmpleadoSeleccionado(empleado);
    (caso === "Editar") ?
      abrirCerrarModalEditar() : abrirCerrarModalEliminar();
  }

  useEffect(() => {
    peticionGet();
  }, [])

  useEffect(() => {
    distritosGet();
  }, [])

  return (
    <div>
      <div class="card">
        <div class="card-body">
          <h5 className="card-title">Lista de Empleados</h5>
          <hr />
          <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <button type="button" className="btn btn-primary" onClick={() => abrirCerrarModalInsertar()}>Registrar Empleado</button>
              <ul class="navbar-nav mr-auto"></ul>
            </div>
          </nav>
          <hr />
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Dni</th>
                <th>Teléfono</th>
                <th>Distrito</th>
                <th>Dirección</th>
                <th>Correo</th>
                <th>Actualizar</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {empleado.map(empleado => (
                <tr key={empleado.codEmp}>
                  <td>{empleado.nomEmp}</td>
                  <td>{empleado.dni}</td>
                  <td>{empleado.telfEmp}</td>
                  <td>{empleado.nomDis}</td>
                  <td>{empleado.dirEmp}</td>
                  <td>{empleado.email}</td>
                  <td>
                    <button className="btn btn-primary" onClick={() => seleccionarEmpleado(empleado, "Editar")}>Actualizar</button>
                  </td>
                  <td>
                    <button className="btn btn-danger" onClick={() => seleccionarEmpleado(empleado, "Eliminar")}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal isOpen={modalInsertar}>
        <ModalHeader>Añadir Empleado</ModalHeader>
        <ModalBody>
          <form>
            <div className="mb-3">
              <label htmlFor="nomEmp" className="form-label">Nombre y Apellidos</label>
              <input type="text" className="form-control" id="nomEmp" name="nomEmp" onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="dni" className="form-label">Documento de Identidad</label>
              <input type="text" className="form-control" id="dni" name="dni" onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="telfEmp" className="form-label">Teléfono</label>
              <input type="text" className="form-control" id="telfEmp" name="telfEmp" onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="codDis" className="form-label">Distrito</label>
              <select className="form-control" id="codDis" name="codDis" onChange={handleChange}>
                {distritos.map(distritos => (
                  <option key={distritos.codDis} value={distritos.codDis}>{distritos.nomDis}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="dirEmp" className="form-label">Dirección</label>
              <input type="text" className="form-control" id="dirEmp" name="dirEmp" onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Correo</label>
              <input type="text" className="form-control" id="email" name="email" onChange={handleChange} />
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => peticionPost()} >Añadir</button>{"   "}
          <button className="btn btn-danger" onClick={() => abrirCerrarModalInsertar()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Empleado</ModalHeader>
        <ModalBody>
          <form>
            <div className="mb-3">
              <label htmlFor="codEmp" className="form-label">Código</label>
              <input type="text" className="form-control" id="codEmp" name="codEmp" readOnly value={empleadoSeleccionado && empleadoSeleccionado.codEmp} />
            </div>
            <div className="mb-3">
              <label htmlFor="nomEmp" className="form-label">Nombre y Apellidos</label>
              <input type="text" className="form-control" id="nomEmp" name="nomEmp" onChange={handleChange} value={empleadoSeleccionado && empleadoSeleccionado.nomEmp} />
            </div>
            <div className="mb-3">
              <label htmlFor="dni" className="form-label">Documento de Identidad</label>
              <input type="text" className="form-control" id="dni" name="dni" onChange={handleChange} value={empleadoSeleccionado && empleadoSeleccionado.dni} />
            </div>
            <div className="mb-3">
              <label htmlFor="telfEmp" className="form-label">Teléfono</label>
              <input type="text" className="form-control" id="telfEmp" name="telfEmp" onChange={handleChange} value={empleadoSeleccionado && empleadoSeleccionado.telfEmp} />
            </div>
            <div className="mb-3">
              <label htmlFor="codDis" className="form-label">Distrito</label>
              <select className="form-control" id="codDis" name="codDis" onChange={handleChange} value={empleadoSeleccionado && empleadoSeleccionado.codDis} >
                {distritos.map(distritos => (
                  <option key={distritos.codDis} value={distritos.codDis}>{distritos.nomDis}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="dirEmp" className="form-label">Dirección</label>
              <input type="text" className="form-control" id="dirEmp" name="dirEmp" onChange={handleChange} value={empleadoSeleccionado && empleadoSeleccionado.dirEmp} />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Correo</label>
              <input type="text" className="form-control" id="email" name="email" onChange={handleChange} value={empleadoSeleccionado && empleadoSeleccionado.email} />
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => peticionPut()} >Editar</button>{"   "}
          <button className="btn btn-danger" onClick={() => abrirCerrarModalEditar()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEliminar}>
        <ModalBody>
          Estás seguro que deseas eliminar al Empleado {empleadoSeleccionado && empleadoSeleccionado.nomEmp}?
                </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={() => peticionDelete()}>Sí</button>
          <button className="btn btn-secondary" onClick={() => abrirCerrarModalEliminar()}>No</button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default Empleados
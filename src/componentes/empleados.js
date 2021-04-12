import React from 'react';
import axios from 'axios';
import {useState, useEffect} from 'react';
import {Modal,ModalBody,ModalFooter,ModalHeader} from 'reactstrap';

const Empleados = () =>{
  const baseUrl = "http://api.pyrmultimediasac.com/api/empleados";
  const distUrl = "http://api.pyrmultimediasac.com/api/distritos/listarDistritos";
  const [empleado, setEmpleado] = useState([]);
  const [distritos, setDistritos] = useState([]);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState({
    cod_emp: "",
    nom_emp: "",
    dni: "",
    telf_emp: "",
    cod_dis: "",
    dir_emp: "",
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
    await axios.get(baseUrl + "/listarEmpleados")
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
    delete empleadoSeleccionado.cod_emp;
    await axios.post(baseUrl+"/registrarEmpleado", empleadoSeleccionado)
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
    delete empleadoSeleccionado.nom_dis
    await axios.put(baseUrl + "/actualizarEmpleado", empleadoSeleccionado)
      .then(response => {
        var respuesta = response.data;
        var dataAuxiliar = empleado;
        dataAuxiliar.map(empleado => {
          if (empleado.cod_emp === empleadoSeleccionado.cod_emp) {
            empleado.cod = respuesta.cod_emp;
            empleado.nom = respuesta.nom_emp;
            empleado.dni = respuesta.dni;
            empleado.telf = respuesta.telf_emp;
            empleado.dis = respuesta.cod_dis;
            empleado.dir = respuesta.dir_emp;
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
    await axios.post(baseUrl + "/eliminarEmpleado", empleadoSeleccionado)
    .then(response => {
      var respuesta = response.data;
      var dataAuxiliar = empleado;
      dataAuxiliar.map(empleado => {
        if (empleado.cod_emp === empleadoSeleccionado.cod_emp) {
          empleado.cod = respuesta.cod_emp;
        }
      })
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
                <tr key={empleado.cod_emp}>
                  <td>{empleado.nom_emp}</td>
                  <td>{empleado.dni}</td>
                  <td>{empleado.telf_emp}</td>
                  <td>{empleado.nom_dis}</td>
                  <td>{empleado.dir_emp}</td>
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
              <label htmlFor="nom_emp" className="form-label">Nombre y Apellidos</label>
              <input type="text" className="form-control" id="nom_emp" name="nom_emp" onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="dni" className="form-label">Documento de Identidad</label>
              <input type="text" className="form-control" id="dni" name="dni" onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="telf_emp" className="form-label">Teléfono</label>
              <input type="text" className="form-control" id="telf_emp" name="telf_emp" onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="cod_dis" className="form-label">Distrito</label>
              <select className="form-control" id="cod_dis" name="cod_dis" onChange={handleChange}>
                <option value="0">Seleccione</option>
                {distritos.map(distritos => (
                  <option key={distritos.cod_dis} value={distritos.cod_dis}>{distritos.nom_dis}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="dir_emp" className="form-label">Dirección</label>
              <input type="text" className="form-control" id="dir_emp" name="dir_emp" onChange={handleChange} />
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
            <div className="mb-3" hidden>
              <label htmlFor="cod_emp" className="form-label">Código</label>
              <input type="text" className="form-control" id="cod_emp" name="cod_emp" readOnly value={empleadoSeleccionado && empleadoSeleccionado.cod_emp} />
            </div>
            <div className="mb-3">
              <label htmlFor="nom_emp" className="form-label">Nombre y Apellidos</label>
              <input type="text" className="form-control" id="nom_emp" name="nom_emp" onChange={handleChange} value={empleadoSeleccionado && empleadoSeleccionado.nom_emp} />
            </div>
            <div className="mb-3">
              <label htmlFor="dni" className="form-label">Documento de Identidad</label>
              <input type="text" className="form-control" id="dni" name="dni" onChange={handleChange} value={empleadoSeleccionado && empleadoSeleccionado.dni} />
            </div>
            <div className="mb-3">
              <label htmlFor="telf_emp" className="form-label">Teléfono</label>
              <input type="text" className="form-control" id="telf_emp" name="telf_emp" onChange={handleChange} value={empleadoSeleccionado && empleadoSeleccionado.telf_emp} />
            </div>
            <div className="mb-3">
              <label htmlFor="codDis" className="form-label">Distrito</label>
              <select className="form-control" id="cod_dis" name="cod_dis" onChange={handleChange} value={empleadoSeleccionado && empleadoSeleccionado.cod_dis} >
                {distritos.map(distritos => (
                  <option key={distritos.cod_dis} value={distritos.cod_dis}>{distritos.nom_dis}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="dir_emp" className="form-label">Dirección</label>
              <input type="text" className="form-control" id="dir_emp" name="dir_emp" onChange={handleChange} value={empleadoSeleccionado && empleadoSeleccionado.dir_emp} />
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
          Estás seguro que deseas eliminar al Empleado {empleadoSeleccionado && empleadoSeleccionado.nom_emp}?
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
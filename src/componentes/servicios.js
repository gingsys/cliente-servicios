import React from 'react';
import axios from 'axios';
import {useState, useEffect} from 'react';
import {Modal,ModalBody,ModalFooter,ModalHeader} from 'reactstrap';

const Servicios = () =>{
    const baseUrl = "http://api.pyrmultimediasac.com/api/servicios";
    const clieUrl = "http://api.pyrmultimediasac.com/api/clientes/listarClientes";
    const empUrl = "http://api.pyrmultimediasac.com/api/empleados/listarEmpleados";
    const [servicios, setServicios] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [modalInsertar, setModalInsertar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [modalEliminar, setModalEliminar] = useState(false);
    const [servicioSeleccionado, setServicioSeleccionado] = useState({
        cod_serv: 0,
        cod_cli: 0,
        nom_cli:"",
        des_serv: "",
        fecha: "",
        cod_emp: 0,
        nom_emp: ""
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
        setServicioSeleccionado({
            ...servicioSeleccionado,
            [name]: value
        });
        console.log(servicioSeleccionado);
    }

    const peticionGet = async () => {
        await axios.get(baseUrl+"/listarServicios")
            .then(response => {
                setServicios(response.data);
            }).catch(error => {
                console.log(error);
            })
    }

    const clientesGet = async () => {
        await axios.get(clieUrl)
            .then(response => {
                setClientes(response.data);
            }).catch(error => {
                console.log(error);
            })
    }

    const empleadosGet = async () => {
        await axios.get(empUrl)
            .then(response => {
                setEmpleados(response.data);
            }).catch(error => {
                console.log(error);
            })
    }

    const peticionPost = async () => {
        delete servicioSeleccionado.cod_serv;
        servicioSeleccionado.cod_emp=parseInt(servicioSeleccionado.cod_emp);
        servicioSeleccionado.cod_cli=parseInt(servicioSeleccionado.cod_cli);
        await axios.post(baseUrl+"/registrarServicios", servicioSeleccionado)
            .then(response => {
                setServicios(servicios.concat(response.data));
                peticionGet();
                abrirCerrarModalInsertar();
            }).catch(error => {
                console.log(error);
            })
    }

    const peticionPut = async () => {
        delete servicioSeleccionado.nom_cli;
        delete servicioSeleccionado.nom_emp;
        servicioSeleccionado.cod_emp=parseInt(servicioSeleccionado.cod_emp);
        servicioSeleccionado.cod_cli=parseInt(servicioSeleccionado.cod_cli);
        servicioSeleccionado.cod_serv=parseInt(servicioSeleccionado.cod_serv);
        await axios.put(baseUrl + "/actualizarServicio", servicioSeleccionado)
            .then(response => {
                var respuesta = response.data;
                var dataAuxiliar = servicios;
                dataAuxiliar.map(servicio => {
                    if (servicio.cod_serv === servicioSeleccionado.cod_serv) {
                        servicio.cod_serv = respuesta.cod_serv;
                        servicio.cod_cli = respuesta.cod_cli;
                        servicio.des_serv = respuesta.des_serv;
                        servicio.fecha = respuesta.fecha;
                        servicio.cod_emp = respuesta.cod_emp;
                    }
                })
                peticionGet();
                abrirCerrarModalEditar();
            }).catch(error => {
                console.log(error);
            })
    }

    const peticionDelete = async () => {
        await axios.post(baseUrl + "/eliminarServicio",servicioSeleccionado)
        .then(response => {
            var respuesta = response.data;
            var dataAuxiliar = servicios;
            dataAuxiliar.map(servicio => {
                if (servicio.cod_serv === servicioSeleccionado.cod_serv) {
                    servicio.cod_serv = respuesta.cod_serv;
                }
            })
                peticionGet();
                abrirCerrarModalEliminar();
            }).catch(error => {
                console.log(error);
            })
    }

    const seleccionarServicios = (servicio, caso) => {
        setServicioSeleccionado(servicio);
        (caso === "Editar") ?
            abrirCerrarModalEditar() : abrirCerrarModalEliminar();
    }

    useEffect(() => {
        peticionGet();
    }, [])

    useEffect(() => {
        clientesGet();
    }, [])

    useEffect(() => {
        empleadosGet();
    }, [])

    return(
        <div>
            <div class="card">
                <div class="card-body">
                    <h5 className="card-title">Lista de Servicios</h5>
                    <hr />
                    <nav class="navbar navbar-expand-lg navbar-light bg-light">
                        <div class="collapse navbar-collapse" id="navbarSupportedContent">
                            <button type="button" className="btn btn-primary" onClick={() => abrirCerrarModalInsertar()}>Registrar Servicio</button>
                            <ul class="navbar-nav mr-auto"></ul>
                        </div>
                    </nav>
                    <hr /> 
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Nombre de Cliente</th>
                                <th>Descripción de Servicio</th>
                                <th>Fecha de Atención</th>
                                <th>Empleado Asignado</th>
                                <th>Actualizar</th>
                                <th>Eliminar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {servicios.map(servicios => (
                                <tr key={servicios.cod_serv}>
                                    <td>{servicios.nom_cli}</td>
                                    <td>{servicios.des_serv}</td>
                                    <td>{servicios.fecha}</td>
                                    <td>{servicios.nom_emp}</td>
                                    <td>
                                        <button className="btn btn-primary" onClick={() => seleccionarServicios(servicios, "Editar")}>Actualizar</button>
                                    </td>
                                    <td>
                                        <button className="btn btn-danger" onClick={() => seleccionarServicios(servicios, "Eliminar")}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal isOpen={modalInsertar}>
                <ModalHeader>Añadir Servicio</ModalHeader>
                <ModalBody>
                    <form>
                        <div className="mb-3">
                        <label htmlFor="cod_cli" className="form-label">Seleccione Cliente</label>
                            <select className="form-control" id="cod_cli" name="cod_cli" onChange={handleChange}>
                                <option value="0">Seleccione</option>
                                {clientes.map(clientes => (
                                    <option key={clientes.cod_cli} value={clientes.cod_cli}>{clientes.nom_cli}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="des_serv" className="form-label">Descripción del Servicio</label>
                            <textarea class="form-control" id="des_serv" name="des_serv" onChange={handleChange}></textarea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="fecha" className="form-label">Seleccione Fecha de Atención</label>
                            <input class="form-control" type="date" id="fecha" name="fecha" onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="cod_emp" className="form-label">Asigne Empleado</label>
                            <select className="form-control" id="cod_emp" name="cod_emp" onChange={handleChange}>
                                <option value="0">Seleccione</option>
                                {empleados.map(empleados => (
                                    <option key={empleados.cod_emp} value={empleados.cod_emp}>{empleados.nom_emp}</option>
                                ))}
                            </select>
                        </div>
                    </form>
                </ModalBody>
                <ModalFooter>
                    <button className="btn btn-primary" onClick={() => peticionPost()} >Añadir</button>{"   "}
                    <button className="btn btn-danger" onClick={() => abrirCerrarModalInsertar()}>Cancelar</button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={modalEditar}>
                <ModalHeader>Editar Servicio</ModalHeader>
                <ModalBody>
                    <form>
                        <div className="mb-3" hidden>
                            <label htmlFor="cod_serv" className="form-label">Código</label>
                            <input type="text" className="form-control" id="cod_serv" name="cod_serv" readOnly value={servicioSeleccionado && servicioSeleccionado.cod_serv} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="cod_cli" className="form-label">Cliente</label>
                            <select className="form-control" id="cod_cli" name="cod_cli" onChange={handleChange} disabled value={servicioSeleccionado && servicioSeleccionado.cod_cli} >
                                {clientes.map(clientes => (
                                    <option key={clientes.cod_cli} value={clientes.cod_cli}>{clientes.nom_cli}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="des_serv" className="form-label">Descripción del Servicio</label>
                            <textarea type="text" className="form-control" id="des_serv" name="des_serv" onChange={handleChange} value={servicioSeleccionado && servicioSeleccionado.des_serv} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="fecha" className="form-label">Fecha de Atención</label>
                            <input type="date" className="form-control" id="fecha" name="fecha" onChange={handleChange} value={servicioSeleccionado && servicioSeleccionado.fecha} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="cod_emp" className="form-label">Asigne Empleado</label>
                            <select className="form-control" id="cod_emp" name="cod_emp" onChange={handleChange} value={servicioSeleccionado && servicioSeleccionado.cod_emp} >
                                {empleados.map(empleados => (
                                    <option key={empleados.cod_emp} value={empleados.cod_emp}>{empleados.nom_emp}</option>
                                ))}
                            </select>
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
                    Estás seguro que deseas eliminar el servicio: {servicioSeleccionado && servicioSeleccionado.des_serv} de {servicioSeleccionado && servicioSeleccionado.nom_cli}? 
                </ModalBody>
                <ModalFooter>
                    <button className="btn btn-danger" onClick={() => peticionDelete()}>Sí</button>
                    <button className="btn btn-secondary" onClick={() => abrirCerrarModalEliminar()}>No</button>
                </ModalFooter>
            </Modal>
        </div>
    )
}

export default Servicios
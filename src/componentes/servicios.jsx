import React from 'react';
import axios from 'axios';
import {useState, useEffect} from 'react';
import {Modal,ModalBody,ModalFooter,ModalHeader} from 'reactstrap';

const Servicios = () =>{
    const baseUrl = "https://localhost:44350/api/servicios";
    const clieUrl = "https://localhost:44350/api/clientes";
    const empUrl = "https://localhost:44350/api/empleados";
    const [servicios, setServicios] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [modalInsertar, setModalInsertar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [modalEliminar, setModalEliminar] = useState(false);
    const [servicioSeleccionado, setServicioSeleccionado] = useState({
        codServ: 0,
        codCli: 0,
        nomCli:"",
        desServ: "",
        fecha: "",
        codEmp: 0,
        nomEmp: ""
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
        await axios.get(baseUrl)
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
        delete servicioSeleccionado.codServ;
        servicioSeleccionado.codEmp=parseInt(servicioSeleccionado.codEmp);
        servicioSeleccionado.codCli=parseInt(servicioSeleccionado.codCli);
        await axios.post(baseUrl, servicioSeleccionado)
            .then(response => {
                setServicios(servicios.concat(response.data));
                peticionGet();
                abrirCerrarModalInsertar();
            }).catch(error => {
                console.log(error);
            })
    }

    const peticionPut = async () => {
        delete servicioSeleccionado.nomCli;
        delete servicioSeleccionado.nomEmp;
        servicioSeleccionado.codEmp=parseInt(servicioSeleccionado.codEmp);
        await axios.put(baseUrl + "/" + servicioSeleccionado.codServ, servicioSeleccionado)
            .then(response => {
                var respuesta = response.data;
                var dataAuxiliar = servicios;
                dataAuxiliar.map(servicio => {
                    if (servicio.codServ === servicioSeleccionado.codServ) {
                        servicio.codServ = respuesta.codServ;
                        servicio.codCli = respuesta.codCli;
                        servicio.desServ = respuesta.desServ;
                        servicio.fecha = respuesta.fecha;
                        servicio.codEmp = respuesta.codEmp;
                    }
                })
                peticionGet();
                abrirCerrarModalEditar();
            }).catch(error => {
                console.log(error);
            })
    }

    const peticionDelete = async () => {
        await axios.delete(baseUrl + "/" + servicioSeleccionado.codServ)
            .then(response => {
                setServicios(servicios.filter(servicios => servicios.codServ == response.data))
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
                                <tr key={servicios.codServ}>
                                    <td>{servicios.nomCli}</td>
                                    <td>{servicios.desServ}</td>
                                    <td>{servicios.fecha}</td>
                                    <td>{servicios.nomEmp}</td>
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
                        <label htmlFor="codCli" className="form-label">Seleccione Cliente</label>
                            <select className="form-control" id="codCli" name="codCli" onChange={handleChange}>
                                {clientes.map(clientes => (
                                    <option key={clientes.codCli} value={clientes.codCli}>{clientes.nomCli}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="desServ" className="form-label">Descripción del Servicio</label>
                            <textarea class="form-control" id="desServ" name="desServ" onChange={handleChange}></textarea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="fecha" className="form-label">Seleccione Fecha de Atención</label>
                            <input class="form-control" type="date" id="fecha" name="fecha" onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="codEmp" className="form-label">Asigne Empleado</label>
                            <select className="form-control" id="codEmp" name="codEmp" onChange={handleChange}>
                                {empleados.map(empleados => (
                                    <option key={empleados.codEmp} value={empleados.codEmp}>{empleados.nomEmp}</option>
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
                        <div className="mb-3">
                            <label htmlFor="codServ" className="form-label">Código</label>
                            <input type="text" className="form-control" id="codServ" name="codServ" readOnly value={servicioSeleccionado && servicioSeleccionado.codServ} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="codCli" className="form-label">Cliente</label>
                            <select className="form-control" id="codCli" name="codCli" onChange={handleChange} disabled value={servicioSeleccionado && servicioSeleccionado.codCli} >
                                {clientes.map(clientes => (
                                    <option key={clientes.codCli} value={clientes.codCli}>{clientes.nomCli}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="desServ" className="form-label">Descripción del Servicio</label>
                            <textarea type="text" className="form-control" id="desServ" name="desServ" onChange={handleChange} value={servicioSeleccionado && servicioSeleccionado.desServ} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="fecha" className="form-label">Fecha de Atención</label>
                            <input type="date" className="form-control" id="fecha" name="fecha" onChange={handleChange} value={servicioSeleccionado && servicioSeleccionado.fecha} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="codEmp" className="form-label">Asigne Empleado</label>
                            <select className="form-control" id="codEmp" name="codEmp" onChange={handleChange} value={servicioSeleccionado && servicioSeleccionado.codEmp} >
                                {empleados.map(empleados => (
                                    <option key={empleados.codEmp} value={empleados.codEmp}>{empleados.nomEmp}</option>
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
                    Estás seguro que deseas eliminar el servicio: {servicioSeleccionado && servicioSeleccionado.desServ} de {servicioSeleccionado && servicioSeleccionado.nomCli}? 
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
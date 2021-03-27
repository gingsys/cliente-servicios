import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const Clientes = () => {

    const baseUrl = "https://localhost:44350/api/clientes";
    const distUrl = "https://localhost:44350/api/distritos";
    const [clientes, setClientes] = useState([]);
    const [distritos, setDistritos] = useState([]);
    const [modalInsertar, setModalInsertar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [modalEliminar, setModalEliminar] = useState(false);
    const [clienteSeleccionado, setClienteSeleccionado] = useState({
        codCli: "",
        nomCli: "",
        dniRuc: "",
        telfCli: "",
        codDis: "",
        nomDis: "",
        dirCli: "",
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
        setClienteSeleccionado({
            ...clienteSeleccionado,
            [name]: value
        });
        console.log(clienteSeleccionado);
    }

    const peticionGet = async () => {
        await axios.get(baseUrl)
            .then(response => {
                setClientes(response.data);
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
        delete clienteSeleccionado.codCli;
        await axios.post(baseUrl, clienteSeleccionado)
            .then(response => {
                setClientes(clientes.concat(response.data));
                peticionGet();
                abrirCerrarModalInsertar();
            }).catch(error => {
                console.log(error);
            })
    }

    const peticionPut = async () => {
        delete clienteSeleccionado.eliminado;
        delete clienteSeleccionado.nomDis
        await axios.put(baseUrl + "/" + clienteSeleccionado.codCli, clienteSeleccionado)
            .then(response => {
                var respuesta = response.data;
                var dataAuxiliar = clientes;
                dataAuxiliar.map(cliente => {
                    if (cliente.codCli === clienteSeleccionado.codCli) {
                        cliente.cod = respuesta.codCli;
                        cliente.nom = respuesta.nomCli;
                        cliente.dniruc = respuesta.dniRuc;
                        cliente.telf = respuesta.telfCli;
                        cliente.dis = respuesta.codDis;
                        cliente.dir = respuesta.dirCli;
                        cliente.email = respuesta.email;
                    }
                })
                peticionGet();
                abrirCerrarModalEditar();
            }).catch(error => {
                console.log(error);
            })
    }

    const peticionDelete = async () => {
        await axios.delete(baseUrl + "/" + clienteSeleccionado.codCli)
            .then(response => {
                setClientes(clientes.filter(clientes => clientes.codCli == response.data))
                peticionGet();
                abrirCerrarModalEliminar();
            }).catch(error => {
                console.log(error);
            })
    }

    const seleccionarCliente = (cliente, caso) => {
        setClienteSeleccionado(cliente);
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
                    <h5 className="card-title">Lista de Clientes</h5>
                    <hr />
                    <nav class="navbar navbar-expand-lg navbar-light bg-light">
                        <div class="collapse navbar-collapse" id="navbarSupportedContent">
                            <button type="button" className="btn btn-primary" onClick={() => abrirCerrarModalInsertar()}>Registrar Cliente</button>
                            <ul class="navbar-nav mr-auto"></ul>
                        </div>
                    </nav>
                    <hr />
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Dni/RUC</th>
                                <th>Teléfono</th>
                                <th>Distrito</th>
                                <th>Dirección</th>
                                <th>Correo</th>
                                <th>Actualizar</th>
                                <th>Eliminar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientes.map(clientes => (
                                <tr key={clientes.codCli}>
                                    <td>{clientes.nomCli}</td>
                                    <td>{clientes.dniRuc}</td>
                                    <td>{clientes.telfCli}</td>
                                    <td>{clientes.nomDis}</td>
                                    <td>{clientes.dirCli}</td>
                                    <td>{clientes.email}</td>
                                    <td>
                                        <button className="btn btn-primary" onClick={() => seleccionarCliente(clientes, "Editar")}>Actualizar</button>
                                    </td>
                                    <td>
                                        <button className="btn btn-danger" onClick={() => seleccionarCliente(clientes, "Eliminar")}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal isOpen={modalInsertar}>
                <ModalHeader>Añadir Cliente</ModalHeader>
                <ModalBody>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="nomCli" className="form-label">Nombre</label>
                            <input type="text" className="form-control" id="nomCli" name="nomCli" onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="dniRuc" className="form-label">DNI/RUC</label>
                            <input type="text" className="form-control" id="dniRuc" name="dniRuc" onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="telfCli" className="form-label">Teléfono</label>
                            <input type="text" className="form-control" id="telfCli" name="telfCli" onChange={handleChange} />
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
                            <label htmlFor="dirCli" className="form-label">Dirección</label>
                            <input type="text" className="form-control" id="dirCli" name="dirCli" onChange={handleChange} />
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
                <ModalHeader>Editar Cliente</ModalHeader>
                <ModalBody>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="codCli" className="form-label">Código</label>
                            <input type="text" className="form-control" id="codCli" name="codCli" readOnly value={clienteSeleccionado && clienteSeleccionado.codCli} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="nomCli" className="form-label">Nombre</label>
                            <input type="text" className="form-control" id="nomCli" name="nomCli" onChange={handleChange} value={clienteSeleccionado && clienteSeleccionado.nomCli} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="dniRuc" className="form-label">DNI/RUC</label>
                            <input type="text" className="form-control" id="dniRuc" name="dniRuc" onChange={handleChange} value={clienteSeleccionado && clienteSeleccionado.dniRuc} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="telfCli" className="form-label">Teléfono</label>
                            <input type="text" className="form-control" id="telfCli" name="telfCli" onChange={handleChange} value={clienteSeleccionado && clienteSeleccionado.telfCli} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="codDis" className="form-label">Distrito</label>
                            <select className="form-control" id="codDis" name="codDis" onChange={handleChange} value={clienteSeleccionado && clienteSeleccionado.codDis} >
                                {distritos.map(distritos => (
                                    <option key={distritos.codDis} value={distritos.codDis}>{distritos.nomDis}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="dirCli" className="form-label">Dirección</label>
                            <input type="text" className="form-control" id="dirCli" name="dirCli" onChange={handleChange} value={clienteSeleccionado && clienteSeleccionado.dirCli} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Correo</label>
                            <input type="text" className="form-control" id="email" name="email" onChange={handleChange} value={clienteSeleccionado && clienteSeleccionado.email} />
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
                    Estás seguro que deseas eliminar al Cliente {clienteSeleccionado && clienteSeleccionado.nomCli}?
                </ModalBody>
                <ModalFooter>
                    <button className="btn btn-danger" onClick={() => peticionDelete()}>Sí</button>
                    <button className="btn btn-secondary" onClick={() => abrirCerrarModalEliminar()}>No</button>
                </ModalFooter>
            </Modal>
        </div>
    )
}

export default Clientes